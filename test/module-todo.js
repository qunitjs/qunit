QUnit.config.reorder = false;

var tests = {};

QUnit.testDone(function (details) {
  tests[details.testId] = {
    skipped: details.skipped,
    todo: details.todo
  };
});

QUnit.module('parent module', function (hooks) {
  hooks.after(function (assert) {
    assert.deepEqual(tests, {
      efa6d5f5: {
        skipped: false,
        todo: false
      },
      d394a378: {
        skipped: false,
        todo: true
      },
      ffd66a5e: {
        skipped: true,
        todo: false
      },
      '951df7ad': {
        skipped: false,
        todo: true
      }
    });
  });

  QUnit.module('a normal module', function () {
    QUnit.test('normal test', function (assert) {
      assert.true(true, 'this test should run');
    });
  });

  QUnit.module.todo('a todo module', function () {
    QUnit.todo('a todo test', function (assert) {
      assert.true(false, 'not implemented yet');
    });

    QUnit.skip('a skipped test that will be left intact', function (assert) {
      assert.true(false, 'not implemented yet');
    });

    QUnit.test('a normal test that will be treated as a todo', function (assert) {
      assert.true(false, 'not implemented yet');
    });
  });

  // We need one more test to ensure hooks.after() runs after the above has finished.
  QUnit.test('another test', function (assert) {
    assert.true(true, 'this test should run');
  });
});
