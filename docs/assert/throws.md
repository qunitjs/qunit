---
layout: default
title: assert.throws()
excerpt: Test if a callback throws an exception.
categories:
  - assert
redirect_from:
  - "/assert/raises/"
  - "/throws/"
version_added: "1.0"
---

`throws( blockFn[, expectedMatcher][, message ] )`<br>
`raises( blockFn[, expectedMatcher][, message ] )`

Test if a callback throws an exception, and optionally compare the thrown error.

| name               | description                          |
|--------------------|--------------------------------------|
| `blockFn` (function) | Function to execute                |
| `expectedMatcher`  | Expected error matcher               |
| `message` (string) | A short description of the assertion |


### Description

When testing code that is expected to throw an exception based on a specific set of circumstances, use `assert.throws()` to catch the error object for testing and comparison.

The `expectedMatcher` argument can be:

* An Error object
* An Error constructor to use ala `errorValue instanceof expectedMatcher`
* A RegExp that matches (or partially matches) the String representation
* A callback Function that must return `true` to pass the assertion check.

<p class="note" markdown="1">In very few environments, like Closure Compiler, `throws` may cause an error. There you can use `assert.raises`. It has the same signature and behaviour, just a different name.</p>

##### Changelog

| [QUnit 2.12](https://github.com/qunitjs/qunit/releases/tag/2.12.0) | Added support for arrow functions as `expectedMatcher` callback function.
| [QUnit 1.9](https://github.com/qunitjs/qunit/releases/tag/v1.9.0) | `assert.raises()` was renamed to `assert.throws()`.<br>The  `assert.raises()` method remains supported as an alias.

### Example

Assert the correct error message is received for a custom error object.

```js
QUnit.test( "throws", assert => {

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
    ( err ) => err.toString() === "some error description",
    "raised error instance satisfies the arrow function"
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
