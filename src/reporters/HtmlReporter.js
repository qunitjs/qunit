import { extend, errorString, escapeText } from '../core/utilities';
import diff from '../core/diff';
import dump from '../dump';
import { window, document, navigator, StringMap } from '../globals';
import { urlParams } from '../urlparams';
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
  // TODO: Verity that eslint-plugin-compat catches those exceptions.
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
    elem.className = set.trim();
  },
  id (name) {
    return document.getElementById && document.getElementById(name);
  }
};

function getUrlConfigHtml (config) {
  const urlConfig = config.urlConfig;
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
    const currentVal = config[val.id];

    let escaped = escapeText(val.id);
    let escapedTooltip = escapeText(val.tooltip);

    if (!val.value || typeof val.value === 'string') {
      urlConfigHtml += "<label for='qunit-urlconfig-" + escaped +
        "' title='" + escapedTooltip + "'><input id='qunit-urlconfig-" + escaped +
        "' name='" + escaped + "' type='checkbox'" +
        (val.value ? " value='" + escapeText(val.value) + "'" : '') +
        (currentVal ? " checked='checked'" : '') +
        " title='" + escapedTooltip + "' />" + escapeText(val.label) + '</label>';
    } else {
      let selection = false;
      urlConfigHtml += "<label for='qunit-urlconfig-" + escaped +
        "' title='" + escapedTooltip + "'>" + val.label +
        ": </label><select id='qunit-urlconfig-" + escaped +
        "' name='" + escaped + "' title='" + escapedTooltip + "'><option></option>";

      if (Array.isArray(val.value)) {
        for (let j = 0; j < val.value.length; j++) {
          escaped = escapeText(val.value[j]);
          urlConfigHtml += "<option value='" + escaped + "'" +
            (currentVal === val.value[j]
              ? (selection = true) && " selected='selected'"
              : '') +
            '>' + escaped + '</option>';
        }
      } else {
        for (let j in val.value) {
          if (hasOwn.call(val.value, j)) {
            urlConfigHtml += "<option value='" + escapeText(j) + "'" +
              (currentVal === j
                ? (selection = true) && " selected='selected'"
                : '') +
              '>' + escapeText(val.value[j]) + '</option>';
          }
        }
      }
      if (currentVal && !selection) {
        escaped = escapeText(currentVal);
        urlConfigHtml += "<option value='" + escaped +
          "' selected='selected' disabled='disabled'>" + escaped + '</option>';
      }
      urlConfigHtml += '</select>';
    }
  }

  return urlConfigHtml;
}

