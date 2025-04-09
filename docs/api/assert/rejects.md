---
layout: page-api
title: assert.rejects()
excerpt: Test if the provided promise rejects.
groups:
  - assert
  - async
redirect_from:
  - "/assert/rejects/"
version_added: "2.5.0"
---

`rejects( promise, message = "" )`<br>
`rejects( promise, expectedMatcher, message = "" )`

Test if the provided promise rejects, and optionally compare the rejection value.

| name | description |
|------|-------------|
| `promise` (thenable) | Promise to test for rejection |
| `expectedMatcher` | Rejection value matcher |
| `message` (string) | Short description of the assertion |

When testing code that is expected to return a rejected promise based on a
specific set of circumstances, use `assert.rejects()` for testing and
comparison.

The `expectedMatcher` argument can be:

* A function that returns `true` when the assertion should be considered passing.
* An Error object.
* A base constructor, evaluated as `rejectionValue instanceof expectedMatcher`.
* A RegExp that matches (or partially matches) `rejectionValue.toString()`.

Note: in order to avoid confusion between the `message` and the `expectedMatcher`, the `expectedMatcher` **can not** be a string.

## See also

* Use [`assert.throws()`](./throws.md) for synchronous errors.

## Examples

### Example: Catch async error

```js
async function feedBaby (food) {
  if (food === 'sprouts') {
    throw new RangeError('Do not like');
  }
  return true;
}

QUnit.test('example', async function (assert) {
  await assert.rejects(
    feedBaby('sprouts'),
    RangeError
  );
});
```

### Example: Matcher argument

```js
QUnit.test('rejects example', function (assert) {
  // simple check
  assert.rejects(Promise.reject('some error'));

  // simple check
  assert.rejects(
    Promise.reject('some error'),
    'optional description here'
  );

  // match pattern on actual error
  assert.rejects(
    Promise.reject(new Error('some error')),
    /some error/,
    'optional description here'
  );

  // Using a custom error constructor
  function CustomError (message) {
    this.message = message;
  }
  CustomError.prototype.toString = function () {
    return this.message;
  };

  // actual error is an instance of the expected constructor
  assert.rejects(
    Promise.reject(new CustomError('some error')),
    CustomError
  );

  // actual error has strictly equal `constructor`, `name` and `message` properties
  // of the expected error object
  assert.rejects(
    Promise.reject(new CustomError('some error')),
    new CustomError('some error')
  );

  // custom validation arrow function
  assert.rejects(
    Promise.reject(new CustomError('some error')),
    (err) => err.toString() === 'some error'
  );

  // custom validation function
  assert.rejects(
    Promise.reject(new CustomError('some error')),
    function (err) {
      return err.toString() === 'some error';
    }
  );
});
```

### Example: Await the assertion

When you pass a Promise (or async function call) to `assert.rejects()`, QUnit automatically tracks this as part of your test. This tracking is similar to what would happen if you manually passed [`assert.async()`](../async.md) to `promise.finally()`. This means the test is not complete until the passed Promise is also settled, and this means timeouts naturally apply as well.

However, if two parts of your test code or subject share state within a single test, you may want to await the assertion to prevent the rest of your test from running at the same time.

To make this easy, the `assert.rejects()` method itself can be awaited, which will wait for the given async function call or other Promise.

```js
QUnit.test('stateful example', async function (assert) {
  let value;

  async function feedMe () {
    await Promise.resolve();
    if (value === 1) {
      throw new Error('I want more');
    }
    throw new Error('Thank you');
  }

  value = 5;
  // if we don't await, then this test will fail,
  // because `value = 1` would run too soon.
  await assert.rejects(feedMe(), /Thank you/);

  value = 1;
  await assert.rejects(feedMe(), /I want more/);
});
```

### Example: Workarounds

Avoid using error handling callbacks, such as `Promise.catch` or `on('error')`, because:
* Your test is likely to silently pass even if the expected error *does not happen*, or if the callback is lost or otherwise not invoked for some reason.
* When an error happens, but not the error you expect, the actual value is not visible in your CI output.

```js
QUnit.test('BAD example', function (assert) {
  return feedBaby('sprouts')
    .catch((e) => {
      assert.true(e instanceof RangeError);
    });
});
```

Avoid manually tracking rejections with [`assert.async()`](./async.md), because:
* When you put assertions inside a callback, especially negative assertions, the test function is no longer in control over the assertions. This means the test now only works as intended if the callback is called exactly as it should. If the callback isn't called, the test may succeed or fail/timeout in away that are hard to diagnose.
* When a different error happens, the actual value is not visible in your CI output.
* This requires writing more boilerplate, which is easy to get wrong and ways that don't self-correct (i.e. pass even when it shouldn't).

```js
QUnit.test('BAD example', function (assert) {
  const done = assert.async();

  feedBaby('sprouts')
    .then(() => {
      assert.true(false, 'should have failed');
    })
    .catch((e) => {
      assert.true(e instanceof RangeError);
    })
    .finally(done);
});
```

If you want to perform additional assertions after a failure, consider performing these directly in your test function, after `assert.rejects()`:

```js
QUnit.test('example', async function (assert) {
  const p = feedMe();
  await assert.rejects(p, RangeError);

  try {
    await p;
  } catch (e) {
    assert.deepEqual(e.somedata, { foo: 'bar' });
  }
});
```
