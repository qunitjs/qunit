const QUnit = require('qunit');
const { add } = require('./src.js');

(globalThis.TEST_OBJECTS || (globalThis.TEST_OBJECTS = {})).require_default = QUnit;

QUnit.hello_require_default = QUnit.assert.hello_require_default = 'require-default';

QUnit.test('require-default', function (assert) {
  assert.equal(add(2, 3), 5);
});
