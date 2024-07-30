import { QUnit, assert, test } from 'qunit';
import { add } from './src.js';

(globalThis.TEST_OBJECTS || (globalThis.TEST_OBJECTS = {})).import_named = QUnit;

QUnit.hello_import_named = assert.hello_import_named = 'import-named';

test('import-named', function (assert) {
  assert.equal(add(2, 3), 5);
});
