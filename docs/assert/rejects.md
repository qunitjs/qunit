---
layout: default
title: assert.rejects()
excerpt: Test if the provided promise rejects.
categories:
  - assert
version_added: "2.5.0"
---

`rejects( promise[, expectedMatcher][, message ] )`

Test if the provided promise rejects, and optionally compare the rejection value.

| name | description |
|------|-------------|
| `promise` (thenable) | promise to test for rejection |
| `expectedMatcher` | Rejection value matcher |
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

### Examples

```js
QUnit.test( "rejects example", assert => {

  // simple check
  assert.rejects( Promise.reject( "some error" ) );

  // simple check
  assert.rejects(
    Promise.reject( "some error" ),
    "optional description here"
  );

  // match pattern on actual error
  assert.rejects(
    Promise.reject( new Error( "some error" ) ),
    /some error/,
    "optional description here"
  );

  // Using a custom error constructor
  function CustomError( message ) {
    this.message = message;
  }
  CustomError.prototype.toString = function() {
    return this.message;
  };

  // actual error is an instance of the expected constructor
  assert.rejects(
    Promise.reject( new CustomError( "some error" ) ),
    CustomError
  );

  // actual error has strictly equal `constructor`, `name` and `message` properties
  // of the expected error object
  assert.rejects(
    Promise.reject( new CustomError( "some error" ) ),
    new CustomError( "some error" )
  );

  // custom validation arrow function
  assert.rejects(
    Promise.reject( new CustomError( "some error" ) ),
    ( err ) => err.toString() === "some error"
  );

  // custom validation function
  assert.rejects(
    Promise.reject( new CustomError( "some error" ) ),
    function( err ) {
      return err.toString() === "some error";
    }
  );
});
```
