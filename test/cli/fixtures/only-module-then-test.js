// https://github.com/qunitjs/qunit/issues/1645
QUnit.module('module A', function () {
  QUnit.test('test A1', function (assert) {
    assert.true(false, 'not run');
  });

  QUnit.module.only('module B', function () {
    QUnit.test('test B', function (assert) {
      assert.true(true, 'run');
    });
  });

  QUnit.test.only('test A2', function (assert) {
    assert.true(false, 'not run');
  });

  QUnit.test('test A3', function (assert) {
    assert.true(false, 'not run');
  });
});
