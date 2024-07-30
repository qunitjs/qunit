/* global TEST_OBJECTS */
const QUnit = require('qunit');

require('./import-default.js');
require('./import-named.js');
require('./require-default.cjs');

QUnit.test('require-indirect', function (assert) {
  assert.strictEqual(TEST_OBJECTS.import_default, QUnit, 'identity');
  assert.strictEqual(QUnit.hello_import_default, 'import-default', 'extend QUnit');
  assert.strictEqual(assert.hello_import_default, 'import-default', 'extend assert');

  assert.strictEqual(TEST_OBJECTS.import_named, QUnit, 'identity');
  assert.strictEqual(QUnit.hello_import_named, 'import-named', 'extend QUnit');
  assert.strictEqual(assert.hello_import_named, 'import-named', 'extend assert');

  assert.strictEqual(TEST_OBJECTS.require_default, QUnit, 'identity');
  assert.strictEqual(QUnit.hello_require_default, 'require-default', 'extend QUnit');
  assert.strictEqual(assert.hello_require_default, 'require-default', 'extend assert');
});
