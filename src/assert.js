import dump from './dump';
import equiv from './equiv';
import Logger from './logger';

import config from './core/config';
import { objectType, objectValues, objectValuesSubset, errorString } from './core/utilities';
import { sourceFromStacktrace } from './core/stacktrace';
import { clearTimeout } from './globals';

class Assert {
  constructor (testContext) {
    this.test = testContext;
  }

  timeout (duration) {
    if (typeof duration !== 'number') {
      throw new Error('You must pass a number as the duration to assert.timeout');
    }

    this.test.timeout = duration;

    // If a timeout has been set, clear it and reset with the new duration
    if (config.timeout) {
      clearTimeout(config.timeout);
      config.timeout = null;

      if (config.timeoutHandler && this.test.timeout > 0) {
        this.test.internalResetTimeout(this.test.timeout);
      }
    }
  }

  // Documents a "step", which is a string value, in a test as a passing assertion
  step (message) {
    let assertionMessage = message;
    let result = !!message;

    this.test.steps.push(message);

    if (typeof message === 'undefined' || message === '') {
      assertionMessage = 'You must provide a message to assert.step';
    } else if (typeof message !== 'string') {
      assertionMessage = 'You must provide a string value to assert.step';
      result = false;
    }

    this.pushResult({
      result,
      message: assertionMessage
    });
  }

  // Verifies the steps in a test match a given array of string values
  verifySteps (steps, message) {
    // Since the steps array is just string values, we can clone with slice
    const actualStepsClone = this.test.steps.slice();
    this.deepEqual(actualStepsClone, steps, message);
    this.test.steps.length = 0;
  }

  expect (asserts) {
    if (arguments.length === 1) {
      this.test.expected = asserts;
    } else {
      return this.test.expected;
    }
  }

  // Create a new async pause and return a new function that can release the pause.
  async (count) {
    if (count === undefined) {
      count = 1;
    } else if (typeof count !== 'number') {
      throw new TypeError('async takes number as an input');
    }
    const requiredCalls = count;
    return this.test.internalStop(requiredCalls);
  }

  closeTo (actual, expected, delta, message) {
    if (typeof delta !== 'number') {
      throw new TypeError('closeTo() requires a delta argument');
    }
    this.pushResult({
      result: Math.abs(actual - expected) <= delta,
      actual,
      expected,
      message: message || `value should be within ${delta} inclusive`
    });
  }

  push (result, actual, expected, message, negative) {
    Logger.warn('assert.push is deprecated and will be removed in QUnit 3.0.' +
      ' Please use assert.pushResult instead. https://qunitjs.com/api/assert/pushResult');

    const currentAssert = this instanceof Assert ? this : config.current.assert;
    return currentAssert.pushResult({
      result,
      actual,
      expected,
      message,
      negative
    });
  }

  // Public API to internal test.pushResult()
  pushResult (resultInfo) {
    // Destructure of resultInfo = { result, actual, expected, message, negative }
    let assert = this;
    const currentTest = (assert instanceof Assert && assert.test) || config.current;

    // Backwards compatibility fix.
    // Allows the direct use of global exported assertions and QUnit.assert.*
    // Although, it's use is not recommended as it can leak assertions
    // to other tests from async tests, because we only get a reference to the current test,
    // not exactly the test where assertion were intended to be called.
    if (!currentTest) {
      throw new Error('assertion outside test context, in ' + sourceFromStacktrace(2));
    }

    if (!(assert instanceof Assert)) {
      assert = currentTest.assert;
    }

    return assert.test.pushResult(resultInfo);
  }

  ok (result, message) {
    if (!message) {
      message = result
        ? 'okay'
        : `failed, expected argument to be truthy, was: ${dump.parse(result)}`;
    }

    this.pushResult({
      result: !!result,
      actual: result,
      expected: true,
      message
    });
  }

  notOk (result, message) {
    if (!message) {
      message = !result
        ? 'okay'
        : `failed, expected argument to be falsy, was: ${dump.parse(result)}`;
    }

    this.pushResult({
      result: !result,
      actual: result,
      expected: false,
      message
    });
  }

  true (result, message) {
    this.pushResult({
      result: result === true,
      actual: result,
      expected: true,
      message
    });
  }

  false (result, message) {
    this.pushResult({
      result: result === false,
      actual: result,
      expected: false,
      message
    });
  }

  equal (actual, expected, message) {
    this.pushResult({
      // eslint-disable-next-line eqeqeq
      result: expected == actual,
      actual,
      expected,
      message
    });
  }

  notEqual (actual, expected, message) {
    this.pushResult({
      // eslint-disable-next-line eqeqeq
      result: expected != actual,
      actual,
      expected,
      message,
      negative: true
    });
  }

  propEqual (actual, expected, message) {
    actual = objectValues(actual);
    expected = objectValues(expected);

    this.pushResult({
      result: equiv(actual, expected),
      actual,
      expected,
      message
    });
  }

  notPropEqual (actual, expected, message) {
    actual = objectValues(actual);
    expected = objectValues(expected);

    this.pushResult({
      result: !equiv(actual, expected),
      actual,
      expected,
      message,
      negative: true
    });
  }

  propContains (actual, expected, message) {
    actual = objectValuesSubset(actual, expected);

    // The expected parameter is usually a plain object, but clone it for
    // consistency with propEqual(), and to make it easy to explain that
    // inheritence is not considered (on either side), and to support
    // recursively checking subsets of nested objects.
    expected = objectValues(expected, false);

    this.pushResult({
      result: equiv(actual, expected),
      actual,
      expected,
      message
    });
  }

