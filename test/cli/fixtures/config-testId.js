QUnit.config.testId = ['94e5e740', '9e89c63c', '066af31c', 'c7ae85af'];

QUnit.test('test 1', function (assert) {
  assert.true(false);
});

QUnit.test('test 2', function (assert) {
  assert.true(true, 'run global test 2');
});

QUnit.module('module A', function () {
  QUnit.test('test 1', function (assert) {
    assert.true(false);
  });

  QUnit.module('module B', function () {
    QUnit.test('test 1', function (assert) {
      assert.true(true, 'run AB test 1');
    });
  });

  QUnit.module('module C', function () {
    QUnit.test('test 1', function (assert) {
      assert.true(false);
    });
    QUnit.test('test 2', function (assert) {
      assert.true(true, 'run AC test 2');
    });
  });

  QUnit.test('test 2', function (assert) {
    assert.true(false);
  });
});

QUnit.test('test 3', function (assert) {
  assert.true(false);
});

QUnit.module('module D', function () {
  QUnit.test('test 1', function (assert) {
    assert.true(true, 'run D test 1');
  });
});
