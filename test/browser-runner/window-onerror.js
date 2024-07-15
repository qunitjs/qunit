/* eslint-env browser */
QUnit.module('window.onerror [no preexisting handler]', function (hooks) {
  var originalOnUncaught;

  hooks.beforeEach(function () {
    originalOnUncaught = QUnit.onUncaughtException;
  });

  hooks.afterEach(function () {
    QUnit.onUncaughtException = originalOnUncaught;
  });

  QUnit.test('call QUnit.onUncaughtException', function (assert) {
    assert.expect(1);

    QUnit.onUncaughtException = function () {
      assert.true(true, 'called');
    };

    window.onerror('An error message', 'filename.js', 1);
  });

  QUnit.test('extract stacktrace', function (assert) {
    assert.expect(1);

    var errorObj = {
      stack: 'dummy.js:1 top()\ndummy.js:2 middle()\ndummy.js:3 bottom()'
    };

    QUnit.onUncaughtException = function (error) {
      assert.equal(error.stack, errorObj.stack, 'stack');
    };

    window.onerror('An error message', 'filename.js', 1, 1, errorObj);
  });
});
