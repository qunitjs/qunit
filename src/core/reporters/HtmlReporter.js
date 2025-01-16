import diff from '../diff.js';
import dump from '../dump.js';
import { prioritySymbol } from '../events.js';
import { window, document, navigator, StringMap } from '../globals.js';
import { extend, errorString, escapeText } from '../utilities.js';
import version from '../version.js';
import fuzzysort from 'fuzzysort';

const hasOwn = Object.prototype.hasOwnProperty;

const DOM = {
  on (elem, type, fn) {
    elem.addEventListener(type, fn, false);
  },
  off (elem, type, fn) {
    elem.removeEventListener(type, fn, false);
  },
  onEach (elems, type, fn) {
    let i = elems.length;
    while (i--) {
      DOM.on(elems[i], type, fn);
    }
  },
  // TODO: Use HTMLElement.classList. IE11+, except toggle(x,y), add(x,y), or remove(x,y).
  // TODO: Verify that eslint-plugin-compat catches those exceptions.
  hasClass (elem, name) {
    return (' ' + elem.className + ' ').indexOf(' ' + name + ' ') >= 0;
  },
  addClass (elem, name) {
    if (!DOM.hasClass(elem, name)) {
      elem.className += (elem.className ? ' ' : '') + name;
    }
  },
  toggleClass (elem, name, force) {
    if (force || (typeof force === 'undefined' && !DOM.hasClass(elem, name))) {
      DOM.addClass(elem, name);
    } else {
      DOM.removeClass(elem, name);
    }
  },
  removeClass (elem, name) {
    let set = ' ' + elem.className + ' ';

    // Class name may appear multiple times
    while (set.indexOf(' ' + name + ' ') >= 0) {
      set = set.replace(' ' + name + ' ', ' ');
    }

    // Trim for prettiness
    elem.className = trim(set);
  }
};

function trim (string) {
  if (typeof string.trim === 'function') {
    return string.trim();
  } else {
    return string.replace(/^\s+|\s+$/g, '');
  }
}

function stripHtml (string) {
  // Strip tags, html entity and whitespaces
  return string
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/&quot;/g, '')
    .replace(/\s+/g, '');
}

export default class HtmlReporter {
  /**
   * @param {QUnit} QUnit
   * @param {Object} [options] For internal usage
   */
  static init (QUnit, options = {}) {
    return new HtmlReporter(QUnit, extend(options, {
      urlParams: QUnit.urlParams,
      // This must use a live reference (i.e. not store a copy), because
      // users may apply their settings to QUnit.config anywhere between
      // loading qunit.js and the last QUnit.begin() listener finishing.
      config: QUnit.config,
      abort: function () {
        QUnit.config._pq.abort();
      }
    }));
  }

  /**
   * @internal Use QUnit.reporters.html.init() instead.
   *
   * @param {QUnit} QUnit
   * @param {Object} options
   * @param {Object} options.urlParams
   * @param {Object} options.config
   * - `boolean` options.config.hidepassed
   * - `boolean` options.config.collapse For test result
   * - `string` options.config.filter
   * - `?string` options.config.moduleId For module selector
   * - `?string` options.config.testId For test result, rerun link
   * - `number` options.config.maxDepth For test result, error message
   * @param {Function} options.abort
   * @param {HTMLElement|undefined|null} options.element Output element
   * If set to HTMLElement, the report will be written to this element.
   * If set to undefined, then at `QUnit.on('runStart')` we look for `#qunit`
   * and use that if it exists.
   * If set to null, the reporter is disabled.
   */
  constructor (QUnit, options) {
    // Don't init the HTML Reporter in non-browser environments
    if (!window || !document || !document.querySelector || options.element === null) {
      return;
    }
    this.stats = {
      failedTests: [],
      defined: 0,
      completed: 0
    };
    this.urlParams = options.urlParams;
    this.config = options.config;
    this.abort = options.abort;
    this.hiddenTests = [];
    // Keep state for our hidepassed toggle, which can change without a reload.
    // null indicates we use the config/urlParams. Otherwise this will be
    // true/undefined based on checkbox changes. We don't use false here since
    // that would serialize in makeUrl() as "false".
    this.hidepassed = null;
    this.collapseNext = false;
    this.unfilteredUrl = this.makeUrl({
      filter: undefined,
      module: undefined,
      moduleId: undefined,
      testId: undefined
    });
    this.dropdownData = null;

    // We must not fallback to creating `<div id="qunit">` ourselves if it
    // does not exist, because not having `<div id="qunit">` is how projects
    // indicate that they wish to run QUnit headless, and do their own reporter.
    //
    // If options.element was set to HTMLElement, or if `<div id="qunit">` already
    // exists (i.e. qunit.js script is placed at end of `<body>`), then we render
    // an initial layout now (which is mostly inert).
    // Otherwise, we wait until QUnit.start and the onRunStart event, which by
    // default is called from window.onload.
    //
    // If no element is found now, leave this.element as undefined (unchanged).
    // We will try again at onRunStart().
    this.element = options.element || document.querySelector('#qunit') || undefined;
    this.elementBanner = null;
    this.elementDisplay = null;
    this.elementTests = null;
    if (this.element) {
      this.appendInterface();
    }

    // NOTE: Only listen for "runStart" now.
    // Other event handlers are added via listen() from onRunStart,
    // after we know that the element exists. This reduces overhead and avoids
    // potential internal errors when the HTML Reporter is disabled.
    this.listen = function () {
      this.listen = null;
      // It's important that we're in the callback queue before any user-defined
      // "QUnit.begin()", because, if those may throw, ours wouldn't run and
      // the UI would remain blank or incomplete.
      // https://github.com/qunitjs/qunit/issues/1792
      QUnit.begin(this.onBegin.bind(this), prioritySymbol);
      // Use prioritySignal for testStart() to increase availability
      // of the HTML API for TESTID elements toward other event listeners.
      QUnit.testStart(this.onTestStart.bind(this), prioritySymbol);
      QUnit.log(this.onLog.bind(this), prioritySymbol);
      QUnit.testDone(this.onTestDone.bind(this));
      QUnit.on('runEnd', this.onRunEnd.bind(this));

      // It's important that we don't listen for onError until after
      // this.element is found and populated by appendInterface(), as
      // otherwise it will fail in appendTest() to display error details.
      // We've given on() a memory for "error" events to accomodate
      // late listening.
      QUnit.on('error', this.onError.bind(this), prioritySymbol);
    };
    QUnit.on('runStart', this.onRunStart.bind(this), prioritySymbol);
  }

