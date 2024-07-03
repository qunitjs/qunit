/* eslint-env browser */
if (!location.search) {
  // regular expression (case-sensitive), inverted
  location.replace('?filter=!/Foo|bar/');
}

QUnit.module('filter');

QUnit.test('config parsed', function (assert) {
  assert.strictEqual(QUnit.config.filter, '!/Foo|bar/');
});

QUnit.test('foo test', function (assert) {
  assert.true(true);
});

QUnit.test('Foo test', function (assert) {
  assert.true(false, 'Foo is excluded');
});

QUnit.test('bar test', function (assert) {
  assert.true(false, 'bar is excluded');
});

QUnit.test('Bar test', function (assert) {
  assert.true(true);
});
