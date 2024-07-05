import { window, document, setTimeout } from './globals';

import equiv from './equiv';
import dump from './dump';
import { runSuite, module } from './module';
import Assert from './assert';
import Logger from './logger';
import Test, { test, pushFailure } from './test';
import exportQUnit from './export';
import reporters from './reporters';

import config from './core/config';
import hooks from './core/hooks';
import { extend, objectType, is, performance } from './core/utilities';
import { registerLoggingCallbacks, runLoggingCallbacks } from './core/logging';
import { sourceFromStacktrace } from './core/stacktrace';
import ProcessingQueue from './core/processing-queue';

import { on, emit } from './events';
import onWindowError from './core/onerror';
import onUncaughtException from './core/on-uncaught-exception';
import diff from './core/diff';

const QUnit = {};

// The "currentModule" object would ideally be defined using the createModule()
// function. Since it isn't, add the missing suiteReport property to it now that
// we have loaded all source code required to do so.
//
// TODO: Consider defining currentModule in core.js or module.js in its entirely
// rather than partly in config.js and partly here.
config.currentModule.suiteReport = runSuite;

config.pq = new ProcessingQueue(test);

let globalStartCalled = false;
let runStarted = false;

// Figure out if we're running the tests from a server or not
QUnit.isLocal = (window && window.location && window.location.protocol === 'file:');

// Expose the current QUnit version
QUnit.version = '@VERSION';

extend(QUnit, {
  config,

  diff,
  dump,
  equiv,
  reporters,
  hooks,
  is,
  objectType,
  on,
  onError: onWindowError,
  onUncaughtException,
  pushFailure,

  assert: Assert.prototype,
  module,
  test,

  // alias other test flavors for easy access
  todo: test.todo,
  skip: test.skip,
  only: test.only,

  start: function (count) {
    if (config.current) {
      throw new Error('QUnit.start cannot be called inside a test context.');
    }

    const globalStartAlreadyCalled = globalStartCalled;
    globalStartCalled = true;

    if (runStarted) {
      throw new Error('Called start() while test already started running');
    }
    if (globalStartAlreadyCalled || count > 1) {
      throw new Error('Called start() outside of a test context too many times');
    }
    if (config.autostart) {
      throw new Error('Called start() outside of a test context when ' +
        'QUnit.config.autostart was true');
    }

    // Until we remove QUnit.load() in QUnit 3, we keep `pageLoaded`.
    // It no longer serves any purpose other than to support old test runners
    // that still call only QUnit.load(), or that call both it and QUnit.start().
    if (!config.pageLoaded) {
      // If the test runner used `autostart = false` and is calling QUnit.start()
      // to tell is their resources are ready, but the browser isn't ready yet,
      // then enable autostart now, and we'll let the tests really start after
      // the browser's "load" event handler calls autostart().
      config.autostart = true;

      // If we're in Node or another non-browser environment, we start now as there
      // won't be any "load" event. We return early either way since autostart
      // is responsible for calling scheduleBegin (avoid "beginning" twice).
      if (!document) {
        QUnit.autostart();
      }

      return;
    }

    scheduleBegin();
  },

  onUnhandledRejection: function (reason) {
    Logger.warn('QUnit.onUnhandledRejection is deprecated and will be removed in QUnit 3.0.' +
      ' Please use QUnit.onUncaughtException instead.');
    onUncaughtException(reason);
  },

  extend: function (...args) {
    Logger.warn('QUnit.extend is deprecated and will be removed in QUnit 3.0.' +
      ' Please use Object.assign instead.');

    // delegate to utility implementation, which does not warn and can be used elsewhere internally
    return extend.apply(this, args);
  },

  load: function () {
    Logger.warn('QUnit.load is deprecated and will be removed in QUnit 3.0.' +
      ' https://qunitjs.com/api/QUnit/load/');

    QUnit.autostart();
  },

  /**
   * @internal
   */
  autostart: function () {
    config.pageLoaded = true;

    // Initialize the configuration options
    // TODO: Move this to config.js in QUnit 3.
    extend(config, {
      started: 0,
      updateRate: 1000,
      autostart: true,
      filter: ''
    }, true);

    if (!runStarted) {
      config.blocking = false;

      if (config.autostart) {
        scheduleBegin();
      }
    }
  },

  stack: function (offset) {
    offset = (offset || 0) + 2;
    // Support Safari: Use temp variable to avoid TCO for consistent cross-browser result
    // https://bugs.webkit.org/show_bug.cgi?id=276187
    const source = sourceFromStacktrace(offset);
    return source;
  }
});

registerLoggingCallbacks(QUnit);

function scheduleBegin () {
  runStarted = true;

  // Add a slight delay to allow definition of more modules and tests.
  if (setTimeout) {
    setTimeout(function () {
      begin();
    });
  } else {
    begin();
  }
}

function unblockAndAdvanceQueue () {
  config.blocking = false;
  config.pq.advance();
}

export function begin () {
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
        moduleId: config.modules[i].moduleId,

        // Added in QUnit 1.16.0 for internal use by html-reporter,
        // but no longer used since QUnit 2.7.0.
        // @deprecated Kept unofficially to be removed in QUnit 3.0.
        tests: config.modules[i].tests
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
