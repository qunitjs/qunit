import QUnit from '../core';
import { window } from '../globals';

(function () {
  // Only interact with URLs via window.location
  const location = typeof window !== 'undefined' && window.location;
  if (!location) {
    return;
  }

  const urlParams = getUrlParams();

  // TODO: Move to /src/core/ in QUnit 3
  // TODO: Document this as public API (read-only)
  QUnit.urlParams = urlParams;

  // TODO: Move to /src/core/config.js in QUnit 3,
  // in accordance with /docs/api/config.index.md#order
  QUnit.config.filter = urlParams.filter;
  // NOTE: Based on readFlatPreconfigNumber from QUnit 3.
  if (/^[0-9]+$/.test(urlParams.maxDepth)) {
    QUnit.config.maxDepth = QUnit.dump.maxDepth = +urlParams.maxDepth;
  }
  QUnit.config.module = urlParams.module;
  QUnit.config.moduleId = [].concat(urlParams.moduleId || []);
  QUnit.config.testId = [].concat(urlParams.testId || []);

  // Test order randomization
  // Generate a random seed if `?seed` is specified without a value (boolean true),
  // or when set to the string "true".
  if (urlParams.seed === 'true' || urlParams.seed === true) {
    // NOTE: This duplicates logic from /src/core/config.js. Consolidated in QUnit 3.
    QUnit.config.seed = (Math.random().toString(36) + '0000000000').slice(2, 12);
  } else if (urlParams.seed) {
    QUnit.config.seed = urlParams.seed;
  }

  // Add URL-parameter-mapped config values with UI form rendering data
  QUnit.config.urlConfig.push(
    {
      id: 'hidepassed',
      label: 'Hide passed tests',
      tooltip: 'Only show tests and assertions that fail. Stored as query-strings.'
    },
    {
      id: 'noglobals',
      label: 'Check for Globals',
      tooltip: 'Enabling this will test if any test introduces new properties on the ' +
        'global object (`window` in Browsers). Stored as query-strings.'
    },
    {
      id: 'notrycatch',
      label: 'No try-catch',
      tooltip: 'Enabling this will run tests outside of a try-catch block. Makes debugging ' +
        'exceptions in IE reasonable. Stored as query-strings.'
    }
  );

  QUnit.begin(function () {
    const urlConfig = QUnit.config.urlConfig;

    for (let i = 0; i < urlConfig.length; i++) {
      // Options can be either strings or objects with nonempty "id" properties
      let option = QUnit.config.urlConfig[i];
      if (typeof option !== 'string') {
        option = option.id;
      }

      if (QUnit.config[option] === undefined) {
        QUnit.config[option] = urlParams[option];
      }
    }
  });

  function getUrlParams () {
    const urlParams = Object.create(null);
    const params = location.search.slice(1).split('&');
    const length = params.length;

    for (let i = 0; i < length; i++) {
      if (params[i]) {
        const param = params[i].split('=');
        const name = decodeQueryParam(param[0]);

        // Allow just a key to turn on a flag, e.g., test.html?noglobals
        const value = param.length === 1 ||
          decodeQueryParam(param.slice(1).join('='));
        if (name in urlParams) {
          urlParams[name] = [].concat(urlParams[name], value);
        } else {
          urlParams[name] = value;
        }
      }
    }

    return urlParams;
  }

  function decodeQueryParam (param) {
    return decodeURIComponent(param.replace(/\+/g, '%20'));
  }
}());
