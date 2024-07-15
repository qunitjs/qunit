QUnit.module('browser-runner', function () {
  /* global window, Promise, setTimeout */
  var HAS_UNHANDLED_REJECTION_HANDLER = (typeof window !== 'undefined' && 'onunhandledrejection' in window && typeof Promise === 'function');

  // Skip in non-browser and unsupporting browsers
  QUnit.module.if('onunhandledrejection', HAS_UNHANDLED_REJECTION_HANDLER, function (hooks) {
    // TODO: Once we run browser tests with QTap, remove this hack
    // and instead write expected failures in .tap.txt snapshots.
    hooks.beforeEach(function (assert) {
      var test = this;
      var original = assert.pushResult;
      assert.pushResult = function (resultInfo) {
        if (test.expectedFailure && test.expectedFailure === resultInfo.message) {
          // Restore
          assert.pushResult = original;
          test.expectedFailure = null;
          // Inverts the result of the (one) expected failure
          resultInfo.result = !resultInfo.result;
        }

        return original.call(assert, resultInfo);
      };
    });

    QUnit.test('example', function (assert) {
      var done = assert.async();

      this.expectedFailure = 'global failure: Error: Example from non-returned promise!';

      // eslint-disable-next-line compat/compat -- Checked
      Promise.resolve().then(function () {
        // prevent test from exiting before unhandled rejection fires
        setTimeout(done, 20);
        throw new Error('Example from non-returned promise!');
      });
    });
  });
});