  // Handle "submit" event from "filter" or "moduleFilter" field.
  onFilterSubmit (ev) {
    // Trim potential accidental whitespace so that QUnit doesn't throw an error about no tests matching the filter.
    const filterInputElem = this.element.querySelector('#qunit-filter-input');
    filterInputElem.value = trim(filterInputElem.value);

    this.applyUrlParams();

    if (ev) {
      ev.preventDefault();
    }

    return false;
  }

  // Handle "click" events on toolbar checkboxes and "change" for select menus.
  // Updates the URL with the new state of `config.urlConfig` values.
  onToolbarChanged (ev) {
    const field = ev.currentTarget;

    // Detect if field is a select menu or a checkbox
    let value;
    if ('selectedIndex' in field) {
      value = field.options[field.selectedIndex].value || undefined;
    } else {
      value = field.checked ? (field.defaultValue || true) : undefined;
    }

    let updatedUrl = this.makeUrl({
      [field.name]: value
    });

    // Check if we can apply the change without a page refresh
    if (field.name === 'hidepassed' && 'replaceState' in window.history) {
      // Set either true or undefined, which will now take precedence over
      // the original QUnit.urlParams in makeUrl()
      this.hidepassed = value;
      const tests = this.elementTests;

      if (field.checked) {
        const length = tests.children.length;
        const children = tests.children;
        for (let i = 0; i < length; i++) {
          const test = children[i];
          const className = test ? test.className : '';
          const classNameHasPass = className.indexOf('pass') > -1;
          const classNameHasSkipped = className.indexOf('skipped') > -1;

          if (classNameHasPass || classNameHasSkipped) {
            this.hiddenTests.push(test);
          }
        }

        // Optimization: Avoid for-of iterator overhead.
        for (let i = 0; i < this.hiddenTests.length; i++) {
          tests.removeChild(this.hiddenTests[i]);
        }
      } else {
        // Optimization: Avoid Array.shift() which would mutate the array many times.
        // As of Chrome 126, HTMLElement.append(...hiddenTests) is still slower than
        // calling appendChild in a loop.
        for (let i = 0; i < this.hiddenTests.length; i++) {
          tests.appendChild(this.hiddenTests[i]);
        }
        this.hiddenTests.length = 0;
      }
      window.history.replaceState(null, '', updatedUrl);
    } else {
      window.location = updatedUrl;
    }
  }

  /**
   * @param {Object.<string,boolean|string|string[]>} linkParams
   * @return string
   */
  makeUrl (linkParams) {
    const params = extend({}, this.urlParams);
    if (this.hidepassed !== null) {
      params.hidepassed = this.hidepassed;
    }
    extend(params, linkParams);

    let querystring = '?';
    for (let key in params) {
      // Skip inherited or undefined properties
      if (hasOwn.call(params, key) && params[key] !== undefined) {
        // Output a parameter for each value of this key
        // (but usually just one)
        let arrValue = [].concat(params[key]);
        for (let i = 0; i < arrValue.length; i++) {
          querystring += encodeURIComponent(key);
          if (arrValue[i] !== true) {
            querystring += '=' + encodeURIComponent(arrValue[i]);
          }
          querystring += '&';
        }
      }
    }

    return window.location.pathname + querystring.slice(0, -1);
  }

