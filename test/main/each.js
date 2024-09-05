QUnit.module('test.each', function () {
  QUnit.test.each('test.each', [[1, 2, 3], [1, 1, 2]], function (assert, data) {
    assert.strictEqual(data[0] + data[1], data[2]);
  });
  QUnit.test.each('test.each 1D', [1, [], 'some'], function (assert, value) {
    assert.true(Boolean(value));
  });
  QUnit.test.each('test.each with object', { caseFoo: [1, 2, 3], caseBar: [1, 1, 2] }, function (assert, data) {
    assert.strictEqual(data[0] + data[1], data[2]);
  });
  QUnit.test.each('test.each fails with non-array input', ['something', 1, undefined, null], function (assert, value) {
    assert.throws(function () {
      QUnit.test.each('test.each 1D', value, function () { });
    }, TypeError);
  });

  // Promise support for test.each() is tested in test/main/promise.js.

  QUnit.module('arguments', function (hooks) {
    var todoArgs;
    hooks.after(function (assert) {
      assert.strictEqual(todoArgs, 2, 'test.each.todo() callback args');
    });

    QUnit.test.each('test.each() callback', [1], function (assert) {
      assert.strictEqual(arguments.length, 2);
    });
    QUnit.test.each('test.each() callback with undefined', [undefined], function (assert) {
      assert.strictEqual(arguments.length, 2);
    });
    QUnit.test.todo.each('test.each.todo() callback', [1], function (assert) {
      // Captured and asserted later since todo() is expected to fail
      todoArgs = arguments.length;
      assert.true(false);
    });
  });
});
QUnit.module('test.skip.each', function () {
  QUnit.test('do run', function (assert) { assert.true(true); });
  QUnit.test.skip.each('test.skip.each', [[1, 2, 3], [1, 1, 2]], function (assert) {
    assert.true(false);
  });
});
QUnit.module('test.todo.each', function () {
  QUnit.test.todo.each('test.todo.each', [[1, 2, 3], [1, 1, 2]], function (assert) {
    assert.true(false);
  });
});
