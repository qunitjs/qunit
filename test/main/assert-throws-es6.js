QUnit.module('assert.throws [es6]', function () {
  function CustomError (message) {
    this.message = message;
  }

  CustomError.prototype.toString = function () {
    return this.message;
  };

  QUnit.test('throws [matcher arrow function]', function (assert) {
    assert.throws(
      function () {
        throw new CustomError('some error description');
      },
      err => {
        return err instanceof CustomError && /description/.test(err);
      }
    );
  });

  QUnit.test('throws [matcher Error subclass]', function (assert) {
    class CustomError extends Error {}

    assert.throws(
      function () {
        throw new CustomError('foo');
      },
      CustomError
    );
  });

  // TODO: Once we run browser tests with QTap, remove this hack
  // and instead write expected failures in .tap.txt snapshots.
  QUnit.module('failing assertions', function (hooks) {
    hooks.beforeEach(function (assert) {
      const original = assert.pushResult;
      assert.pushResult = (resultInfo) => {
        if (this.expectedFailure &&
          this.expectedFailure.actual === resultInfo.actual &&
          this.expectedFailure.expected.test(resultInfo.expected)
        ) {
          // Restore
          assert.pushResult = original;
          this.expectedFailure = null;
          // Inverts the result of the (one) expected failure
          resultInfo.result = !resultInfo.result;
        }

        return original.call(this, resultInfo);
      };
    });

    QUnit.test('throws [matcher arrow fn returns false]', function (assert) {
      this.expectedFailure = {
        actual: 'Error: foo',
        expected: /^null$/
      };

      assert.throws(
        function () {
          throw new Error('foo');
        },
        () => false
      );
    });

    QUnit.test('throws [graceful failure when class given as matcher]', function (assert) {
      // Avoid uncaught "Died on test" and instead report it
      // gracefully as an assertion failure
      // https://github.com/qunitjs/qunit/issues/1530
      this.expectedFailure = {
        actual: 'Error: foo',
        // [Firefox 127] TypeError: class constructors must be invoked with 'new'
        // [Safari 17] TypeError: Cannot call a class constructor without |new|
        // [Chrome 126] TypeError: Class constructor CustomError cannot be invoked without 'new'
        expected: /^TypeError: .*[Cc]lass constructors? .*\bnew/
      };

      class CustomError extends Error {}
      assert.throws(
        () => {
          throw new Error('foo');
        },
        CustomError
      );
    });
  });
});
