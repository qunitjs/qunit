/* global module, exports */
import { window, document, globalThis } from './globals.js';

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
export default function exportQUnit (QUnit) {
  if (window && document) {
    // QUnit may be defined when it is preconfigured but then only QUnit and QUnit.config may be defined.
    if (globalThis.QUnit && globalThis.QUnit.version) {
      throw new Error('QUnit has already been defined.');
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

  // Ensure the global is available in all environments.
  //
  // For backward compatibility, we only enforce load-once in browsers above.
  // In other environments QUnit is accessible via import/require() and may
  // load multiple times. Callers may decide whether their secondary instance
  // should be global or not.
  if (!globalThis.QUnit || !globalThis.QUnit.version) {
    globalThis.QUnit = QUnit;
  }
}
