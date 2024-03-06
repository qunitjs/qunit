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
`throws( blockFn, expectedMatcher, message = "" )`

Test if a callback throws an exception, and optionally compare the thrown error.

| name | description |
|------|-------------|
| `blockFn` (function) | Function to execute |
| `expectedMatcher` | Expected error matcher |
| `message` (string) | Short description of the assertion |

When testing code that is expected to throw an exception based on a specific set of circumstances, use `assert.throws()` to catch the error object for testing and comparison.

The `expectedMatcher` argument can be:

* An Error object.
* An Error constructor to use ala `errorValue instanceof expectedMatcher`.
* A RegExp that matches (or partially matches) the string representation.
* A callback Function that must return `true` to pass the assertion check.

<p class="note" markdown="1">In very few environments, like Closure Compiler, `throws` may cause an error. There you can use `assert.raises()`. It has the same signature and behaviour, just a different name.</p>

## Changelog

| [QUnit 2.12](https://github.com/qunitjs/qunit/releases/tag/2.12.0) | Added support for arrow functions as `expectedMatcher` callback function.
| [QUnit 1.9](https://github.com/qunitjs/qunit/releases/tag/v1.9.0) | `assert.raises()` was renamed to `assert.throws()`.<br>The `assert.raises()` method remains supported as an alias.

## Examples

```js
QUnit.test('throws example', assert => {
  // simple check
  assert.throws(function () {
    throw new Error('boo');
  });

  // simple check
  assert.throws(
    function () {
      throw new Error('boo');
    },
    'optional description here'
  );

  // match pattern on actual error
  assert.throws(
    function () {
      throw new Error('some error');
    },
    /some error/,
    'optional description here'
  );

  // using a custom error constructor
  function CustomError (message) {
    this.message = message;
  }
  CustomError.prototype.toString = function () {
    return this.message;
  };

  // actual error is an instance of the expected constructor
  assert.throws(
    function () {
      throw new CustomError('some error');
    },
    CustomError
  );

  // actual error has strictly equal `constructor`, `name` and `message` properties
  // of the expected error object
  assert.throws(
    function () {
      throw new CustomError('some error');
    },
    new CustomError('some error')
  );

  // custom validation arrow function
  assert.throws(
    function () {
      throw new CustomError('some error');
    },
    (err) => err.toString() === 'some error'
  );

  // custom validation function
  assert.throws(
    function () {
      throw new CustomError('some error');
    },
    function (err) {
      return err.toString() === 'some error';
    }
  );
});
```
