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
`rejects( promise, expected, message = "" )`<br>
`rejectionValue = await rejects( promise, message = "" )`

Test if the provided promise rejects, and optionally compare the rejection value.

| parameter | description |
|------|-------------|
| `promise` (thenable) | Promise to check for rejection |
| `expected` | Expected rejection or matcher |
| `message` (string) | Short description of the promise |

Use `assert.rejects()` to test async functions that should throw, and any other function call that should return a promise that will reject.

The optional `expected` parameter can be one of these types (see [§ Examples](#examples)):

* Error object, to strictly compare the `message` and `name` properties, and check that the rejection value is an instance of this object's constructor.
* RegExp, to match (or partially match) the string representation.
* Error constructor, to confirm that the rejection value is an instance of this constructor.
* Custom validation function, to write your own logic returning `true` or `false`.

The returned promise from `assert.rejects()` is resolved with the rejection value (since QUnit 2.26). This can be used instead of an `expected` argument, to run other assertions against your your rejection value, such as [assert.propEqual()](./propEqual.md).

## Changelog

| [QUnit 2.26](https://github.com/qunitjs/qunit/releases/tag/2.26.0) | Added the rejection value.
| [QUnit 2.5](https://github.com/qunitjs/qunit/releases/tag/2.5.0) | Introduced `assert.rejects()`.

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
  assert.true(await feedBaby('apple'));

  await assert.rejects(feedBaby('sprouts'));

  await assert.rejects(feedBaby('sprouts'), RangeError);

  assert.true(await feedBaby('cucumber'));
});
```

### Example: Matcher argument

```js
class CustomError {
  constructor (message, code = 500) {
    this.message = message;
    this.code = code;
  }

  getStatusCode () {
    return this.code;
  }
}

QUnit.test('rejects example', async function (assert) {
  // default check
  assert.rejects(Promise.reject('boo'));

  // default check
  assert.rejects(
    Promise.reject('boo'),
    'optional description here'
  );

  // Error object, evaluated as:
  // - `err instance of Error`
  // - strictly equal `err.message`
  // - strictly equal `err.name`
  assert.rejects(
    Promise.reject(new Error('boo')),
    new Error('boo')
  );

  // RegExp match against err.toString()
  assert.rejects(
    Promise.reject(new Error('My very specific error about something')),
    /about something/
  );

  assert.rejects(
    Promise.reject(new TypeError('Delta argument is required')),
    /TypeError: Delta argument/
  );

  // Error constructor, evaluated as `err instance of TypeError`
  assert.rejects(
    Promise.reject(new TypeError('Delta argument is required')),
    TypeError
  );

  // Error constructor: evaluated as `err instanceof CustomError`
  assert.rejects(
    Promise.reject(new CustomError('something')),
    CustomError
  );

  // Custom validation arrow function
  assert.rejects(
    Promise.reject(new CustomError('not found', 404)),
    (err) => err.getStatusCode() === 404
  );

  // Custom validation function
  assert.rejects(
    Promise.reject(new CustomError('not found', 404)),
    function (err) {
      return err.getStatusCode() === 404;
    }
  );

  // Custom validation via the return value
  const err = await assert.rejects(
    Promise.reject(new CustomError('not found', 404))
  );
  assert.true(err instanceof CustomError);
  assert.strictEqual(err.getStatusCode(), 404);
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

If you want to perform additional assertions after a failure, consider performing these directly in your test function, after `await assert.rejects()`:

```js
QUnit.test('example', async function (assert) {
  const p = feedMe();
  const e = await assert.rejects(p, RangeError);
  assert.deepEqual(e.somedata, { foo: 'bar' });
});
```
