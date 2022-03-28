QUnit.config.moduleId = ['127c21dd', 'c1d6ebd4', '7d89af3b'];

QUnit.test('global test', function (assert) {
  assert.true(false);
});

QUnit.module('module A scoped', function () {
  QUnit.test('test A1', function (assert) {
    assert.true(false);
  });

  QUnit.module('module B nested', function () {
    QUnit.test('test B1', function (assert) {
      assert.true(false);
    });
  });

  QUnit.module('module C nested', function () {
    QUnit.test('test C1', function (assert) {
      assert.true(true, 'run module C');
    });
  });

  QUnit.test('test A2', function (assert) {
    assert.true(false);
  });
});

QUnit.module('module D scoped', function () {
  QUnit.test('test D1', function (assert) {
    assert.true(true, 'run module D');
  });

  QUnit.module('module E nested', function () {
    QUnit.test('test E1', function (assert) {
      assert.true(true, 'run module D');
    });
  });

  QUnit.test('test D2', function (assert) {
    assert.true(true, 'run module D');
  });
});

QUnit.module('module E flat');
QUnit.test('test E1', function (assert) {
  assert.true(false);
});

QUnit.module('module F flat');
QUnit.test('test F1', function (assert) {
  assert.true(true, 'run module F');
});
