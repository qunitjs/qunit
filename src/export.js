/* global module, exports, define */
import { window, document, globalThis } from './globals';

export default function exportQUnit (QUnit) {
  let exportedModule = false;

  if (window && document) {
    // QUnit may be defined when it is preconfigured but then only QUnit and QUnit.config may be defined.
    if (window.QUnit && window.QUnit.version) {
      throw new Error('QUnit has already been defined.');
    }

    window.QUnit = QUnit;

    exportedModule = true;
  }

  // For Node.js
  if (typeof module !== 'undefined' && module && module.exports) {
    module.exports = QUnit;

    // For consistency with CommonJS environments' exports
    module.exports.QUnit = QUnit;
    // For allowing a CJS-compatible ESM imports
    module.exports.todo = QUnit.todo;
    module.exports.skip = QUnit.skip;
    module.exports.test = QUnit.test;
    module.exports.module = QUnit.module;

    exportedModule = true;
  }

  // For CommonJS with exports, but without module.exports, like Rhino
  if (typeof exports !== 'undefined' && exports) {
    exports.QUnit = QUnit;

    exportedModule = true;
  }

  // For AMD
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return QUnit;
    });
    QUnit.config.autostart = false;

    exportedModule = true;
  }

  // For other environments, including Web Workers (globalThis === self),
  // SpiderMonkey (mozjs), and other embedded JavaScript engines
  if (!exportedModule) {
    globalThis.QUnit = QUnit;
  }
}
