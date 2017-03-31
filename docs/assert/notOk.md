---
layout: default
title: notOk
description: A boolean check. Passes if the first argument is falsy.
categories:
  - assert
---

## `notOk( state [, message ] )`

A boolean check, inverse of `ok()` and CommonJS's `assert.ok()`, and equivalent to JUnit's `assertFalse()`. Passes if the first argument is falsy.

| name               | description                          |
|--------------------|--------------------------------------|
| state              | Expression being tested              |
| message (string)   | A short description of the assertion |

### Description

`notOk()` requires just one argument. If the argument evaluates to false, the assertion passes; otherwise, it fails. If a second message argument is provided, it will be displayed in place of the result.

### Examples:

```js
QUnit.test( "notOk test", function( assert ) {
  assert.notOk( false, "false succeeds" );
  assert.notOk( "", "empty string succeeds" );
  assert.notOk( NaN, "NaN succeeds" );
  assert.notOk( null, "null succeeds" );
  assert.notOk( undefined, "undefined succeeds" );

  assert.notOk( true, "true fails" );
  assert.notOk( 1, "1 fails" );
  assert.notOk( "not-empty", "not-empty string fails" );
});
```
