import { window } from './globals.js';
import equiv from './equiv.js';
import dump from './dump.js';
import { runSuite, module } from './module.js';
import Assert from './assert.js';
import { test, pushFailure } from './test.js';
import reporters from './reporters.js';
import config from './config.js';
import hooks from './hooks.js';
import { objectType, is } from './utilities.js';
import { createRegisterCallbackFunction } from './callbacks.js';
import { stack } from './stacktrace.js';
import ProcessingQueue from './processing-queue.js';
import { urlParams } from './urlparams.js';
import { on } from './events.js';
import onUncaughtException from './on-uncaught-exception.js';
import diff from './diff.js';
import version from './version.js';
import { createStartFunction } from './start.js';

// The "currentModule" object would ideally be defined using the createModule()
// function. Since it isn't, add the missing suiteReport property to it now that
// we have loaded all source code required to do so.
//
// TODO: Consider defining currentModule in core.js or module.js in its entirely
// rather than partly in config.js and partly here.
config.currentModule.suiteReport = runSuite;

config._pq = new ProcessingQueue();

const QUnit = {

  // Figure out if we're running the tests from a server or not
  isLocal: (window && window.location && window.location.protocol === 'file:'),

  // Expose the current QUnit version
  version,

  config,
  stack,
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
  only: test.only
};
QUnit.start = createStartFunction(QUnit);

export default QUnit;
