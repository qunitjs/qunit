import { runLoggingCallbacks } from './callbacks.js';
import config from './config.js';
import { emit } from './events.js';
import { window, document, setTimeout } from './globals.js';
import { globalSuiteReport } from './module.js';
import Test from './test.js';
import reporters from './reporters.js';
import { performance } from './utilities.js';

function unblockAndAdvanceQueue () {
  config.blocking = false;
  config._pq.advance();
}

function doStart () {
  if (config.started) {
    unblockAndAdvanceQueue();
    return;
  }

  // QUnit.config.reporters is considered writable between qunit.js and QUnit.start().
  // Now that QUnit.start() has been called, it is time to decide which built-in reporters
  // to load.
  // For config.reporters.html, refer to browser-runner.js and HtmlReporter#onRunStart.

  /* istanbul ignore if: internal guard */
  if (!config._QUnit) {
    throw new ReferenceError('QUnit is undefined. Cannot call start() before qunit.js exports QUnit.');
  }

  if (config.reporters.console) {
    reporters.console.init(config._QUnit);
  }
  if (config.reporters.perf || (config.reporters.perf === undefined && window && document)) {
    reporters.perf.init(config._QUnit);
  }
  if (config.reporters.tap) {
    reporters.tap.init(config._QUnit);
  }

  // The test run hasn't officially begun yet
  // Record the time of the test run's beginning
  config.started = performance.now();

  // Delete the unnamed module if no global tests were defined (see config.js)
  if (config.modules[0].name === '' && config.modules[0].tests.length === 0) {
    config.modules.shift();
  }

  // Create a list of simplified and independent module descriptor objects for
  // the QUnit.begin callbacks. This prevents plugins from relying on reading
  // from (or writing!) to internal state.
  const modulesLog = [];
  for (let i = 0; i < config.modules.length; i++) {
    // Always omit the unnamed module from the list of module names
    // for UI plugins, even if there were glboal tests defined.
    if (config.modules[i].name !== '') {
      modulesLog.push({
        name: config.modules[i].name,
        moduleId: config.modules[i].moduleId
      });
    }
  }

  // The test run is officially beginning now
  emit('runStart', globalSuiteReport.start(true));
  runLoggingCallbacks('begin', {
    totalTests: Test.count,
    modules: modulesLog
  }).then(unblockAndAdvanceQueue);
}

export function start () {
  if (config.current) {
    throw new Error('QUnit.start cannot be called inside a test.');
  }
  if (config._runStarted) {
    if (document && config.autostart) {
      throw new Error('QUnit.start() called too many times. Did you call QUnit.start() in browser context when autostart is also enabled? https://qunitjs.com/api/QUnit/start/');
    }
    throw new Error('QUnit.start() called too many times.');
  }

  config._runStarted = true;

  // Add a slight delay to allow definition of more modules and tests.
  if (document && document.readyState !== 'complete' && setTimeout) {
    // In browser environments, if QUnit.start() is called very early,
    // still wait for DOM ready to ensure reliable integration of reporters.
    window.addEventListener('load', function () {
      setTimeout(function () {
        doStart();
      });
    });
  } else if (setTimeout) {
    setTimeout(function () {
      doStart();
    });
  } else {
    doStart();
  }
}