  applyUrlParams () {
    const filter = this.element.querySelector('#qunit-filter-input').value;

    window.location = this.makeUrl({
      filter: (filter === '') ? undefined : filter,
      moduleId: [...this.dropdownData.selectedMap.keys()],

      // Remove module and testId filter
      module: undefined,
      testId: undefined
    });
  }

  abortTestsButton () {
    const button = document.createElement('button');
    button.id = 'qunit-abort-tests-button';
    button.textContent = 'Abort';
    DOM.on(button, 'click', () => {
      button.disabled = true;
      button.textContent = 'Aborting...';
      this.abort();
      return false;
    });
    return button;
  }

  toolbarLooseFilter () {
    const filter = document.createElement('form');
    filter.className = 'qunit-filter';

    const label = document.createElement('label');
    label.textContent = 'Filter: ';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = this.config.filter || '';
    input.name = 'filter';
    input.id = 'qunit-filter-input';

    label.appendChild(input);

    const button = document.createElement('button');
    button.textContent = 'Go';

    filter.appendChild(label);
    filter.appendChild(document.createTextNode(' '));
    filter.appendChild(button);
    DOM.on(filter, 'submit', this.onFilterSubmit.bind(this));

    return filter;
  }

  toolbarModuleFilter (beginDetails) {
    let initialSelected = null;
    const dropdownData = this.dropdownData = {
      options: beginDetails.modules.slice(),
      selectedMap: new StringMap(),
      isDirty: function () {
        return [...dropdownData.selectedMap.keys()].sort().join(',')
          !== [...initialSelected.keys()].sort().join(',');
      }
    };

    if (this.config.moduleId && this.config.moduleId.length) {
      // The module dropdown is seeded with the runtime configuration of the last run.
      //
      // We don't reference `config.moduleId` directly after this and keep our own
      // copy because:
      // 1. This naturally filters out unknown moduleIds.
      // 2. Gives us a place to manage and remember unsubmitted checkbox changes.
      // 3. Gives us an efficient way to map a selected moduleId to module name
      //    during rendering.
      for (let i = 0; i < beginDetails.modules.length; i++) {
        const mod = beginDetails.modules[i];
        if (this.config.moduleId.indexOf(mod.moduleId) !== -1) {
          dropdownData.selectedMap.set(mod.moduleId, mod.name);
        }
      }
    }
    initialSelected = new StringMap(dropdownData.selectedMap);

    function createModuleListItem (moduleId, name, checked) {
      return '<li><label class="clickable' + (checked ? ' checked' : '')
        + '"><input type="checkbox" ' + 'value="' + escapeText(moduleId) + '"'
        + (checked ? ' checked="checked"' : '') + ' />'
        + escapeText(name) + '</label></li>';
    }

    /**
     * @param {Array} Results from fuzzysort
     * @return {string} HTML
     */
    function moduleListHtml (results) {
      let html = '';

      // Hoist the already selected items, and show them always
      // even if not matched by the current search.
      dropdownData.selectedMap.forEach((name, moduleId) => {
        html += createModuleListItem(moduleId, name, true);
      });

      for (let i = 0; i < results.length; i++) {
        const mod = results[i].obj;
        if (!dropdownData.selectedMap.has(mod.moduleId)) {
          html += createModuleListItem(mod.moduleId, mod.name, false);
        }
      }
      return html;
    }

    const label = document.createElement('label');
    label.htmlFor = 'qunit-modulefilter-search';
    label.textContent = 'Module:\u00A0 ';

    const searchContainer = document.createElement('span');
    searchContainer.id = 'qunit-modulefilter-search-container';
    label.appendChild(searchContainer);

    const moduleSearch = document.createElement('input');
    // Set type=text explicitly for ease of styling
    moduleSearch.setAttribute('type', 'text');
    moduleSearch.id = 'qunit-modulefilter-search';
    moduleSearch.autocomplete = 'off';
    DOM.on(moduleSearch, 'input', searchInput);
    DOM.on(moduleSearch, 'input', searchFocus);
    DOM.on(moduleSearch, 'focus', searchFocus);
    DOM.on(moduleSearch, 'click', searchFocus);
    searchContainer.appendChild(moduleSearch);

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply';
    applyButton.title = 'Re-run the selected test modules';
    DOM.on(applyButton, 'click', this.applyUrlParams.bind(this));

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.type = 'reset';
    resetButton.title = 'Restore the previous module selection';

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Select none';
    clearButton.type = 'button';
    clearButton.title = 'Clear the current module selection';
    DOM.on(clearButton, 'click', function () {
      dropdownData.selectedMap.clear();
      selectionChange();
      searchInput();
    });

    const actions = document.createElement('span');
    actions.id = 'qunit-modulefilter-actions';
    actions.appendChild(applyButton);
    actions.appendChild(resetButton);
    if (initialSelected.size) {
      // Only show clear button if functionally different from reset
      actions.appendChild(clearButton);
    }

    const dropDownList = document.createElement('ul');
    dropDownList.id = 'qunit-modulefilter-dropdown-list';

    const dropDown = document.createElement('div');
    dropDown.id = 'qunit-modulefilter-dropdown';
    dropDown.style.display = 'none';
    dropDown.appendChild(actions);
    dropDown.appendChild(dropDownList);
    DOM.on(dropDown, 'change', selectionChange);
    searchContainer.appendChild(dropDown);
    // Set initial moduleSearch.placeholder and clearButton/resetButton.
    selectionChange();

    const moduleFilter = document.createElement('form');
    moduleFilter.id = 'qunit-modulefilter';
    moduleFilter.appendChild(label);
    DOM.on(moduleFilter, 'submit', this.onFilterSubmit.bind(this));
    DOM.on(moduleFilter, 'reset', function () {
      dropdownData.selectedMap = new StringMap(initialSelected);
      // Set moduleSearch.placeholder and reflect non-dirty state
      selectionChange();
      searchInput();
    });

    // Enables show/hide for the dropdown
    function searchFocus () {
      if (dropDown.style.display !== 'none') {
        return;
      }

      // Optimization: Defer rendering options until focussed.
      // https://github.com/qunitjs/qunit/issues/1664
      // To test or benchmark, use /demos/q4000-qunit.html.
      searchInput();
      dropDown.style.display = 'block';

      // Hide on Escape keydown or on click outside the container
      DOM.on(document, 'click', hideHandler);
      DOM.on(document, 'keydown', hideHandler);

      function hideHandler (e) {
        const inContainer = moduleFilter.contains(e.target);

        if (e.keyCode === 27 || !inContainer) {
          if (e.keyCode === 27 && inContainer) {
            moduleSearch.focus();
          }
          dropDown.style.display = 'none';
          DOM.off(document, 'click', hideHandler);
          DOM.off(document, 'keydown', hideHandler);
          moduleSearch.value = '';
          searchInput();
        }
      }
    }

    /**
     * @param {string} searchText
     * @return {string} HTML
     */
    function filterModules (searchText) {
      let results;
      // Optimization: Limit number of results to ensure UI is responsive.
      // To benchmark typeahead responsiveness, use /demos/q4000-qunit.html.
      if (searchText === '') {
        // Improve on-boarding experience by having an immediate display of
        // module names, indicating how the interface works. This also makes
        // for a quicker interaction in the common case of small projects.
        // Don't mandate typing just to get the menu.
        results = dropdownData.options.slice(0, 100).map(obj => {
          // Fake empty results. https://github.com/farzher/fuzzysort/issues/41
          return { obj: obj };
        });
      } else {
        results = fuzzysort.go(searchText, dropdownData.options, {
          limit: 100,
          key: 'name',
          allowTypo: true
        });
      }

      return moduleListHtml(results);
    }

    // Processes module search box input
    let searchInputTimeout;
    function searchInput () {
      // Use a debounce with a ~0ms timeout. This is effectively instantaneous,
      // but is better than undebounced because it avoids an ever-growing
      // backlog of unprocessed now-outdated input events if fuzzysearch or
      // drodown DOM is slow (e.g. very large test suite).
      window.clearTimeout(searchInputTimeout);
      searchInputTimeout = window.setTimeout(() => {
        dropDownList.innerHTML = filterModules(moduleSearch.value);
      });
    }

    // Processes checkbox change, or a generic render (initial render, or after reset event)
    // Avoid any dropdown rendering here as this is used by toolbarModuleFilter()
    // during the initial render, which should not delay test execution.
    function selectionChange (evt) {
      const checkbox = (evt && evt.target) || null;

      if (checkbox) {
        // Update internal state
        if (checkbox.checked) {
          dropdownData.selectedMap.set(checkbox.value, checkbox.parentNode.textContent);
        } else {
          dropdownData.selectedMap.delete(checkbox.value);
        }

        // Update UI state
        DOM.toggleClass(checkbox.parentNode, 'checked', checkbox.checked);
      }

      const textForm = dropdownData.selectedMap.size
        ? (dropdownData.selectedMap.size + ' ' + (dropdownData.selectedMap.size === 1 ? 'module' : 'modules'))
        : 'All modules';
      moduleSearch.placeholder = textForm;
      moduleSearch.title = 'Type to search through and reduce the list.';
      resetButton.disabled = !dropdownData.isDirty();
      clearButton.style.display = dropdownData.selectedMap.size ? '' : 'none';
    }

    return moduleFilter;
  }

