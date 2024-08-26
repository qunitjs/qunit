const QUnit = require('qunit').QUnit;
const { add } = require('./src.js');

(globalThis.TEST_OBJECTS || (globalThis.TEST_OBJECTS = {})).require_sub = QUnit;

QUnit.hello_require_sub = QUnit.assert.hello_require_sub = 'require-sub';

QUnit.test('require-sub', function (assert) {
  assert.equal(add(2, 3), 5);
});
