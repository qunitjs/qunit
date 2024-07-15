import { window, document, setTimeout } from './globals.js';

import equiv from './equiv.js';
import dump from './dump.js';
import { runSuite, module } from './module.js';
import Assert from './assert.js';
import Test, { test, pushFailure } from './test.js';
import reporters from './reporters.js';

import config from './core/config.js';
import hooks from './core/hooks.js';
import { objectType, is, performance } from './core/utilities.js';
import { createRegisterCallbackFunction, runLoggingCallbacks } from './callbacks.js';
import { sourceFromStacktrace } from './core/stacktrace.js';
import ProcessingQueue from './core/processing-queue.js';

import { urlParams } from './urlparams.js';
import { on, emit } from './events.js';
import onUncaughtException from './core/on-uncaught-exception.js';
import diff from './diff.js';
import version from './version.js';

// The "currentModule" object would ideally be defined using the createModule()
// function. Since it isn't, add the missing suiteReport property to it now that
// we have loaded all source code required to do so.
//
// TODO: Consider defining currentModule in core.js or module.js in its entirely
// rather than partly in config.js and partly here.
config.currentModule.suiteReport = runSuite;

config._pq = new ProcessingQueue(test);

const QUnit = {

  // Figure out if we're running the tests from a server or not
  isLocal: (window && window.location && window.location.protocol === 'file:'),

  // Expose the current QUnit version
  version,

  config,
  urlParams,

  diff,
  dump,
  equiv,
  reporters,
  hooks,
  is,
  on,
  objectType,
  onUncaughtException,
  pushFailure,

  begin: createRegisterCallbackFunction('begin'),
  done: createRegisterCallbackFunction('done'),
  log: createRegisterCallbackFunction('log'),
  moduleDone: createRegisterCallbackFunction('moduleDone'),
  moduleStart: createRegisterCallbackFunction('moduleStart'),
  testDone: createRegisterCallbackFunction('testDone'),
  testStart: createRegisterCallbackFunction('testStart'),

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
  },

  stack: function (offset) {
    offset = (offset || 0) + 2;
    // Support Safari: Use temp variable to avoid triggering ES6 Proper Tail Calls,
    // which ensures a consistent cross-browser result.
    // https://bugs.webkit.org/show_bug.cgi?id=276187
    const source = sourceFromStacktrace(offset);
    return source;
  }
};

function unblockAndAdvanceQueue () {
  config.blocking = false;
  config._pq.advance();
}

function doBegin () {
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

export default QUnit;