  getUrlConfigHtml () {
    const urlConfig = this.config.urlConfig;
    let urlConfigHtml = '';

    for (let i = 0; i < urlConfig.length; i++) {
      // Options can be either strings or objects with nonempty "id" properties
      let val = urlConfig[i];
      if (typeof val === 'string') {
        val = {
          id: val,
          label: val
        };
      }

      // https://github.com/qunitjs/qunit/issues/1792
      const currentVal = this.config[val.id] !== undefined
        ? this.config[val.id]
        : this.urlParams[val.id];

      let escaped = escapeText(val.id);
      let escapedTooltip = escapeText(val.tooltip);

      if (!val.value || typeof val.value === 'string') {
        urlConfigHtml += '<label for="qunit-urlconfig-' + escaped
          + '" title="' + escapedTooltip + '"><input id="qunit-urlconfig-' + escaped
          + '" name="' + escaped + '" type="checkbox"'
          + (val.value ? ' value="' + escapeText(val.value) + '"' : '')
          + (currentVal ? ' checked="checked"' : '')
          + ' title="' + escapedTooltip + '" />' + escapeText(val.label) + '</label>';
      } else {
        let selection = false;
        urlConfigHtml += '<label for="qunit-urlconfig-' + escaped
          + '" title="' + escapedTooltip + '">' + escapeText(val.label)
          + ': <select id="qunit-urlconfig-' + escaped
          + '" name="' + escaped + '" title="' + escapedTooltip + '"><option></option>';

        if (Array.isArray(val.value)) {
          for (let j = 0; j < val.value.length; j++) {
            escaped = escapeText(val.value[j]);
            urlConfigHtml += '<option value="' + escaped + '"'
              + (currentVal === val.value[j]
                ? (selection = true) && ' selected="selected"'
                : '')
              + '>' + escaped + '</option>';
          }
        } else {
          for (let j in val.value) {
            if (hasOwn.call(val.value, j)) {
              urlConfigHtml += '<option value="' + escapeText(j) + '"'
                + (currentVal === j
                  ? (selection = true) && ' selected="selected"'
                  : '')
                + '>' + escapeText(val.value[j]) + '</option>';
            }
          }
        }
        if (currentVal && !selection) {
          escaped = escapeText(currentVal);
          urlConfigHtml += '<option value="' + escaped
            + '" selected="selected" disabled="disabled">' + escaped + '</option>';
        }
        urlConfigHtml += '</select></label>';
      }
    }

    return urlConfigHtml;
  }

