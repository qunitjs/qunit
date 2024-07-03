/* eslint-env browser */
if (!location.search) {
  location.replace('?module=Foo');
}

QUnit.module('Foo');

QUnit.test('config parsed', function (assert) {
  assert.strictEqual(QUnit.config.module, 'Foo', 'parsed config');
});

QUnit.module('Bar');

QUnit.test('Bar test', function (assert) {
  assert.true(false);
});
