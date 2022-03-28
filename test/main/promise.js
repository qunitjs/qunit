// Support IE 9: Promise not supported, test MUST NOT load polyfil globally.
// Support SpiderMonkey: setTimeout is not supported, but native Promise is.
var defer = typeof setTimeout !== 'undefined'
  // eslint-disable-next-line no-undef
  ? setTimeout
  : function (fn) {
    // eslint-disable-next-line no-undef, compat/compat
    Promise.resolve().then(fn);
  };

// NOTE: Adds 1 assertion
function createMockPromise (assert, reject, value) {
  if (arguments.length < 3) {
    value = {};
  }
  var thenable = {
    then: function (fulfilledCallback, rejectedCallback) {
      assert.strictEqual(this, thenable, '`then` invoked with our Promise as thisValue');
      defer(function () {
        return reject
          ? rejectedCallback.call(thenable, value)
          : fulfilledCallback.call(thenable, value);
      });
    }
  };
  return thenable;
}

QUnit.module('Support for Promise', function () {
  QUnit.module('before hook with non-Promise', {
    before: function (assert) {
      assert.true(true);
      return {};
    }
  });
  QUnit.test('test', function (assert) {
    assert.expect(1);
  });

  QUnit.module('before hook with Promise', {
    before: function (assert) {
      // Adds 1 assertion
      return createMockPromise(assert);
    }
  });
  QUnit.test('test', function (assert) {
    assert.expect(1);
  });

  QUnit.module('beforeEach hook with non-Promise', {
    beforeEach: function (assert) {
      assert.true(true);
      return {};
    }
  });
  QUnit.test('test', function (assert) {
    assert.expect(1);
  });

  QUnit.module('beforeEach hook with Promise', {
    beforeEach: function (assert) {
      // Adds 1 assertion
      return createMockPromise(assert);
    }
  });
  QUnit.test('test', function (assert) {
    assert.expect(1);
  });

  QUnit.module('afterEach hook with non-Promise', {
    afterEach: function (assert) {
      assert.true(true);
      return {};
    }
  });
  QUnit.test('test', function (assert) {
    assert.expect(1);
  });

  QUnit.module('afterEach hook with Promise', {
    afterEach: function (assert) {
      // Adds 1 assertion
      return createMockPromise(assert);
    }
  });
  QUnit.test('test', function (assert) {
    assert.expect(1);
  });

  QUnit.module('after hook with non-Promise ', {
    after: function (assert) {
      assert.true(true);
      return {};
    }
  });
  QUnit.test('test', function (assert) {
    assert.expect(1);
  });

  QUnit.module('after hook with Promise', {
    after: function (assert) {
      // Adds 1 assertion
      return createMockPromise(assert);
    }
  });
  QUnit.test('test', function (assert) {
    assert.expect(1);
  });

  QUnit.module('all hooks with Promise', {
    before: function (assert) {
      return createMockPromise(assert);
    },
    beforeEach: function (assert) {
      return createMockPromise(assert);
    },
    afterEach: function (assert) {
      return createMockPromise(assert);
    },
    after: function (assert) {
      return createMockPromise(assert);
    }
  });
  QUnit.test('test', function (assert) {
    assert.expect(5);
    return createMockPromise(assert);
  });

  QUnit.module('tests', {
    afterEach: function (assert) {
      // Restore
      if (this.pushFailure) {
        assert.test.pushFailure = this.pushFailure;
      }
    }
  });

  QUnit.test('non-Promise', function (assert) {
    assert.expect(0);
    return {};
  });

  QUnit.test('fulfilled Promise', function (assert) {
    assert.expect(1);

    // Adds 1 assertion
    return createMockPromise(assert);
  });

  QUnit.test('fulfilled Promise and assert.async()', function (assert) {
    assert.expect(2);

    var done = assert.async();
    defer(function () {
      assert.true(true);
      done();
    });

    // Adds 1 assertion
    return createMockPromise(assert);
  });

  QUnit.test('rejected Promise with undefined value', function (assert) {
    assert.expect(2);

    this.pushFailure = assert.test.pushFailure;
    assert.test.pushFailure = function (message) {
      assert.strictEqual(
        message,
        'Promise rejected during "rejected Promise with undefined value": undefined'
      );
    };

    return createMockPromise(assert, true, undefined);
  });

  QUnit.test('rejected Promise with error value', function (assert) {
    assert.expect(2);

    this.pushFailure = assert.test.pushFailure;
    assert.test.pushFailure = function (message) {
      assert.strictEqual(
        message,
        'Promise rejected during "rejected Promise with error value": this is an error'
      );
    };

    return createMockPromise(assert, true, new Error('this is an error'));
  });

  QUnit.test('rejected Promise with string value', function (assert) {
    assert.expect(2);

    this.pushFailure = assert.test.pushFailure;
    assert.test.pushFailure = function (message) {
      assert.strictEqual(
        message,
        'Promise rejected during "rejected Promise with string value": this is an error'
      );
    };

    return createMockPromise(assert, true, 'this is an error');
  });

  QUnit.test('rejected Promise with async pause', function (assert) {
    assert.expect(2);

    assert.async(); // Important! We don't explicitly release the async pause

    this.pushFailure = assert.test.pushFailure;
    assert.test.pushFailure = function (message) {
      assert.strictEqual(
        message,
        'Promise rejected during "rejected Promise with async pause": this is an error'
      );
    };

    return createMockPromise(assert, true, 'this is an error');
  });

  QUnit.module('test.each()', {
    afterEach: function (assert) {
      // Restore
      if (this.pushFailure) {
        assert.test.pushFailure = this.pushFailure;
      }
    }
  });

  QUnit.test.each('fulfilled Promise', [1], function (assert, _data) {
    assert.expect(1);

    // Adds 1 assertion
    return createMockPromise(assert);
  });

  QUnit.test.each('rejected Promise with Error', [1], function (assert, _data) {
    assert.expect(2);

    this.pushFailure = assert.test.pushFailure;
    assert.test.pushFailure = function (message) {
      assert.strictEqual(
        message,
        'Promise rejected during "rejected Promise with Error [0]": this is an error'
      );
    };

    return createMockPromise(assert, true, new Error('this is an error'));
  });
});
