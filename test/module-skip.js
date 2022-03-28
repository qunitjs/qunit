QUnit.config.reorder = false;

var tests = {};

QUnit.testDone(function (details) {
  tests[details.testId] = {
    skipped: details.skipped,
    todo: details.todo
  };
});

QUnit.module('Parent module', function (hooks) {
  hooks.after(function (assert) {
    assert.deepEqual(tests, {
      '1d56e5b5': {
        skipped: false,
        todo: false
      },
      d40f1738: {
        skipped: true,
        todo: false
      },
      acdd0267: {
        skipped: true,
        todo: false
      },
      '8b1c454f': {
        skipped: true,
        todo: false
      }
    });
  });

  QUnit.module('A normal module', function () {
    QUnit.test('normal test', function (assert) {
      assert.true(true, 'this test should run');
    });
  });

  QUnit.module.skip('This module will be skipped', function () {
    QUnit.test('test will be treated as a skipped test', function (assert) {
      assert.true(false, 'this test should not run');
    });

    QUnit.todo('a todo test that should be skipped', function (assert) {
      assert.true(false, 'this test should not run');
    });

    QUnit.skip('a normal skipped test', function (assert) {
      assert.true(false, 'this test should not run');
    });
  });

  // We need a test after the above skip, since hooks.after() runs after the
  // last non-skipped test, and we want to include events from the skipped test.
  QUnit.test('another test', function (assert) {
    assert.true(true, 'this test should run');
  });
});