  appendToolbarControls (beginDetails) {
    const toolbarControls = this.element.querySelector('#qunit-testrunner-toolbar');
    if (toolbarControls) {
      const urlConfigContainer = document.createElement('span');
      urlConfigContainer.id = 'qunit-toolbar-urlconfig';
      urlConfigContainer.className = 'qunit-url-config';
      urlConfigContainer.innerHTML = this.getUrlConfigHtml();
      DOM.onEach(urlConfigContainer.getElementsByTagName('input'), 'change', this.onToolbarChanged.bind(this));
      DOM.onEach(urlConfigContainer.getElementsByTagName('select'), 'change', this.onToolbarChanged.bind(this));

      const toolbarFilters = document.createElement('span');
      toolbarFilters.id = 'qunit-toolbar-filters';
      toolbarFilters.appendChild(this.toolbarLooseFilter());
      toolbarFilters.appendChild(this.toolbarModuleFilter(beginDetails));

      toolbarControls.appendChild(urlConfigContainer);
      toolbarControls.appendChild(toolbarFilters);
    }
  }

  appendTestResultControls () {
    const controls = this.element.querySelector('#qunit-testresult-controls');
    if (controls) {
      controls.appendChild(this.abortTestsButton());
    }
  }

  appendFilteredTest () {
    const testId = this.config.testId;
    if (!testId || testId.length <= 0) {
      return '';
    }
    return '<div id="qunit-filteredTest">Rerunning selected tests: '
      + escapeText(testId.join(', '))
      + ' <a id="qunit-clearFilter" href="'
      + escapeText(this.unfilteredUrl)
      + '">Run all tests</a></div>';
  }