  notPropContains (actual, expected, message) {
    actual = objectValuesSubset(actual, expected);
    expected = objectValues(expected);

    this.pushResult({
      result: !equiv(actual, expected),
      actual,
      expected,
      message,
      negative: true
    });
  }

  deepEqual (actual, expected, message) {
    this.pushResult({
      result: equiv(actual, expected),
      actual,
      expected,
      message
    });
  }

  notDeepEqual (actual, expected, message) {
    this.pushResult({
      result: !equiv(actual, expected),
      actual,
      expected,
      message,
      negative: true
    });
  }

  strictEqual (actual, expected, message) {
    this.pushResult({
      result: expected === actual,
      actual,
      expected,
      message
    });
  }

  notStrictEqual (actual, expected, message) {
    this.pushResult({
      result: expected !== actual,
      actual,
      expected,
      message,
      negative: true
    });
  }

  ['throws'] (block, expected, message) {
    [expected, message] = validateExpectedExceptionArgs(expected, message, 'throws');

    const currentTest = (this instanceof Assert && this.test) || config.current;

    if (typeof block !== 'function') {
      currentTest.assert.pushResult({
        result: false,
        actual: block,
        message: 'The value provided to `assert.throws` in ' +
          '"' + currentTest.testName + '" was not a function.'
      });

      return;
    }

    let actual;
    let result = false;

    currentTest.ignoreGlobalErrors = true;
    try {
      block.call(currentTest.testEnvironment);
    } catch (e) {
      actual = e;
    }
    currentTest.ignoreGlobalErrors = false;

    if (actual) {
      [result, expected, message] = validateException(actual, expected, message);
    }

    currentTest.assert.pushResult({
      result,

      // undefined if it didn't throw
      actual: actual && errorString(actual),
      expected,
      message
    });
  }

  rejects (promise, expected, message) {
    [expected, message] = validateExpectedExceptionArgs(expected, message, 'rejects');

    const currentTest = (this instanceof Assert && this.test) || config.current;

    const then = promise && promise.then;
    if (typeof then !== 'function') {
      currentTest.assert.pushResult({
        result: false,
        message: 'The value provided to `assert.rejects` in ' +
          '"' + currentTest.testName + '" was not a promise.',
        actual: promise
      });

      return;
    }

    const done = this.async();

    return then.call(
      promise,
      function handleFulfillment () {
        currentTest.assert.pushResult({
          result: false,
          message: 'The promise returned by the `assert.rejects` callback in ' +
            '"' + currentTest.testName + '" did not reject.',
          actual: promise
        });

        done();
      },

      function handleRejection (actual) {
        let result;
        [result, expected, message] = validateException(actual, expected, message);

        currentTest.assert.pushResult({
          result,

          // leave rejection value of undefined as-is
          actual: actual && errorString(actual),
          expected,
          message
        });
        done();
      }
    );
  }
}

function validateExpectedExceptionArgs (expected, message, assertionMethod) {
  const expectedType = objectType(expected);

  // 'expected' is optional unless doing string comparison
  if (expectedType === 'string') {
    if (message === undefined) {
      message = expected;
      expected = undefined;
      return [expected, message];
    } else {
      throw new Error(
        'assert.' + assertionMethod +
        ' does not accept a string value for the expected argument.\n' +
        'Use a non-string object value (e.g. RegExp or validator function) ' +
        'instead if necessary.'
      );
    }
  }

  const valid =
    !expected || // TODO: be more explicit here
    expectedType === 'regexp' ||
    expectedType === 'function' ||
    expectedType === 'object';

  if (!valid) {
    throw new Error('Invalid expected value type (' + expectedType + ') ' +
      'provided to assert.' + assertionMethod + '.');
  }

  return [expected, message];
}

function validateException (actual, expected, message) {
  let result = false;
  const expectedType = objectType(expected);

  // These branches should be exhaustive, based on validation done in validateExpectedException

  // We don't want to validate
  if (!expected) {
    result = true;

    // Expected is a regexp
  } else if (expectedType === 'regexp') {
    result = expected.test(errorString(actual));

    // Log the string form of the regexp
    expected = String(expected);

    // Expected is a constructor, maybe an Error constructor.
    // Note the extra check on its prototype - this is an implicit
    // requirement of "instanceof", else it will throw a TypeError.
  } else if (expectedType === 'function' &&
    expected.prototype !== undefined && actual instanceof expected) {
    result = true;

    // Expected is an Error object
  } else if (expectedType === 'object') {
    result = actual instanceof expected.constructor &&
      actual.name === expected.name &&
      actual.message === expected.message;

    // Log the string form of the Error object
    expected = errorString(expected);

    // Expected is a validation function which returns true if validation passed
  } else if (expectedType === 'function') {
    // protect against accidental semantics which could hard error in the test
    try {
      result = expected.call({}, actual) === true;
      expected = null;
    } catch (e) {
      // assign the "expected" to a nice error string to communicate the local failure to the user
      expected = errorString(e);
    }
  }

  return [result, expected, message];
}

// Provide an alternative to assert.throws(), for environments that consider throws a reserved word
// Known to us are: Closure Compiler, Narwhal
// eslint-disable-next-line dot-notation
Assert.prototype.raises = Assert.prototype['throws'];

export default Assert;
