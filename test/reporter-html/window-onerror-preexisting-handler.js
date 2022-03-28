/* eslint-env browser */
/* global onerrorReturnValue: true, onerrorCallingContext: true */

QUnit.module('window.onerror (with preexisting handler)', function (hooks) {
  var originalOnUncaught;

  hooks.beforeEach(function () {
    onerrorReturnValue = null;
    onerrorCallingContext = null;

    originalOnUncaught = QUnit.onUncaughtException;
  });

  hooks.afterEach(function () {
    QUnit.onUncaughtException = originalOnUncaught;
  });

  QUnit.test('call QUnit.onUncaughtException if handler returns false', function (assert) {
    assert.expect(1);

    onerrorReturnValue = false;

    QUnit.onUncaughtException = function () {
      assert.true(true, 'QUnit.onUncaughtException was called');
    };

    window.onerror('An error message', 'filename.js', 1);
  });

  QUnit.test('call QUnit.onUncaughtException if handler returns undefined', function (assert) {
    assert.expect(1);

    onerrorReturnValue = undefined;

    QUnit.onUncaughtException = function () {
      assert.true(true, 'QUnit.onUncaughtException was called');
    };

    window.onerror('An error message', 'filename.js', 1);
  });

  QUnit.test('call QUnit.onUncaughtException if handler returns truthy', function (assert) {
    assert.expect(1);

    onerrorReturnValue = 'truthy value';

    QUnit.onUncaughtException = function () {
      assert.true(true, 'QUnit.onUncaughtException was called');
    };

    window.onerror('An error message', 'filename.js', 1);
  });

  QUnit.test('ignore error if other handler returns true', function (assert) {
    assert.expect(1);

    onerrorReturnValue = true;

    QUnit.onUncaughtException = function () {
      assert.true(false, 'QUnit.onUncaughtException should not have been called');
    };

    var result = window.onerror('An error message', 'filename.js', 1);

    assert.strictEqual(result, true, 'Our error handler should have returned true');
  });

  QUnit.test('window.onerror handler is called on window', function (assert) {
    assert.expect(1);

    QUnit.onUncaughtException = function () {};

    window.onerror('An error message', 'filename.js', 1);

    assert.strictEqual(onerrorCallingContext, window, 'Handler called with correct context');
  });

  QUnit.test('forward return value of prexisting onerror', function (assert) {
    assert.expect(1);

    onerrorReturnValue = {};

    QUnit.onUncaughtException = function () {};

    var result = window.onerror('An error message', 'filename.js', 1);

    assert.strictEqual(result, onerrorReturnValue, 'return value');
  });
});
