---
layout: default
title: rejects
description: Test if the provided promise rejects, and optionally compare the rejection value.
categories:
  - assert
---

## `rejects( promise[, expectedMatcher][, message ] )`

Test if the provided promise rejects, and optionally compare the rejection value.

| name               | description                          |
|--------------------|--------------------------------------|
| `promise` (thenable) | promise to test for rejection      |
| `expectedMatcher`  | Rejection value matcher              |
| `message` (string) | A short description of the assertion |


### Description

When testing code that is expected to return a rejected promise based on a
specific set of circumstances, use `assert.rejects()` for testing and
comparison.

The `expectedMatcher` argument can be:

* A function that returns `true` when the assertion should be considered passing.
* An Error object
* A base constructor to use ala `rejectionValue instanceof expectedMatcher`
* A RegExp that matches (or partially matches) `rejectionValue.toString()`

Note: in order to avoid confusion between the `message` and the `expectedMatcher`, the `expectedMatcher` **can not** be a string.

### Example

Assert the correct error message is received for a custom error object.

```js
QUnit.test( "rejects", function( assert ) {

  assert.rejects(Promise.reject("some error description"));

  assert.rejects(
    Promise.reject(new Error("some error description")),
    "rejects with just a message, not using the 'expectedMatcher' argument"
  );

  assert.rejects(
    Promise.reject(new Error("some error description")),
    /description/,
    "`rejectionValue.toString()` contains `description`"
  );

  // Using a custom error like object
  function CustomError( message ) {
    this.message = message;
  }

  CustomError.prototype.toString = function() {
    return this.message;
  };

  assert.rejects(
    Promise.reject(new CustomError()),
    CustomError,
    "raised error is an instance of CustomError"
  );

  assert.rejects(
    Promise.reject(new CustomError("some error description")),
    new CustomError("some error description"),
    "raised error instance matches the CustomError instance"
  );

  assert.rejects(
    Promise.reject(new CustomError("some error description")),
    function( err ) {
      return err.toString() === "some error description";
    },
    "raised error instance satisfies the callback function"
  );
});
```
