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

## Examples

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

The `assert.rejects()` method returns a `Promise` which handles the (often asynchronous) resolution and rejection logic for test successes and failures. It is not required to `await` the returned value, since QUnit internally handles the async control for you and waits for a settled state. However, if your test code requires a consistent and more isolated state between `rejects` calls, then this should be explicitly awaited to hold back the next statements.

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
  // because `value = 1` would run too soon
  await assert.rejects(feedMe(), /Thank you/);

  value = 1;
  await assert.rejects(feedMe(), /I want more/);
});
```
