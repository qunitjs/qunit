/* global TEST_OBJECTS */
import './import-default.js';
import './import-named.js';
import './require-default.cjs';
import './require-sub.cjs';

import QUnit from 'qunit';

QUnit.test('import-indirect', function (assert) {
  assert.strictEqual(TEST_OBJECTS.import_default, QUnit, 'identity');
  assert.strictEqual(QUnit.hello_import_default, 'import-default', 'extend QUnit');
  assert.strictEqual(assert.hello_import_default, 'import-default', 'extend assert');

  assert.strictEqual(TEST_OBJECTS.import_named, QUnit, 'identity');
  assert.strictEqual(QUnit.hello_import_named, 'import-named', 'extend QUnit');
  assert.strictEqual(assert.hello_import_named, 'import-named', 'extend assert');

  assert.strictEqual(TEST_OBJECTS.require_default, QUnit, 'identity');
  assert.strictEqual(QUnit.hello_require_default, 'require-default', 'extend QUnit');
  assert.strictEqual(assert.hello_require_default, 'require-default', 'extend assert');

  assert.strictEqual(TEST_OBJECTS.require_sub, QUnit, 'identity');
  assert.strictEqual(QUnit.hello_require_sub, 'require-sub', 'extend QUnit');
  assert.strictEqual(assert.hello_require_sub, 'require-sub', 'extend assert');
});
