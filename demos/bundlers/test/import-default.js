import QUnit from 'qunit';
import { add } from './src.js';

(globalThis.TEST_OBJECTS || (globalThis.TEST_OBJECTS = {})).import_default = QUnit;

QUnit.hello_import_default = QUnit.assert.hello_import_default = 'import-default';

QUnit.test('import-default', function (assert) {
  assert.equal(add(2, 3), 5);
});
