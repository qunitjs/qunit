QUnit.module('assert.step', function () {
  QUnit.test('pushes a failing assertion if no message is given', function (assert) {
    var original = assert.pushResult;
    var pushed = null;
    assert.pushResult = function (resultInfo) {
      pushed = resultInfo;
    };

    assert.step();

    assert.pushResult = original;
    assert.false(pushed.result);
    assert.equal(pushed.message, 'You must provide a message to assert.step');

    assert.verifySteps([undefined]);
  });

  QUnit.test('pushes a failing assertion if empty message is given', function (assert) {
    var original = assert.pushResult;
    var pushed = null;
    assert.pushResult = function (resultInfo) {
      pushed = resultInfo;
    };

    assert.step('');

    assert.pushResult = original;
    assert.false(pushed.result);
    assert.equal(pushed.message, 'You must provide a message to assert.step');

    assert.verifySteps(['']);
  });

  QUnit.test('pushes a failing assertion if a non string message is given', function (assert) {
    var original = assert.pushResult;
    var pushed = [];
    assert.pushResult = function (resultInfo) {
      pushed.push(resultInfo);
    };

    assert.step(1);
    assert.step(null);
    assert.step(false);

    assert.pushResult = original;
    assert.deepEqual(pushed, [
      { result: false, message: 'You must provide a string value to assert.step' },
      { result: false, message: 'You must provide a string value to assert.step' },
      { result: false, message: 'You must provide a string value to assert.step' }
    ]);
    assert.verifySteps([1, null, false]);
  });

  QUnit.test('pushes a passing assertion if a message is given', function (assert) {
    assert.step('One step');
    assert.step('Two step');

    assert.verifySteps(['One step', 'Two step']);
  });

  QUnit.test('step() and verifySteps() count as assertions', function (assert) {
    assert.expect(3);

    assert.step('One');
    assert.step('Two');

    assert.verifySteps(['One', 'Two'], 'Three');
  });

  QUnit.module('assert.verifySteps');

  QUnit.test('verifies the order and value of steps', function (assert) {
    assert.step('One step');
    assert.step('Two step');
    assert.step('Red step');
    assert.step('Blue step');

    assert.verifySteps(['One step', 'Two step', 'Red step', 'Blue step']);

    assert.step('One step');
    assert.step('Two step');
    assert.step('Red step');
    assert.step('Blue step');

    var original = assert.pushResult;
    var pushed = null;
    assert.pushResult = function (resultInfo) {
      pushed = resultInfo;
    };

    assert.verifySteps(['One step', 'Red step', 'Two step', 'Blue step']);
    assert.pushResult = original;

    assert.false(pushed.result);
  });

  QUnit.test('verifies the order and value of failed steps', function (assert) {
    assert.step('One step');

    var original = assert.pushResult;
    assert.pushResult = function noop () {};
    assert.step();
    assert.step('');
    assert.pushResult = original;

    assert.step('Two step');

    assert.verifySteps(['One step', undefined, '', 'Two step']);
  });

  QUnit.test('resets the step list after verification', function (assert) {
    assert.step('one');
    assert.verifySteps(['one']);

    assert.step('two');
    assert.verifySteps(['two']);
  });

  QUnit.test('empty verifySteps()', function (assert) {
    assert.verifySteps([]);
  });

  QUnit.test('errors if not called when `assert.step` is used', function (assert) {
    assert.expect(2);
    assert.step('one');

    var original = assert.test.pushFailure;
    assert.test.pushFailure = function (message) {
      assert.test.pushFailure = original;

      assert.equal(message, 'Expected assert.verifySteps() to be called before end of test after using assert.step(). Unverified steps: one');
    };
  });

  // Testing to ensure steps array is not passed by reference: https://github.com/qunitjs/qunit/issues/1266
  QUnit.module('assert.verifySteps value reference', function () {
    var loggedAssertions = {};

    QUnit.log(function (details) {
      if (details.message === 'verification-assertion') {
        loggedAssertions[details.message] = details;
      }
    });

    QUnit.test('passing test to see if steps array is passed by reference to logging function', function (assert) {
      assert.step('step one');
      assert.step('step two');

      assert.verifySteps(['step one', 'step two'], 'verification-assertion');
    });

    QUnit.test('steps array should not be reset in logging function', function (assert) {
      var result = loggedAssertions['verification-assertion'].actual;
      assert.deepEqual(result, ['step one', 'step two']);
    });
  });
});
