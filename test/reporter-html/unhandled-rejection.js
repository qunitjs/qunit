/* eslint-env browser */
/* global Promise */

// Detect if the current browser supports `onunhandledrejection`
// (avoiding errors in browsers without the capability)
var HAS_UNHANDLED_REJECTION_HANDLER = 'onunhandledrejection' in window;

if (HAS_UNHANDLED_REJECTION_HANDLER) {
  QUnit.module('Unhandled Rejections inside test context', function (hooks) {
    hooks.beforeEach(function (assert) {
      var originalPushResult = assert.pushResult;
      assert.pushResult = function (resultInfo) {
        // Invert the result so we can test failing assertions
        resultInfo.result = !resultInfo.result;
        originalPushResult.call(this, resultInfo);
      };
    });

    QUnit.test('test passes just fine, but has a rejected promise', function (assert) {
      var done = assert.async();

      Promise.resolve().then(function () {
        throw new Error('Error thrown in non-returned promise!');
      });

      // prevent test from exiting before unhandled rejection fires
      setTimeout(done, 10);
    });
  });
}