  appendInterface () {
    // Since QUnit 1.3, these are created automatically.
    this.element.setAttribute('role', 'main');
    this.element.innerHTML =
      '<div id="qunit-header">'
        + '<h1><a href="' + escapeText(this.unfilteredUrl) + '">' + escapeText(document.title) + '</a></h1> '
        + '<div id="qunit-userAgent" data-version="' + escapeText(version) + '" data-useragent="' + escapeText(navigator.userAgent) + '">' + escapeText('QUnit ' + version) + '</div>'
      + '</div>'
      + '<div id="qunit-toolbar" role="navigation">'
        + '<div id="qunit-banner"></div>'
        + '<div id="qunit-testrunner-toolbar"></div>'
        + '<div id="qunit-testresult" class="result">'
          + '<div id="qunit-testresult-controls"></div>'
          + '<div id="qunit-testresult-display">Running...<br />&#160;</div>'
        + '</div>'
        + this.appendFilteredTest()
      + '</div>'
      + '<ol id="qunit-tests"></ol>';

    this.elementBanner = this.element.querySelector('#qunit-banner');
    this.elementDisplay = this.element.querySelector('#qunit-testresult-display');
    this.elementTests = this.element.querySelector('#qunit-tests');
  }

  appendTest (name, testId, moduleName) {
    let title = document.createElement('strong');
    title.className = 'qunit-test-name';
    title.innerHTML = getNameHtml(name, moduleName);

    let testBlock = document.createElement('li');
    testBlock.className = 'qunit-test running';
    testBlock.appendChild(title);

    // No ID or rerun link for "global failure" blocks
    if (testId !== undefined) {
      let rerunTrigger = document.createElement('a');
      rerunTrigger.textContent = 'Rerun';
      rerunTrigger.href = this.makeUrl({ testId: testId });

      testBlock.id = 'qunit-test-output-' + testId;
      testBlock.appendChild(rerunTrigger);
    }

    let assertList = document.createElement('ol');
    assertList.className = 'qunit-assert-list';
    testBlock.appendChild(assertList);

    this.elementTests.appendChild(testBlock);

    return testBlock;
  }

  // HTML Reporter initialization and load
  onRunStart (runStart) {
    if (this.config.reporters && this.config.reporters.html === false) {
      // If QUnit.config.reporters.html was set to false after loading QUnit,
      // then undo the initial layout (created from browser-runnner.js)
      if (this.element) {
        this.element.innerHTML = '';
        this.element = null;
      }
      return;
    }
    if (!this.element) {
      this.element = document.querySelector('#qunit') || null;
      if (!this.element) {
        return;
      }
      this.appendInterface();
    }

    this.stats.defined = runStart.testCounts.total;

    // Element exists, now it is safe to attach other event listeners
    this.listen();
  }

  // Display the HTML Reporter interface
  //
  // This is done from begin() instead of runStart, because urlparams.js uses begin(),
  // which we need to wait for. urlparams.js in turn uses begin() to allow plugins to
  // add entries to QUnit.config.urlConfig, which may be done asynchronously.
  // https://github.com/qunitjs/qunit/issues/1657
  onBegin (beginDetails) {
    this.appendToolbarControls(beginDetails);
    this.appendTestResultControls();
    this.elementDisplay.className = 'running';
  }

  getRerunFailedHtml (failedTests) {
    if (failedTests.length === 0) {
      return '';
    }

    const href = this.makeUrl({ testId: failedTests });
    return [
      '<br /><a href="' + escapeText(href) + '">',
      failedTests.length === 1
        ? 'Rerun 1 failed test'
        : 'Rerun ' + failedTests.length + ' failed tests',
      '</a>'
    ].join('');
  }

  onRunEnd (runEnd) {
    function msToSec (milliseconds) {
      // Will return a whole number of seconds,
      // or e.g. "0.2", "0.03" or "0.004".
      const sec = (milliseconds > 1000)
        ? ('' + Math.round(milliseconds / 1000))
        : (milliseconds / 1000).toPrecision(1);
      return sec + (sec === '1' ? ' second' : ' seconds');
    }

    const abortButton = this.element.querySelector('#qunit-abort-tests-button');
    let html = [
      '<span class="total">', runEnd.testCounts.total, '</span> tests completed in ',
      msToSec(runEnd.runtime),
      '.<br/>',
      '<span class="passed">', runEnd.testCounts.passed, '</span> passed, ',
      '<span class="skipped">', runEnd.testCounts.skipped, '</span> skipped, ',
      '<span class="failed">', runEnd.testCounts.failed, '</span> failed, ',
      'and <span class="todo">', runEnd.testCounts.todo, '</span> todo.',
      this.getRerunFailedHtml(this.stats.failedTests)
    ].join('');

    // Update remaining tests to aborted
    if (abortButton && abortButton.disabled) {
      html = 'Tests aborted after ' + msToSec(runEnd.runtime) + '.';

      for (let i = 0; i < this.elementTests.children.length; i++) {
        const test = this.elementTests.children[i];
        if (DOM.hasClass(test.className, 'running')) {
          test.className = 'aborted';
          const assertList = test.getElementsByTagName('ol')[0];
          const assertLi = document.createElement('li');
          assertLi.className = 'fail';
          assertLi.textContent = 'Test aborted.';
          assertList.appendChild(assertLi);
        }
      }
    }

    if (!abortButton || abortButton.disabled === false) {
      this.elementBanner.className = runEnd.status === 'failed' ? 'qunit-fail' : 'qunit-pass';
    }

    if (abortButton) {
      abortButton.parentNode.removeChild(abortButton);
    }

    this.elementDisplay.innerHTML = html;
  }

