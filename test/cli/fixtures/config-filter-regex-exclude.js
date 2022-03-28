// regular expression (case-sensitive), inverted
QUnit.config.filter = '!/Foo|bar/';

QUnit.module('filter');

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
