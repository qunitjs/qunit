function buildMockPromise (settledValue, shouldFulfill) {
  // Support IE 9: Promise not supported, test MUST NOT load polyfil globally.
  // Support SpiderMonkey: setTimeout is not supported, but native Promise is.
  var defer = typeof setTimeout !== 'undefined'
    // eslint-disable-next-line no-undef
    ? setTimeout
    : function (fn) {
      // eslint-disable-next-line no-undef, compat/compat
      Promise.resolve().then(fn);
    };

  var thenable = {
    then: function (fulfilledCallback, rejectedCallback) {
      defer(function () {
        return shouldFulfill
          ? fulfilledCallback.call(thenable, settledValue)
          : rejectedCallback.call(thenable, settledValue);
      });

      // returning another thenable for easy confirmation of return value
      return buildMockPromise('final promise', true);
    }
  };
  return thenable;
}

QUnit.module('assert');

QUnit.test('ok', function (assert) {
  assert.ok(true);
  assert.ok(1);
  assert.ok('1');
  assert.ok(Infinity);
  assert.ok({});
  assert.ok([]);

  assert.ok(true, 'with message');
});

QUnit.test('notOk', function (assert) {
  assert.notOk(false);
  assert.notOk(0);
  assert.notOk('');
  assert.notOk(null);
  assert.notOk(undefined);
  assert.notOk(NaN);

  assert.notOk(false, 'with message');
});

QUnit.test('true', function (assert) {
  function functionThatReturnsTrue () {
    return true;
  }
  assert.true(true);
  assert.true(functionThatReturnsTrue());
});

QUnit.test('false', function (assert) {
  function functionThatReturnsFalse () {
    return false;
  }
  assert.false(false);
  assert.false(functionThatReturnsFalse());
});

QUnit.test('equal', function (assert) {
  assert.equal(1, 1);
  assert.equal('foo', 'foo');
  assert.equal('foo', ['foo']);
  assert.equal('foo', { toString: function () { return 'foo'; } });
  assert.equal(0, [0]);
});

QUnit.test('notEqual', function (assert) {
  assert.notEqual(1, 2);
  assert.notEqual('foo', 'bar');
  assert.notEqual({}, {});
  assert.notEqual([], []);
});

QUnit.test('strictEqual', function (assert) {
  assert.strictEqual(1, 1);
  assert.strictEqual('foo', 'foo');
});

QUnit.test('notStrictEqual', function (assert) {
  assert.notStrictEqual(1, 2);
  assert.notStrictEqual('foo', 'bar');
  assert.notStrictEqual('foo', ['foo']);
  assert.notStrictEqual('1', 1);
  assert.notStrictEqual('foo', { toString: function () { return 'foo'; } });
});

QUnit.test('closeTo', function (assert) {
  assert.closeTo(1, 1, 0);
  assert.closeTo(1, 1, 0.1);

  assert.closeTo(7, 7.1, 0.1);
  assert.closeTo(7, 7.1, 0.2);

  assert.closeTo(2011, 2013, 2);

  assert.closeTo(0.1 + 0.2, 0.3, 0.001);
  assert.closeTo(20.13, 20.10, 0.05);

  assert.throws(function () {
    assert.closeTo(1, 1);
  }, TypeError, 'missing delta');

  assert.throws(function () {
    assert.closeTo(1, 1, false);
  }, TypeError, 'invalid delta');
});

