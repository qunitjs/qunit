import { window, document, setTimeout } from './globals';

import equiv from './equiv';
import dump from './dump';
import { runSuite, module } from './module';
import Assert from './assert';
import Test, { test, pushFailure } from './test';
import exportQUnit from './export';
import reporters from './reporters';

import config from './core/config';
import hooks from './core/hooks';
import { extend, objectType, is, performance } from './core/utilities';
import { registerLoggingCallbacks, runLoggingCallbacks } from './core/logging';
import { sourceFromStacktrace } from './core/stacktrace';
import ProcessingQueue from './core/processing-queue';

import { urlParams } from './urlparams';
import { on, emit } from './events';
import onUncaughtException from './core/on-uncaught-exception';
import diff from './diff';
import version from './version';

const QUnit = {};

// The "currentModule" object would ideally be defined using the createModule()
// function. Since it isn't, add the missing suiteReport property to it now that
// we have loaded all source code required to do so.
//
// TODO: Consider defining currentModule in core.js or module.js in its entirely
// rather than partly in config.js and partly here.
config.currentModule.suiteReport = runSuite;

config.pq = new ProcessingQueue(test);

// Figure out if we're running the tests from a server or not
QUnit.isLocal = (window && window.location && window.location.protocol === 'file:');

// Expose the current QUnit version
QUnit.version = version;

extend(QUnit, {
  config,
  urlParams,

  diff,
  dump,
  equiv,
  reporters,
  hooks,
  is,
  objectType,
  on,
  onUncaughtException,
  pushFailure,

  assert: Assert.prototype,
  module,
  test,

  // alias other test flavors for easy access
  todo: test.todo,
  skip: test.skip,
  only: test.only,

  start: function () {
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
          begin();
        });
      });
    } else if (setTimeout) {
      setTimeout(function () {
        begin();
      });
    } else {
      begin();
    }
  },

  stack: function (offset) {
    offset = (offset || 0) + 2;
    return sourceFromStacktrace(offset);
  }
});

registerLoggingCallbacks(QUnit);

function unblockAndAdvanceQueue () {
  config.blocking = false;
  config.pq.advance();
}

function begin () {
  if (config.started) {
    unblockAndAdvanceQueue();
    return;
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

exportQUnit(QUnit);

export default QUnit;
