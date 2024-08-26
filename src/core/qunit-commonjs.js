/* global module, exports */
import QUnit from './qunit.js';

// For Node.js
if (typeof module !== 'undefined' && module && module.exports) {
  module.exports = QUnit;
}

// For CommonJS with exports, but without module.exports, like Rhino
if (typeof exports !== 'undefined' && exports) {
  exports.QUnit = QUnit;
}
