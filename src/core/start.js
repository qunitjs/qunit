import { runLoggingCallbacks } from './callbacks.js';
import config from './config.js';
import { emit } from './events.js';
import { window, document, setTimeout } from './globals.js';
import { runSuite } from './module.js';
import Test from './test.js';
import reporters from './reporters.js';
import { performance } from './utilities.js';

function unblockAndAdvanceQueue () {
  config.blocking = false;
  config._pq.advance();
}

// Inject the complete QUnit API for use by reporters
export function createStartFunction (QUnit) {
  function doBegin () {
    if (config.started) {
      unblockAndAdvanceQueue();
      return;
    }

    // QUnit.config.reporters is considered writable between qunit.js and QUnit.start().
    // Now, it is time to decide which reporters we'll load.
    if (config.reporters.console) {
      reporters.console.init(QUnit);
    }
    if (config.reporters.html || (config.reporters.html === undefined && window && document)) {
      reporters.html.init(QUnit);
    }
    if (config.reporters.perf || (config.reporters.perf === undefined && window && document)) {
      reporters.perf.init(QUnit);
    }
    if (config.reporters.tap) {
      reporters.tap.init(QUnit);
    }

    // The test run hasn't officially begun yet
    // Record the time of the test run's beginning
    config.started = performance.now();

    // Delete the loose unnamed module if unused.
    if (config.modules[0].name === '' && config.modules[0].tests.length === 0) {
      config.modules.shift();
    }

    const modulesLog = [];
    for (let i = 0; i < config.modules.length; i++) {
      // Don't expose the unnamed global test module to plugins.
      if (config.modules[i].name !== '') {
        modulesLog.push({
          name: config.modules[i].name,
          moduleId: config.modules[i].moduleId
        });
      }
    }

    // The test run is officially beginning now
    emit('runStart', runSuite.start(true));
    runLoggingCallbacks('begin', {
      totalTests: Test.count,
      modules: modulesLog
    }).then(unblockAndAdvanceQueue);
  }

  return function start () {
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
          doBegin();
        });
      });
    } else if (setTimeout) {
      setTimeout(function () {
        doBegin();
      });
    } else {
      doBegin();
    }
  };
}
