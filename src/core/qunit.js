// Imports that define the QUnit API
import Assert from './assert.js';
import { createRegisterCallbackFunction } from './callbacks.js';
import config from './config.js';
import diff from './diff.js';
import dump from './dump.js';
import equiv from './equiv.js';
import { on } from './events.js';
import { globalThis, window, document } from './globals.js';
import hooks from './hooks.js';
import { module, unnamedModule } from './module.js';
import onUncaughtException from './on-uncaught-exception.js';
import ProcessingQueue from './processing-queue.js';
import reporters from './reporters.js';
import { stack } from './stacktrace.js';
import { start } from './start.js';
import { urlParams } from './urlparams.js';
import { test, pushFailure } from './test.js';
import { extend, objectType, is } from './utilities.js';
import version from './version.js';

// Imports that help with init
import { initBrowser } from './browser/browser-runner.js';

// Finalise internal state and exports before we export the API
config.currentModule = unnamedModule;
config._pq = new ProcessingQueue();

const assert = Assert.prototype;

const isLocal = (window && window.location && window.location.protocol === 'file:');

const begin = createRegisterCallbackFunction('begin');
const done = createRegisterCallbackFunction('done');
const log = createRegisterCallbackFunction('log');
const moduleDone = createRegisterCallbackFunction('moduleDone');
const moduleStart = createRegisterCallbackFunction('moduleStart');
const testDone = createRegisterCallbackFunction('testDone');
const testStart = createRegisterCallbackFunction('testStart');

const only = test.only;
const skip = test.skip;
const todo = test.todo;

// Export the API
//
// * ESM export
//   - Node.js
//   - browser
//   - any other ESM-capable JS engine
//
// * globalThis
//   - browser (globalThis === window)
//   - Web Worker (globalThis === self)
//   - Node.js
//   - SpiderMonkey (mozjs)
//   - Rhino 7.14+
//   - any other embedded JS engine
//
// The following are handled by the separate export-commonjs.js file:
//
// * CommonJS module.exports (commonjs2)
//   - Node.js
//
// * CommonJS exports (commonjs, https://wiki.commonjs.org/wiki/Modules):
//   - Rhino

export {
  assert,
  begin,
  config,
  diff,
  done,
  dump,
  equiv,
  extend,
  hooks,
  is,
  isLocal,
  log,
  module,
  moduleDone,
  moduleStart,
  objectType,
  on,
  only,
  onUncaughtException,
  pushFailure,
  reporters,
  skip,
  stack,
  start,
  test,
  testDone,
  testStart,
  todo,
  urlParams,
  version
};

const QUnit = {
  assert,
  begin,
  config,
  diff,
  done,
  dump,
  equiv,
  extend,
  hooks,
  is,
  isLocal,
  log,
  module,
  moduleDone,
  moduleStart,
  objectType,
  on,
  only,
  onUncaughtException,
  pushFailure,
  reporters,
  skip,
  stack,
  start,
  test,
  testDone,
  testStart,
  todo,
  urlParams,
  version
};

// Inject the exported QUnit API for use by reporters in start()
config._QUnit = QUnit;

// Support: require('qunit').QUnit
//
// For interop and consistency between Node.js `module.exports = QUnit`
// and CommonJS environments `exports.QUnit = QUnit`, the below will
// effectively assign `module.exports.QUnit = QUnit` as well.
QUnit.QUnit = QUnit;

// Support: named import
//
//   import { QUnit } from 'qunit'
//
export { QUnit };

// Support: default import
//
//   import QUnit from 'qunit'
//
export default QUnit;

if (window && document) {
  // In browsers, throw if QUnit is loaded a second time.
  // This must not throw if a global called "QUnit" exists for preconfigurion,
  // in that case we simply upgrade/replace it with the proper export.
  // Such preconfig global would only have QUnit.config set, not e.g. QUnit.version.
  if (globalThis.QUnit && globalThis.QUnit.version) {
    throw new Error('QUnit has already been defined.');
  }
}

// Ensure the global is available in all environments.
//
// For backward compatibility, we only enforce load-once in browsers above.
// In other environments QUnit is accessible via import/require() and may
// load multiple times, including different versions from different sources.
// Callers decide whether to make their secondary instance global or not.
if (!globalThis.QUnit || !globalThis.QUnit.version) {
  globalThis.QUnit = QUnit;
}

if (window && document) {
  initBrowser(QUnit, window, document);
}