  onTestStart (details) {
    this.appendTest(details.name, details.testId, details.module);

    this.elementDisplay.innerHTML = [
      details.previousFailure
        ? 'Rerunning previously failed test: <br />'
        : `Running test ${this.stats.completed} of ${this.stats.defined}: <br />`,
      getNameHtml(details.name, details.module),
      this.getRerunFailedHtml(this.stats.failedTests)
    ].join('');

    if (this.elementBanner.style.setProperty) {
      this.elementBanner.style.setProperty(
        '--qunit-progress',
        Math.ceil(((this.stats.completed + 1) / this.stats.defined) * 100) + '%'
      );
    }
  }

  onLog (details) {
    const testItem = this.element.querySelector('#qunit-test-output-' + details.testId);
    if (!testItem) {
      return;
    }

    let message = escapeText(details.message) || (details.result ? 'okay' : 'failed');
    message = '<span class="test-message">' + message + '</span>';
    message += '<span class="runtime">@ ' + details.runtime + ' ms</span>';

    let expected;
    let actual;

    // When pushFailure() is called, it is implied that no expected value
    // or diff should be shown, because both expected and actual as undefined.
    //
    // This must check details.expected existence. If it exists as undefined,
    // that's a regular assertion for which to render actual/expected and a diff.
    const showAnyValues = !details.result && (details.expected !== undefined || details.actual !== undefined);
    if (showAnyValues) {
      if (details.negative) {
        expected = 'NOT ' + dump.parse(details.expected);
      } else {
        expected = dump.parse(details.expected);
      }

      actual = dump.parse(details.actual);
      message += '<table><tr class="test-expected"><th>Expected: </th><td><pre>'
        + escapeText(expected)
        + '</pre></td></tr>';

      if (actual !== expected) {
        message += '<tr class="test-actual"><th>Result: </th><td><pre>'
          + escapeText(actual) + '</pre></td></tr>';

        let showDiff = false;
        let diffHtml;
        if (typeof details.actual === 'number' && typeof details.expected === 'number') {
          if (!isNaN(details.actual) && !isNaN(details.expected)) {
            showDiff = true;
            const numDiff = (details.actual - details.expected);
            diffHtml = (numDiff > 0 ? '+' : '') + numDiff;
          }
        } else if (
          typeof details.actual !== 'boolean'
          && typeof details.expected !== 'boolean'
        ) {
          diffHtml = diff(expected, actual);

          // don't show diff if there is zero overlap
          showDiff = stripHtml(diffHtml).length
            !== stripHtml(expected).length
            + stripHtml(actual).length;
        }

        if (showDiff) {
          message += '<tr class="test-diff"><th>Diff: </th><td><pre>'
            + diffHtml + '</pre></td></tr>';
        }
      } else if (
        expected.indexOf('[object Array]') !== -1
        || expected.indexOf('[object Object]') !== -1
      ) {
        // To test this interatively, use /demos/qunit-config-maxDepth.html
        message += '<tr class="test-message"><th>Message: </th><td>'
          + 'Diff suppressed because the object is more than ' + this.config.maxDepth
          + ' levels deep.<p>Hint: Use <code>QUnit.config.maxDepth</code> to '
          + 'set a higher limit, or <a href="'
          + escapeText(this.makeUrl({ maxDepth: 0 })) + '">Rerun without a depth limit</a>'
          + '.</p><br/></td></tr>';
      } else {
        message += '<tr class="test-message"><th>Message: </th><td>'
          + 'Diff suppressed as the expected and actual results have an equivalent'
          + ' serialization</td></tr>';
      }

      if (details.source) {
        message += '<tr class="test-source"><th>Source: </th><td><pre>'
          + escapeText(details.source) + '</pre></td></tr>';
      }

      message += '</table>';

      // This occurs when pushFailure is called and we have an extracted stack trace
    } else if (!details.result && details.source) {
      message += '<table>'
        + '<tr class="test-source"><th>Source: </th><td><pre>'
        + escapeText(details.source) + '</pre></td></tr>'
        + '</table>';
    }

    let assertList = testItem.getElementsByTagName('ol')[0];

    let assertLi = document.createElement('li');
    assertLi.className = details.result ? 'pass' : 'fail';
    assertLi.innerHTML = message;
    assertList.appendChild(assertLi);
  }