QUnit.test('propEqual', function (assert) {
  function Foo (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  Foo.prototype.doA = function () {};
  Foo.prototype.bar = 'non-function';

  function Bar () {
  }
  Bar.prototype = Object.create(Foo.prototype);
  Bar.prototype.constructor = Bar;

  assert.propEqual(
    new Foo(1, '2', []),
    {
      x: 1,
      y: '2',
      z: []
    }
  );

  assert.notPropEqual(
    new Foo('1', 2, 3),
    {
      x: 1,
      y: '2',
      z: 3
    },
    'Primitive values are strictly compared'
  );

  assert.notPropEqual(
    new Foo(1, '2', []),
    {
      x: 1,
      y: '2',
      z: {}
    },
    'Array type is preserved'
  );

  assert.notPropEqual(
    new Foo(1, '2', {}),
    {
      x: 1,
      y: '2',
      z: []
    },
    'Empty array is not the same as empty object'
  );

  assert.propEqual(
    new Foo(1, '2', new Foo([3], new Bar(), null)),
    {
      x: 1,
      y: '2',
      z: {
        x: [3],
        y: {},
        z: null
      }
    },
    'Complex nesting of different types, inheritance and constructors'
  );
});

QUnit.test('propContains', function (assert) {
  function Foo (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  Foo.prototype.doA = function () {};
  Foo.prototype.bar = 'non-function';

  function Bar (x) {
    this.x = x;
  }
  Bar.prototype = Object.create(Foo.prototype);
  Bar.prototype.constructor = Bar;

  assert.propContains(
    { a: 0, b: 'something', c: true },
    { a: 0, b: 'something', c: true }
  );
  assert.propContains(
    { a: 0, b: 'something', c: true },
    { a: 0, c: true },
    'match object subset'
  );
  assert.propContains(
    ['a', 'b'],
    { 1: 'b' },
    'match array subset via plain object'
  );
  assert.propContains(
    [],
    {},
    'empty array contains empty object'
  );
  assert.propContains(
    {},
    [],
    'empty object contains empty array'
  );
  assert.propContains(
    new Foo(1, '2', []),
    new Foo(1, '2', []),
    'deeply equal class instances'
  );
  assert.propContains(
    new Foo(1, '2', []),
    {
      x: 1,
      y: '2',
      z: []
    },
    'match different constructor via plain object'
  );
  assert.propContains(
    new Foo(1, '2', []),
    {
      x: 1
    },
    'match different constructor subset via plain object'
  );
  assert.propContains(
    new Foo(1, '2', ['x']),
    new Foo(1, '2', { 0: 'x' }),
    'match nested array via plain object'
  );
  assert.propContains(
    new Foo(1, ['a', 'b'], new Foo(['c', 'd'], new Bar(), null)),
    {
      x: 1,
      y: ['a', 'b'],
      z: {
        x: { 1: 'd' }
      }
    },
    'match nested array subset via plain object'
  );
  assert.propContains(
    new Foo(1, '2'),
    new Bar(1),
    'match subset via different constructor'
  );
});

QUnit.test('notPropContains', function (assert) {
  function Foo (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  Foo.prototype.doA = function () {};
  Foo.prototype.bar = 'non-function';

  function Bar (x) {
    this.x = x;
  }
  Bar.prototype = Object.create(Foo.prototype);
  Bar.prototype.constructor = Bar;

  assert.notPropContains(
    { a: 0, b: 'something', c: true },
    { a: 0, b: 'different', c: true }
  );
  assert.notPropContains(
    { a: 0, b: 'something', c: true },
    { a: 0, c: false }
  );
  assert.notPropContains(
    { a: 0, b: 'something', c: true },
    { e: 'missing' }
  );
  assert.notPropContains(
    new Foo(1, '2', []),
    {
      x: 1,
      y: '2',
      z: [],
      e: 'missing'
    },
    'matching and missing properties'
  );
  assert.notPropContains(
    new Foo(1, '2', []),
    {
      e: 'missing'
    },
    'missing property'
  );
  assert.notPropContains(
    new Foo(1, [], new Foo([], new Bar(), 'something')),
    new Foo(1, [], new Foo([], new Bar(), 'different')),
    'difference in nested value'
  );
  assert.notPropContains(
    new Foo(1, '2', new Foo([3], new Bar(), null)),
    {
      x: 1,
      y: '2',
      z: {
        e: 'missing'
      }
    },
    'nested object with missing property'
  );
  assert.notPropContains(
    new Foo(1, '2'),
    new Bar(2),
    'different property value via different constructor'
  );
});

QUnit.test('throws', function (assert) {
  function CustomError (message) {
    this.message = message;
  }

  CustomError.prototype.toString = function () {
    return this.message;
  };

  assert.throws(
    function () {
      throw 'my error';
    }
  );

  assert.throws(
    function () {
      throw 'my error';
    },
    "simple string throw, no 'expected' value given"
  );

  assert.throws(function () {
    // eslint-disable-next-line qunit/no-throws-string
    assert.throws(
      undefined, // irrelevant - errors before even verifying this
      'expected is a string',
      'message is non-null'
    );
  }, /^Error: assert\.throws does not accept a string value for the expected argument/);

  // This test is for IE 7 and prior which does not properly
  // implement Error.prototype.toString
  assert.throws(
    function () {
      throw new Error('error message');
    },
    /error message/,
    'use regexp against instance of Error'
  );

  assert.throws(
    function () {
      throw new TypeError();
    },
    Error,
    'thrown TypeError without a message is an instance of Error'
  );

  assert.throws(
    function () {
      throw new TypeError();
    },
    TypeError,
    'thrown TypeError without a message is an instance of TypeError'
  );

  assert.throws(
    function () {
      throw new TypeError('error message');
    },
    Error,
    'thrown TypeError with a message is an instance of Error'
  );

  // This test is for IE 8 and prior which goes against the standards
  // by considering that the native Error constructors, such TypeError,
  // are also instances of the Error constructor. As such, the assertion
  // sometimes went down the wrong path.
  assert.throws(
    function () {
      throw new TypeError('error message');
    },
    TypeError,
    'thrown TypeError with a message is an instance of TypeError'
  );

  assert.throws(
    function () {
      throw new CustomError('some error description');
    },
    CustomError,
    'thrown error is an instance of CustomError'
  );

  assert.throws(
    function () {
      throw new Error('some error description');
    },
    /description/,
    'use a regex to match against the stringified error'
  );

  assert.throws(
    function () {
      throw new Error('foo');
    },
    new Error('foo'),
    'thrown error object is similar to the expected Error object'
  );

  assert.throws(
    function () {
      throw new CustomError('some error description');
    },
    new CustomError('some error description'),
    'thrown error object is similar to the expected CustomError object'
  );

  assert.throws(
    function () {
      throw {
        name: 'SomeName',
        message: 'some message'
      };
    },
    { name: 'SomeName', message: 'some message' },
    'thrown object is similar to the expected plain object'
  );

  assert.throws(
    function () {
      throw {
        name: 'SomeName',
        message: 'some message'
      };
    },
    /^SomeName: some message$/,
    'thrown object matches formatted error message'
  );

  assert.throws(
    function () {
      throw {
        name: true,
        message: 'some message'
      };
    },
    /^true: some message$/,
    'formatted string for Error object with non-string name property'
  );

  assert.throws(
    function () {
      throw {};
    },
    /^Error$/,
    'thrown object with no name or message matches formatted error message'
  );

  assert.throws(
    function () {
      throw {
        name: 'SomeName'
      };
    },
    /^SomeName$/,
    'thrown object with name but no message matches formatted error message'
  );

  assert.throws(
    function () {
      throw {
        message: 'some message'
      };
    },
    /^Error: some message$/,
    'thrown object with message but no name matches formatted error message'
  );

  assert.throws(
    function () {
      throw new CustomError('some error description');
    },
    function (err) {
      return err instanceof CustomError && /description/.test(err);
    },
    'custom validation function'
  );

  this.CustomError = CustomError;

  assert.throws(
    function () {
      throw new this.CustomError('some error description');
    },
    /description/,
    "throw error from property of 'this' context"
  );

  // the following are nested assertions, validating that it
  // initially throws due to an invalid expected value

  assert.throws(
    function () {
      assert.throws(
        undefined, // irrelevant
        2
      );
    },
    /^Error: Invalid expected value type \(number\) provided to assert\.throws\.$/,
    'throws errors when provided a number'
  );

  // note that "falsey" values are actually ok
  assert.throws(
    function () {
      throw new this.CustomError('some error description');
    },
    0,
    'throws passes when expected is falsey (0)'
  );

  assert.throws(
    function () {
      assert.throws(
        undefined, // irrelevant
        true
      );
    },
    /^Error: Invalid expected value type \(boolean\) provided to assert\.throws\.$/,
    'throws errors when provided a boolean'
  );

  // note that "falsey" values are actually ok
  assert.throws(
    function () {
      throw new this.CustomError('some error description');
    },
    false,
    'throws passes when expected is falsey (false)'
  );

  assert.throws(
    function () {
      assert.throws(
        undefined, // irrelevant
        []
      );
    },
    /^Error: Invalid expected value type \(array\) provided to assert\.throws\.$/,
    'throws errors when provided an array'
  );
});

QUnit.test('raises', function (assert) {
  assert.strictEqual(assert.raises, assert.throws, 'alias for throws');
});

QUnit.test('rejects', function (assert) {
  function CustomError (message) {
    this.message = message;
  }

  CustomError.prototype.toString = function () {
    return this.message;
  };

  var rejectsReturnValue = assert.rejects(
    buildMockPromise('my error')
  );

  assert.equal(
    typeof rejectsReturnValue.then,
    'function',
    'rejects returns a thennable'
  );

  assert.rejects(
    buildMockPromise('my error'),
    "simple string rejection, no 'expected' value given"
  );

  // This test is for IE 7 and prior which does not properly
  // implement Error.prototype.toString
  assert.rejects(
    buildMockPromise(new Error('error message')),
    /error message/,
    'use regexp against instance of Error'
  );

  assert.rejects(
    buildMockPromise(new TypeError()),
    Error,
    'thrown TypeError without a message is an instance of Error'
  );

  assert.rejects(
    buildMockPromise(new TypeError()),
    TypeError,
    'thrown TypeError without a message is an instance of TypeError'
  );

  assert.rejects(
    buildMockPromise(new TypeError('error message')),
    Error,
    'thrown TypeError with a message is an instance of Error'
  );

  // This test is for IE 8 and prior which goes against the standards
  // by considering that the native Error constructors, such TypeError,
  // are also instances of the Error constructor. As such, the assertion
  // sometimes went down the wrong path.
  assert.rejects(
    buildMockPromise(new TypeError('error message')),
    TypeError,
    'thrown TypeError with a message is an instance of TypeError'
  );

  assert.rejects(
    buildMockPromise(new CustomError('some error description')),
    CustomError,
    'thrown error is an instance of CustomError'
  );

  assert.rejects(
    buildMockPromise(new Error('some error description')),
    /description/,
    'use a regex to match against the stringified error'
  );

  assert.rejects(
    buildMockPromise(new Error('foo')),
    new Error('foo'),
    'thrown error object is similar to the expected Error object'
  );

  assert.rejects(
    buildMockPromise(new CustomError('some error description')),
    new CustomError('some error description'),
    'thrown error object is similar to the expected CustomError object'
  );

  assert.rejects(
    buildMockPromise({
      name: 'SomeName',
      message: 'some message'
    }),
    { name: 'SomeName', message: 'some message' },
    'thrown object is similar to the expected plain object'
  );

  assert.rejects(
    buildMockPromise(new CustomError('some error description')),
    function (err) {
      return err instanceof CustomError && /description/.test(err);
    },
    'custom validation function'
  );

  this.CustomError = CustomError;

  assert.rejects(
    buildMockPromise(new this.CustomError('some error description')),
    /description/,
    "throw error from property of 'this' context"
  );

  assert.rejects(
    buildMockPromise(undefined),
    'reject with undefined against no matcher'
  );

  // the following are nested assertions, validating that it
  // initially throws due to an invalid expected value

  assert.throws(
    function () {
      assert.rejects(
        undefined, // irrelevant
        2
      );
    },
    /^Error: Invalid expected value type \(number\) provided to assert\.rejects\.$/,
    'rejects errors when provided a number'
  );

  // note that "falsey" values are actually ok
  assert.rejects(
    buildMockPromise(undefined),
    0,
    'rejects passes when expected is falsey (0)'
  );

  assert.throws(
    function () {
      assert.rejects(
        undefined, // irrelevant
        true
      );
    },
    /^Error: Invalid expected value type \(boolean\) provided to assert\.rejects\.$/,
    'rejects errors when provided a boolean'
  );

  // note that "falsey" values are actually ok
  assert.rejects(
    buildMockPromise(undefined),
    false,
    'rejects passes when expected is falsey (false)'
  );

  assert.throws(
    function () {
      assert.rejects(
        undefined, // irrelevant
        []
      );
    },
    /^Error: Invalid expected value type \(array\) provided to assert\.rejects\.$/,
    'rejects errors when provided an array'
  );

  assert.throws(
    function () {
      assert.rejects(
        undefined, // irrelevant
        'expected is a string',
        'message is non-null'
      );
    },
    /^Error: assert\.rejects does not accept a string value for the expected argument/,
    'rejects errors when provided a string'
  );

  // should return a thenable
  var returnValue = assert.rejects(
    buildMockPromise(undefined)
  );
  assert.strictEqual(typeof returnValue, 'object');
  assert.strictEqual(typeof returnValue.then, 'function');
});

if (typeof window !== 'undefined') {
  /* global window */
  QUnit.test('throws [global eval]', function (assert) {
    assert.throws(
      function () {
        var execScript = window.execScript || function (data) {
          // eslint-disable-next-line no-eval, no-useless-call
          window.eval.call(window, data);
        };
        // eslint-disable-next-line no-implied-eval
        execScript("throw 'error';");
      },
      'globally-executed errors caught'
    );
  });
}

QUnit.module('assert - failing assertions', {
  beforeEach: function (assert) {
    var originalPushResult = assert.pushResult;
    assert.pushResult = function (resultInfo) {
      // Inverts the result so we can test failing assertions
      resultInfo.result = !resultInfo.result;
      originalPushResult.call(this, resultInfo);
    };
  }
});

QUnit.test('ok', function (assert) {
  assert.ok(false);
  assert.ok(0);
  assert.ok('');
  assert.ok(null);
  assert.ok(undefined);
  assert.ok(NaN);
});

QUnit.test('notOk', function (assert) {
  assert.notOk(true);
  assert.notOk(1);
  assert.notOk('1');
  assert.notOk(Infinity);
  assert.notOk({});
  assert.notOk([]);
});

QUnit.test('equal', function (assert) {
  assert.equal(1, 2);
  assert.equal('foo', 'bar');
  assert.equal({}, {});
  assert.equal([], []);
});

QUnit.test('notEqual', function (assert) {
  assert.notEqual(1, 1);
  assert.notEqual('foo', 'foo');
  assert.notEqual('foo', ['foo']);
  assert.notEqual('foo', { toString: function () { return 'foo'; } });
  assert.notEqual(0, [0]);
});

QUnit.test('strictEqual', function (assert) {
  assert.strictEqual(1, 2);
  assert.strictEqual('foo', 'bar');
  assert.strictEqual('foo', ['foo']);
  assert.strictEqual('1', 1);
  assert.strictEqual('foo', { toString: function () { return 'foo'; } });
});

QUnit.test('notStrictEqual', function (assert) {
  assert.notStrictEqual(1, 1);
  assert.notStrictEqual('foo', 'foo');
});

QUnit.test('deepEqual', function (assert) {
  assert.deepEqual(['foo', 'bar'], ['foo']);
});

QUnit.test('notDeepEqual', function (assert) {
  assert.notDeepEqual(['foo', 'bar'], ['foo', 'bar']);
});

QUnit.test('propEqual', function (assert) {
  function Foo (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  Foo.prototype.baz = function () {};
  Foo.prototype.bar = 'prototype';

  assert.propEqual(
    new Foo('1', 2, 3),
    {
      x: 1,
      y: '2',
      z: 3
    }
  );
});

QUnit.test('notPropEqual', function (assert) {
  function Foo (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  Foo.prototype.baz = function () {};
  Foo.prototype.bar = 'prototype';

  assert.notPropEqual(
    new Foo(1, '2', []),
    {
      x: 1,
      y: '2',
      z: []
    }
  );
});

QUnit.test('throws', function (assert) {
  assert.throws(
    function () {

    },
    'throws fails without a thrown error'
  );

  assert.throws(
    function () {
      throw 'foo';
    },
    /bar/,
    "throws fail when regexp doesn't match the error message"
  );

  assert.throws(
    function () {
      throw 'foo';
    },
    function () {
      return false;
    },
    'throws fail when expected function returns false'
  );

  // non-function actual values
  assert.throws(
    undefined,
    'throws fails when actual value is undefined');

  assert.throws(
    2,
    'throws fails when actual value is a number');

  assert.throws(
    [],
    'throws fails when actual value is an array');

  assert.throws(
    'notafunction',
    'throws fails when actual value is a string');

  assert.throws(
    {},
    'throws fails when actual value is an object');
});

QUnit.test('rejects', function (assert) {
  assert.rejects(
    buildMockPromise('some random value', /* shouldResolve */ true),
    'fails when the provided promise fulfills'
  );

  assert.rejects(
    buildMockPromise('foo'),
    /bar/,
    'rejects fails when regexp does not match'
  );

  assert.rejects(
    buildMockPromise(new Error('foo')),
    function RandomConstructor () { },
    'rejects fails when rejected value is not an instance of the provided constructor'
  );

  function SomeConstructor () { }

  assert.rejects(
    buildMockPromise(new SomeConstructor()),
    function OtherRandomConstructor () { },
    'rejects fails when rejected value is not an instance of the provided constructor'
  );

  assert.rejects(
    buildMockPromise('some value'),
    function () { return false; },
    'rejects fails when the expected function returns false'
  );

  assert.rejects(null);
});
