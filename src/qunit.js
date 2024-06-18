/* global module, exports */

import core from './core';
import { initBrowser } from './browser/browser-runner';
import { globalThis, window, document } from './globals';

/**
 * Available exports:
 *
 * globalThis:
 * - browser (globalThis === window)
 * - Web Worker (globalThis === self)
 * - Node.js
 * - SpiderMonkey (mozjs)
 * - Rhino 7.14+
 * - any other embedded JS engine
 *
 * CommonJS module.exports (commonjs2):
 * - Node.js
 *
 * CommonJS exports (commonjs, https://wiki.commonjs.org/wiki/Modules):
 * - Rhino
 */

// If a real QUnit global was already defined, then replace our reference
// with that one, and export that instead. Skip initBrowser() to avoid
// doubling the user interface.
//
// Since QUnit 3.0, we no longer throw an error if QUnit is loaded twice.
// This enables mixed use of ESM import and CJS require() in a project,
// without split-brain problems for defining tests, setting config, registering
// reporters, etc.
//
// Note that a placeholder QUnit global may exist for preconfiguration.
// Such placeholder is recognised by not having QUnit.version (it should
// only contain QUnit.config), and will be upgraded to the real QUnit.
let QUnit;
if (globalThis.QUnit && globalThis.QUnit.version) {
  QUnit = globalThis.QUnit;
} else {
  QUnit = core;
  globalThis.QUnit = QUnit;

  if (window && document) {
    initBrowser(QUnit, window, document);
  }
}

// For Node.js
if (typeof module !== 'undefined' && module && module.exports) {
  module.exports = QUnit;

  // For consistency with CommonJS environments' exports
  module.exports.QUnit = QUnit;
}

// For CommonJS with exports, but without module.exports, like Rhino
if (typeof exports !== 'undefined' && exports) {
  exports.QUnit = QUnit;
}