  onTestDone (details) {
    const testItem = this.elementTests.querySelector('#qunit-test-output-' + details.testId);
    if (!testItem) {
      return;
    }

    // This test passed if it has no unexpected failed assertions
    // TODO: Add "status" from TestReport#getStatus() to testDone() and use that.
    let status;
    if (details.skipped) {
      status = 'skipped';
    } else {
      const passed = (details.failed > 0 ? details.todo : !details.todo);
      status = !passed ? 'failed' : (details.todo ? 'todo' : 'passed');
    }
    const testPassed = status !== 'failed';

    this.stats.completed++;
    if (!testPassed) {
      this.stats.failedTests.push(details.testId);
    }

    // The testItem.firstChild is the test name
    let testTitle = testItem.firstChild;

    let assertList = testItem.getElementsByTagName('ol')[0];
    // Collapse passing tests by default
    if (testPassed) {
      DOM.addClass(assertList, 'qunit-collapsed');
    } else {
      if (this.config.collapse) {
        if (!this.collapseNext) {
          // Skip collapsing the first failing test
          this.collapseNext = true;
        } else {
          // Collapse subsequent failing tests
          DOM.addClass(assertList, 'qunit-collapsed');
        }
      }
    }

    let good = details.passed;
    let bad = details.failed;
    let badGoodCounts = bad
      ? '<span class="failed">' + bad + '</span>, ' + '<span class="passed">' + good + '</span>, '
      : '';

    testTitle.innerHTML += ' <span class="counts">(' + badGoodCounts + details.total + ')</span>';

    DOM.removeClass(testItem, 'running');

    if (status === 'skipped') {
      DOM.addClass(testItem, 'skipped');

      const skippedLabel = document.createElement('em');
      skippedLabel.className = 'qunit-skipped-label';
      skippedLabel.textContent = 'skipped';
      testItem.insertBefore(skippedLabel, testTitle);
      testItem.insertBefore(document.createTextNode(' '), testTitle);
    } else {
      DOM.addClass(testItem, testPassed ? 'pass' : 'fail');

      DOM.on(testTitle, 'click', function () {
        DOM.toggleClass(assertList, 'qunit-collapsed');
      });

      if (details.todo) {
        // Add label both for status=todo (passing) and for status=failed on a todo test.
        DOM.addClass(testItem, 'todo');

        const todoLabel = document.createElement('em');
        todoLabel.className = 'qunit-todo-label';
        todoLabel.textContent = 'todo';
        testItem.insertBefore(todoLabel, testTitle);
        testItem.insertBefore(document.createTextNode(' '), testTitle);
      }

      let time = document.createElement('span');
      time.className = 'runtime';
      time.textContent = details.runtime + ' ms';
      testItem.insertBefore(time, assertList);
    }

    // Show the source of the test when showing assertions
    if (details.source) {
      let sourceName = document.createElement('p');
      sourceName.innerHTML = '<strong>Source: </strong>' + escapeText(details.source);
      DOM.addClass(sourceName, 'qunit-source');
      if (testPassed) {
        DOM.addClass(sourceName, 'qunit-collapsed');
      }
      DOM.on(testTitle, 'click', function () {
        DOM.toggleClass(sourceName, 'qunit-collapsed');
      });
      testItem.appendChild(sourceName);
    }

    const hidepassed = (this.hidepassed !== null ? this.hidepassed : this.config.hidepassed);
    if (hidepassed && (status === 'passed' || details.skipped)) {
      this.hiddenTests.push(testItem);
      // use removeChild() instead of remove() for wider browser support
      this.elementTests.removeChild(testItem);
    }
  }

  onError (error) {
    const testItem = this.appendTest('global failure');

    // Render similar to a failed assertion (see above QUnit.log callback)
    let message = escapeText(errorString(error));
    message = '<span class="test-message">' + message + '</span>';
    if (error && error.stack) {
      message += '<table>'
        + '<tr class="test-source"><th>Source: </th><td><pre>'
        + escapeText(error.stack) + '</pre></td></tr>'
        + '</table>';
    }
    const assertList = testItem.getElementsByTagName('ol')[0];
    const assertLi = document.createElement('li');
    assertLi.className = 'fail';
    assertLi.innerHTML = message;
    assertList.appendChild(assertLi);

    // Make it visible
    DOM.removeClass(testItem, 'running');
    DOM.addClass(testItem, 'fail');
  }
}

function getNameHtml (name, module) {
  let nameHtml = '';

  if (module) {
    nameHtml = '<span class="module-name">' + escapeText(module) + '</span>: ';
  }

  nameHtml += '<span class="test-name">' + escapeText(name) + '</span>';

  return nameHtml;
}
