---
layout: page-api
title: assert.throws()
excerpt: Test if a callback throws an exception.
groups:
  - assert
redirect_from:
  - "/assert/raises/"
  - "/assert/throws/"
  - "/throws/"
version_added: "1.0.0"
---

`throws( blockFn, message = "" )`<br>
`throws( blockFn, expected, message = "" )`<br>
`thrownValue = throws( blockFn, message = "" )`

Test if a callback throws an exception, and optionally compare the thrown error.

| parameter | description |
|------|-------------|
| `blockFn` (function) | Function to execute |
| `expected` | Expected error or matcher |
| `message` (string) | Short description of the function |

Use `assert.throws()` when testing code that should throw an exception, to catch the error object and optionally match it against an expected error.

By default, `assert.throws()` passes if anything is thrown by the callback, and fails if the function runs to completion without throwing.

The optional `expected` parameter can be one of these types (see [§ Examples](#examples)):

* Error object, to strictly compare the `message` and `name` properties, and check that the thrown value is an instance of this object's constructor.
* RegExp, to match (or partially match) the string representation.
* Error constructor, to confirm that the thrown value is an instance of this constructor.
* Custom validation function, to write your own logic returning `true` or `false`.

`assert.throws()` returns the caught value back to your test (since QUnit 2.26). This can be used instead of an `expected` argument, to run other assertions against your caught value, such as [assert.propEqual()](./propEqual.md).

<p class="note" markdown="1">If you need to comply with classic ES3 syntax, such as in early versions of Closure Compiler, you can use **`assert.raises()`**, which is an alias for `assert.throws()` with the same signature and behaviour.</p>

## Changelog

| [QUnit 2.26](https://github.com/qunitjs/qunit/releases/tag/2.26.0) | Added the return value.
| [QUnit 2.12](https://github.com/qunitjs/qunit/releases/tag/2.12.0) | Added support for arrow functions as `expectedMatcher` callback function.
| [QUnit 1.9](https://github.com/qunitjs/qunit/releases/tag/v1.9.0) | `assert.raises()` was renamed to `assert.throws()`.<br>The `assert.raises()` method remains supported as an alias.

## See also

* Use [`assert.rejects()`](./rejects.md) for asynchronous errors.

## Examples

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

QUnit.test('throws example', function (assert) {
  // default check
  assert.throws(function () {
    throw new Error('boo');
  });

  // default check
  assert.throws(
    function () {
      throw new Error('boo');
    },
    'optional message here'
  );

  // Error object, evaluated as:
  // - `err instance of Error`
  // - strictly equal `err.message`
  // - strictly equal `err.name`
  assert.throws(
    function () {
      throw new Error('boo');
    },
    new Error('boo')
  );

  // RegExp match against err.toString()
  assert.throws(
    function () {
      throw new Error('My very specific error about something');
    },
    /about something/
  );

  assert.throws(
    function () {
      throw new TypeError('Delta argument is required');
    },
    /TypeError: Delta argument/
  );

  // Error constructor, evaluated as `err instance of TypeError`
  assert.throws(
    function () {
      throw new TypeError('Delta argument is required');
    },
    TypeError
  );

  // Error constructor: evaluated as `err instanceof CustomError`
  assert.throws(
    function () {
      throw new CustomError('something');
    },
    CustomError
  );

  // Custom validation arrow function
  assert.throws(
    function () {
      throw new CustomError('not found', 404);
    },
    (err) => err.getStatusCode() === 404
  );

  // Custom validation function
  assert.throws(
    function () {
      throw new CustomError('not found', 404);
    },
    function (err) {
      return err.getStatusCode() === 404;
    }
  );

  // Custom validation via the return value
  const err = assert.throws(function () {
    throw new CustomError('not found', 404);
  });
  assert.true(err instanceof CustomError);
  assert.strictEqual(err.getStatusCode(), 404);
});
```
