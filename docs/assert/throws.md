---
layout: default
title: throws
description: Test if a callback throws an exception, and optionally compare the thrown error.
categories:
  - assert
---

## `throws( blockFn, expected [, message ] )`

Test if a callback throws an exception, and optionally compare the thrown error.

| name               | description                          |
|--------------------|--------------------------------------|
| `blockFn` (function) | Function to execute                |
| `expected`         | Expected Error                       |
| `message` (string) | A short description of the assertion |


### Description

When testing code that is expected to throw an exception based on a specific set of circumstances, use `assert.throws()` to catch the error object for testing and comparison.

The `expected` argument can be an Error Object (instance), an Error Function (constructor), a RegExp that matches (or partially matches) the String representation, or a callback Function that must return `true` to pass the assertion check.

> In very few environments, like Closure Compiler, `throws` is considered a reserved word and will cause an error. For that case, an alias is bundled called `raises`. It has the same signature and behaviour, just a different name.

### Example

Assert the correct error message is received for a custom error object.

```js
QUnit.test( "throws", function( assert ) {

  function CustomError( message ) {
    this.message = message;
  }

  CustomError.prototype.toString = function() {
    return this.message;
  };

  assert.throws(
    function() {
      throw "error"
    },
    "throws with just a message, not using the 'expected' argument"
  );

  assert.throws(
    function() {
      throw new CustomError("some error description");
    },
    /description/,
    "raised error message contains 'description'"
  );

  assert.throws(
    function() {
      throw new CustomError();
    },
    CustomError,
    "raised error is an instance of CustomError"
  );

  assert.throws(
    function() {
      throw new CustomError("some error description");
    },
    new CustomError("some error description"),
    "raised error instance matches the CustomError instance"
  );

  assert.throws(
    function() {
      throw new CustomError("some error description");
    },
    function( err ) {
      return err.toString() === "some error description";
    },
    "raised error instance satisfies the callback function"
  );
});
```