function getProgressHtml (stats) {
  return [
    stats.completed,
    ' / ',
    stats.defined,
    ' tests completed.<br />'
  ].join('');
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
   * @param {Object} [options]
   * @param {Object} [options.config] For internal usage
   */
  static init (QUnit, options) {
    // Don't init the HTML Reporter in non-browser environments
    if (!window || !document) {
      return;
    }

    // TODO: Move to caller (browser runner)
    // Wrap window.onerror. We will call the original window.onerror to see if
    // the existing handler fully handles the error; if not, we will call the
    // QUnit.onError function.
    const originalWindowOnError = window.onerror;
    // Cover uncaught exceptions
    // Returning true will suppress the default browser handler,
    // returning false will let it run.
    window.onerror = function (message, fileName, lineNumber, columnNumber, errorObj, ...args) {
      let ret = false;
      if (originalWindowOnError) {
        ret = originalWindowOnError.call(
          this,
          message,
          fileName,
          lineNumber,
          columnNumber,
          errorObj,
          ...args
        );
      }

      // Treat return value as window.onerror itself does,
      // Only do our handling if not suppressed.
      if (ret !== true) {
        // If there is a current test that sets the internal `ignoreGlobalErrors` field
        // (such as during `assert.throws()`), then the error is ignored and native
        // error reporting is suppressed as well. This is because in browsers, an error
        // can sometimes end up in `window.onerror` instead of in the local try/catch.
        // This ignoring of errors does not apply to our general onUncaughtException
        // method, nor to our `unhandledRejection` handlers, as those are not meant
        // to receive an "expected" error during `assert.throws()`.
        if (QUnit.config.current && QUnit.config.current.ignoreGlobalErrors) {
          return true;
        }

        // According to
        // https://blog.sentry.io/2016/01/04/client-javascript-reporting-window-onerror,
        // most modern browsers support an errorObj argument; use that to
        // get a full stack trace if it's available.
        const error = errorObj || new Error(message);
        if (!error.stack && fileName && lineNumber) {
          error.stack = `${fileName}:${lineNumber}`;
        }
        QUnit.onUncaughtException(error);
      }

      return ret;
    };

    // TODO: Move to caller (browser runner)
    window.addEventListener('unhandledrejection', function (event) {
      QUnit.onUncaughtException(event.reason);
    });

    // TODO: Move to caller (browser runner)
    QUnit.reporters.perf.init(QUnit);

    QUnit.on('runEnd', function (runEnd) {
      if (QUnit.config.altertitle && document.title) {
        // Show ✖ for good, ✔ for bad suite result in title
        // use escape sequences in case file gets loaded with non-utf-8
        // charset
        document.title = [
          (runEnd.status === 'failed' ? '\u2716' : '\u2714'),
          document.title.replace(/^[\u2714\u2716] /i, '')
        ].join(' ');
      }

      // Scroll back to top to show results
      if (QUnit.config.scrolltop && window.scrollTo) {
        window.scrollTo(0, 0);
      }
    });

    function autostart () {
      // Check as late as possible because if projecst set autostart=false,
      // they generally do so in their own scripts, after qunit.js.
      if (QUnit.config.autostart) {
        QUnit.start();
      }
    }

    const reporter = new HtmlReporter(QUnit, options);

    // TODO: Move to caller (browser runner)
    if (document.readyState === 'complete') {
      autostart();
    } else {
      DOM.on(window, 'load', autostart);
    }

    return reporter;
  }

  constructor (QUnit, options = {}) {
    this.stats = {
      failedTests: [],
      defined: 0,
      completed: 0
    };
    // This must use a live reference (i.e. not store a copy), because
    // users may apply their settings to QUnit.config anywhere between
    // loading qunit.js and the last QUnit.begin() listener finishing.
    this.config = options.config || QUnit.config;
    this.hiddenTests = [];
    this.collapseNext = false;
    this.unfilteredUrl = this.makeUrl({
      filter: undefined,
      module: undefined,
      moduleId: undefined,
      testId: undefined
    });
    this.dropdownData = null;

    QUnit.on('error', this.onError.bind(this));
    QUnit.on('runStart', this.onRunStart.bind(this));
    QUnit.begin(this.onBegin.bind(this));
    QUnit.testStart(this.onTestStart.bind(this));
    QUnit.log(this.onLog.bind(this));
    QUnit.testDone(this.onTestDone.bind(this));
    QUnit.on('runEnd', this.onRunEnd.bind(this));
  }

  // Handle "submit" event from "filter" or "moduleFilter" field.
  onFilterSubmit (ev) {
    // Trim potential accidental whitespace so that QUnit doesn't throw an error about no tests matching the filter.
    const filterInputElem = DOM.id('qunit-filter-input');
    filterInputElem.value = filterInputElem.value.trim();

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
    const params = {};

    // Detect if field is a select menu or a checkbox
    let value;
    if ('selectedIndex' in field) {
      value = field.options[field.selectedIndex].value || undefined;
    } else {
      value = field.checked ? (field.defaultValue || true) : undefined;
    }

    params[field.name] = value;
    let updatedUrl = this.makeUrl(params);

    // Check if we can apply the change without a page refresh
    if (field.name === 'hidepassed' && 'replaceState' in window.history) {
      urlParams[field.name] = value;
      // TODO: Do we really have to write this change to QUnit.config?
      this.config[field.name] = value || false;
      let tests = DOM.id('qunit-tests');
      if (tests) {
        const length = tests.children.length;
        const children = tests.children;

        if (field.checked) {
          for (let i = 0; i < length; i++) {
            const test = children[i];
            const className = test ? test.className : '';
            const classNameHasPass = className.indexOf('pass') > -1;
            const classNameHasSkipped = className.indexOf('skipped') > -1;

            if (classNameHasPass || classNameHasSkipped) {
              this.hiddenTests.push(test);
            }
          }

          for (const hiddenTest of this.hiddenTests) {
            tests.removeChild(hiddenTest);
          }
        } else {
          while (this.hiddenTests.length) {
            tests.appendChild(this.hiddenTests.shift());
          }
        }
      }
      window.history.replaceState(null, '', updatedUrl);
    } else {
      window.location = updatedUrl;
    }
  }

  makeUrl (params) {
    let querystring = '?';
    const location = window.location;

    params = extend(extend({}, urlParams), params);

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
    // TODO: Consider changing HTML to use a relative URL here,
    // no need for window.location dependency.
    return location.protocol + '//' + location.host +
      location.pathname + querystring.slice(0, -1);
  }

  applyUrlParams () {
    const filter = DOM.id('qunit-filter-input').value;

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
    button.innerHTML = 'Abort';
    DOM.on(button, 'click', () => {
      const abortButton = DOM.id('qunit-abort-tests-button');
      if (abortButton) {
        abortButton.disabled = true;
        abortButton.innerHTML = 'Aborting...';
      }
      this.config.queue.length = 0;
      return false;
    });
    return button;
  }

  toolbarLooseFilter () {
    const filter = document.createElement('form');
    filter.className = 'qunit-filter';

    const label = document.createElement('label');
    label.innerHTML = 'Filter: ';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = this.config.filter || '';
    input.name = 'filter';
    input.id = 'qunit-filter-input';

    label.appendChild(input);

    const button = document.createElement('button');
    button.innerHTML = 'Go';

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
        return [...dropdownData.selectedMap.keys()].sort().join(',') !==
          [...initialSelected.keys()].sort().join(',');
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
      return '<li><label class="clickable' + (checked ? ' checked' : '') +
        '"><input type="checkbox" ' + 'value="' + escapeText(moduleId) + '"' +
        (checked ? ' checked="checked"' : '') + ' />' +
        escapeText(name) + '</label></li>';
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

    const moduleSearch = document.createElement('input');
    moduleSearch.id = 'qunit-modulefilter-search';
    moduleSearch.autocomplete = 'off';
    DOM.on(moduleSearch, 'input', searchInput);
    DOM.on(moduleSearch, 'input', searchFocus);
    DOM.on(moduleSearch, 'focus', searchFocus);
    DOM.on(moduleSearch, 'click', searchFocus);

    const label = document.createElement('label');
    label.htmlFor = 'qunit-modulefilter-search';
    label.textContent = 'Module:';
    const searchContainer = document.createElement('span');
    searchContainer.id = 'qunit-modulefilter-search-container';
    searchContainer.appendChild(moduleSearch);

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply';
    applyButton.title = 'Re-run the selected test modules';
    DOM.on(applyButton, 'click', this.applyUrlParams);

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
    moduleFilter.appendChild(document.createTextNode(' '));
    moduleFilter.appendChild(searchContainer);
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
      if (searchText === '') {
        // Improve on-boarding experience by having an immediate display of
        // module names, indicating how the interface works. This also makes
        // for a quicker interaction in the common case of small projects.
        // Don't mandate typing just to get the menu.
        results = dropdownData.options.slice(0, 20).map(obj => {
          // Fake empty results. https://github.com/farzher/fuzzysort/issues/41
          return { obj: obj };
        });
      } else {
        results = fuzzysort.go(searchText, dropdownData.options, {
          limit: 20,
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

  appendToolbar (beginDetails) {
    const toolbar = DOM.id('qunit-testrunner-toolbar');
    if (toolbar) {
      const urlConfigContainer = document.createElement('span');
      urlConfigContainer.innerHTML = getUrlConfigHtml(this.config);
      DOM.addClass(urlConfigContainer, 'qunit-url-config');
      DOM.onEach(urlConfigContainer.getElementsByTagName('input'), 'change', this.onToolbarChanged.bind(this));
      DOM.onEach(urlConfigContainer.getElementsByTagName('select'), 'change', this.onToolbarChanged.bind(this));
      toolbar.appendChild(urlConfigContainer);

      const toolbarFilters = document.createElement('span');
      toolbarFilters.id = 'qunit-toolbar-filters';
      toolbarFilters.appendChild(this.toolbarLooseFilter());
      toolbarFilters.appendChild(this.toolbarModuleFilter(beginDetails));

      const clearfix = document.createElement('div');
      clearfix.className = 'clearfix';

      toolbar.appendChild(toolbarFilters);
      toolbar.appendChild(clearfix);
    }
  }

  appendHeader () {
    const header = DOM.id('qunit-header');

    if (header) {
      header.innerHTML = "<a href='" + escapeText(this.unfilteredUrl) + "'>" + header.innerHTML +
      '</a> ';
    }
  }

  appendBanner () {
    const banner = DOM.id('qunit-banner');

    if (banner) {
      banner.className = '';
    }
  }

  appendTestResults () {
    const tests = DOM.id('qunit-tests');
    let result = DOM.id('qunit-testresult');
    let controls;

    if (result) {
      result.parentNode.removeChild(result);
    }

    if (tests) {
      tests.innerHTML = '';
      result = document.createElement('p');
      result.id = 'qunit-testresult';
      result.className = 'result';
      tests.parentNode.insertBefore(result, tests);
      result.innerHTML = '<div id="qunit-testresult-display">Running...<br />&#160;</div>' +
      '<div id="qunit-testresult-controls"></div>' +
      '<div class="clearfix"></div>';
      controls = DOM.id('qunit-testresult-controls');
    }

    if (controls) {
      controls.appendChild(this.abortTestsButton());
    }
  }

  appendFilteredTest () {
    const testId = this.config.testId;
    if (!testId || testId.length <= 0) {
      return '';
    }
    return "<div id='qunit-filteredTest'>Rerunning selected tests: " +
      escapeText(testId.join(', ')) +
      " <a id='qunit-clearFilter' href='" +
      escapeText(this.unfilteredUrl) +
      "'>Run all tests</a></div>";
  }

  appendUserAgent () {
    const userAgent = DOM.id('qunit-userAgent');

    if (userAgent) {
      userAgent.innerHTML = '';
      userAgent.appendChild(
        document.createTextNode(
          // eslint-disable-next-line no-undef
          'QUnit ' + QUnit.version + '; ' + navigator.userAgent
        )
      );
    }
  }

  appendInterface (beginDetails) {
    const qunit = DOM.id('qunit');

    // For compat with QUnit 1.2, and to support fully custom theme HTML,
    // we will use any existing elements if no id="qunit" element exists.
    //
    // Note that we don't fail or fallback to creating it ourselves,
    // because not having id="qunit" (and not having the below elements)
    // simply means QUnit acts headless, allowing users to use their own
    // reporters, or for a test runner to listen for events directly without
    // having the HTML reporter actively render anything.
    if (qunit) {
      qunit.setAttribute('role', 'main');

      // Since QUnit 1.3, these are created automatically if the page
      // contains id="qunit".
      qunit.innerHTML =
      "<h1 id='qunit-header'>" + escapeText(document.title) + '</h1>' +
      "<h2 id='qunit-banner'></h2>" +
      "<div id='qunit-testrunner-toolbar' role='navigation'></div>" +
      this.appendFilteredTest() +
      "<h2 id='qunit-userAgent'></h2>" +
      "<ol id='qunit-tests'></ol>";
    }

    this.appendHeader();
    this.appendBanner();
    this.appendTestResults();
    this.appendUserAgent();
    this.appendToolbar(beginDetails);
  }

  appendTest (name, testId, moduleName) {
    const tests = DOM.id('qunit-tests');
    if (!tests) {
      return;
    }

    let title = document.createElement('strong');
    title.innerHTML = getNameHtml(name, moduleName);

    let testBlock = document.createElement('li');
    testBlock.appendChild(title);

    // No ID or rerun link for "global failure" blocks
    if (testId !== undefined) {
      let rerunTrigger = document.createElement('a');
      rerunTrigger.innerHTML = 'Rerun';
      rerunTrigger.href = this.makeUrl({ testId: testId });

      testBlock.id = 'qunit-test-output-' + testId;
      testBlock.appendChild(rerunTrigger);
    }

    let assertList = document.createElement('ol');
    assertList.className = 'qunit-assert-list';

    testBlock.appendChild(assertList);

    tests.appendChild(testBlock);

    return testBlock;
  }

  onRunStart (runStart) {
    // HTML Reporter initialization and load
    this.stats.defined = runStart.testCounts.total;
  }

  onBegin (beginDetails) {
    // Initialize QUnit elements
    // This is done from begin() instead of runStart, because
    // urlparams.js uses begin(), which we need to wait for.
    // urlparams.js in turn uses begin() to allow plugins to
    // add entries to QUnit.config.urlConfig, which may be done
    // asynchronously.
    // <https://github.com/qunitjs/qunit/issues/1657>
    this.appendInterface(beginDetails);
  }

  getRerunFailedHtml (failedTests) {
    if (failedTests.length === 0) {
      return '';
    }

    const href = this.makeUrl({ testId: failedTests });
    return [
      "<br /><a href='" + escapeText(href) + "'>",
      failedTests.length === 1
        ? 'Rerun 1 failed test'
        : 'Rerun ' + failedTests.length + ' failed tests',
      '</a>'
    ].join('');
  }

  onRunEnd (runEnd) {
    function msToSec (milliseconds) {
      if (milliseconds < 1000) {
        // Will return e.g. "0.2", "0.03" or "0.004"
        return (milliseconds / 1000).toPrecision(1) + ' seconds';
      }
      const sec = Math.ceil(milliseconds / 1000);
      return sec + (sec === 1 ? ' second' : ' seconds');
    }

    const banner = DOM.id('qunit-banner');
    const tests = DOM.id('qunit-tests');
    const abortButton = DOM.id('qunit-abort-tests-button');
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
    let test;
    let assertLi;
    let assertList;

    // Update remaining tests to aborted
    if (abortButton && abortButton.disabled) {
      html = 'Tests aborted after ' + msToSec(runEnd.runtime) + '.';

      for (let i = 0; i < tests.children.length; i++) {
        test = tests.children[i];
        if (test.className === '' || test.className === 'running') {
          test.className = 'aborted';
          assertList = test.getElementsByTagName('ol')[0];
          assertLi = document.createElement('li');
          assertLi.className = 'fail';
          assertLi.innerHTML = 'Test aborted.';
          assertList.appendChild(assertLi);
        }
      }
    }

    if (banner && (!abortButton || abortButton.disabled === false)) {
      banner.className = runEnd.status === 'failed' ? 'qunit-fail' : 'qunit-pass';
    }

    if (abortButton) {
      abortButton.parentNode.removeChild(abortButton);
    }

    if (tests) {
      DOM.id('qunit-testresult-display').innerHTML = html;
    }
  }

  onTestStart (details) {
    this.appendTest(details.name, details.testId, details.module);

    let running = DOM.id('qunit-testresult-display');

    if (running) {
      DOM.addClass(running, 'running');

      running.innerHTML = [
        getProgressHtml(this.stats),
        details.previousFailure
          ? 'Rerunning previously failed test: <br />'
          : 'Running: ',
        getNameHtml(details.name, details.module),
        this.getRerunFailedHtml(this.stats.failedTests)
      ].join('');
    }
  }

  onLog (details) {
    const testItem = DOM.id('qunit-test-output-' + details.testId);
    if (!testItem) {
      return;
    }

    let message = escapeText(details.message) || (details.result ? 'okay' : 'failed');
    message = "<span class='test-message'>" + message + '</span>';
    message += "<span class='runtime'>@ " + details.runtime + ' ms</span>';

    let expected;
    let actual;

    // When pushFailure() is called, it is implied that no expected value
    // or diff should be shown. It does not set details.expected.
    //
    // This must check details.expected existence. If it exists as undefined,
    // that's a regular assertion for which to render actual/expected and a diff.
    if (!details.result && hasOwn.call(details, 'expected')) {
      if (details.negative) {
        expected = 'NOT ' + dump.parse(details.expected);
      } else {
        expected = dump.parse(details.expected);
      }

      actual = dump.parse(details.actual);
      message += "<table><tr class='test-expected'><th>Expected: </th><td><pre>" +
      escapeText(expected) +
      '</pre></td></tr>';

      if (actual !== expected) {
        message += "<tr class='test-actual'><th>Result: </th><td><pre>" +
          escapeText(actual) + '</pre></td></tr>';

        let showDiff = false;
        let diffHtml;
        if (typeof details.actual === 'number' && typeof details.expected === 'number') {
          if (!isNaN(details.actual) && !isNaN(details.expected)) {
            showDiff = true;
            const numDiff = (details.actual - details.expected);
            diffHtml = (numDiff > 0 ? '+' : '') + numDiff;
          }
        } else if (typeof details.actual !== 'boolean' &&
              typeof details.expected !== 'boolean'
        ) {
          diffHtml = diff(expected, actual);

          // don't show diff if there is zero overlap
          showDiff = stripHtml(diffHtml).length !==
            stripHtml(expected).length +
            stripHtml(actual).length;
        }

        if (showDiff) {
          message += "<tr class='test-diff'><th>Diff: </th><td><pre>" +
            diffHtml + '</pre></td></tr>';
        }
      } else if (expected.indexOf('[object Array]') !== -1 ||
        expected.indexOf('[object Object]') !== -1) {
        message += "<tr class='test-message'><th>Message: </th><td>" +
        'Diff suppressed as the depth of object is more than current max depth (' +
        this.config.maxDepth + ').<p>Hint: Use <code>QUnit.dump.maxDepth</code> to ' +
        " run with a higher max depth or <a href='" +
        escapeText(this.makeUrl({ maxDepth: -1 })) + "'>" +
        'Rerun</a> without max depth.</p></td></tr>';
      } else {
        message += "<tr class='test-message'><th>Message: </th><td>" +
        'Diff suppressed as the expected and actual results have an equivalent' +
        ' serialization</td></tr>';
      }

      if (details.source) {
        message += "<tr class='test-source'><th>Source: </th><td><pre>" +
        escapeText(details.source) + '</pre></td></tr>';
      }

      message += '</table>';

      // This occurs when pushFailure is called and we have an extracted stack trace
    } else if (!details.result && details.source) {
      message += '<table>' +
      "<tr class='test-source'><th>Source: </th><td><pre>" +
      escapeText(details.source) + '</pre></td></tr>' +
      '</table>';
    }

    let assertList = testItem.getElementsByTagName('ol')[0];

    let assertLi = document.createElement('li');
    assertLi.className = details.result ? 'pass' : 'fail';
    assertLi.innerHTML = message;
    assertList.appendChild(assertLi);
  }

  onTestDone (details) {
    const tests = DOM.id('qunit-tests');
    const testItem = DOM.id('qunit-test-output-' + details.testId);
    if (!tests || !testItem) {
      return;
    }

    DOM.removeClass(testItem, 'running');

    let status;
    if (details.failed > 0) {
      status = 'failed';
    } else if (details.todo) {
      status = 'todo';
    } else {
      status = details.skipped ? 'skipped' : 'passed';
    }

    let assertList = testItem.getElementsByTagName('ol')[0];

    let good = details.passed;
    let bad = details.failed;

    // This test passed if it has no unexpected failed assertions
    const testPassed = details.failed > 0 ? details.todo : !details.todo;

    if (testPassed) {
      // Collapse the passing tests
      DOM.addClass(assertList, 'qunit-collapsed');
    } else {
      this.stats.failedTests.push(details.testId);

      if (this.config.collapse) {
        if (!this.collapseNext) {
          // Skip collapsing the first failing test
          this.collapseNext = true;
        } else {
          // Collapse remaining tests
          DOM.addClass(assertList, 'qunit-collapsed');
        }
      }
    }

    // The testItem.firstChild is the test name
    let testTitle = testItem.firstChild;

    let testCounts = bad
      ? "<b class='failed'>" + bad + '</b>, ' + "<b class='passed'>" + good + '</b>, '
      : '';

    testTitle.innerHTML += " <b class='counts'>(" + testCounts +
    details.assertions.length + ')</b>';

    this.stats.completed++;

    if (details.skipped) {
      testItem.className = 'skipped';
      let skipped = document.createElement('em');
      skipped.className = 'qunit-skipped-label';
      skipped.innerHTML = 'skipped';
      testItem.insertBefore(skipped, testTitle);
    } else {
      DOM.on(testTitle, 'click', function () {
        DOM.toggleClass(assertList, 'qunit-collapsed');
      });

      testItem.className = testPassed ? 'pass' : 'fail';

      if (details.todo) {
        const todoLabel = document.createElement('em');
        todoLabel.className = 'qunit-todo-label';
        todoLabel.innerHTML = 'todo';
        testItem.className += ' todo';
        testItem.insertBefore(todoLabel, testTitle);
      }

      let time = document.createElement('span');
      time.className = 'runtime';
      time.innerHTML = details.runtime + ' ms';
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

    if (this.config.hidepassed && (status === 'passed' || details.skipped)) {
      // use removeChild instead of remove because of support
      this.hiddenTests.push(testItem);

      tests.removeChild(testItem);
    }
  }

  onError (error) {
    const testItem = this.appendTest('global failure');
    if (!testItem) {
      // HTML Reporter is probably disabled or not yet initialized.
      return;
    }

    // Render similar to a failed assertion (see above QUnit.log callback)
    let message = escapeText(errorString(error));
    message = "<span class='test-message'>" + message + '</span>';
    if (error && error.stack) {
      message += '<table>' +
        "<tr class='test-source'><th>Source: </th><td><pre>" +
        escapeText(error.stack) + '</pre></td></tr>' +
        '</table>';
    }
    const assertList = testItem.getElementsByTagName('ol')[0];
    const assertLi = document.createElement('li');
    assertLi.className = 'fail';
    assertLi.innerHTML = message;
    assertList.appendChild(assertLi);

    // Make it visible
    testItem.className = 'fail';
  }
}

function getNameHtml (name, module) {
  let nameHtml = '';

  if (module) {
    nameHtml = "<span class='module-name'>" + escapeText(module) + '</span>: ';
  }

  nameHtml += "<span class='test-name'>" + escapeText(name) + '</span>';

  return nameHtml;
}
