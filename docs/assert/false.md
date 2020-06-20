---
layout: default
title: false
description: A boolean check. Passes if the first argument is false.
categories:
  - assert
---

## `false( state [, message ] )`

A boolean check, inverse of `true()` equivalent to Chais's `assert.isFalse()`, and JUnit's `assertFalse()`. Passes if the first argument is false.

| name               | description                          |
|--------------------|--------------------------------------|
| state              | Expression being tested              |
| message (string)   | A short description of the assertion |

### Description

`false()` requires just one argument. If the argument evaluates to false, the assertion passes; otherwise, it fails. If a second message argument is provided, it will be displayed in place of the result.

### Examples:

```js
QUnit.test( "false test", function( assert ) {
  assert.false( false, "false succeeds" );

  assert.false( "", "empty string fails" );
  assert.false( NaN, "NaN fails" );
  assert.false( null, "null fails" );
  assert.false( undefined, "undefined fails" );
  assert.false( true, "true fails" );
  assert.false( 1, "1 fails" );
  assert.false( "not-empty", "not-empty string fails" );
});
```
