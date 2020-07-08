---
layout: default
title: assert.false()
description: A strict boolean false comparison.
categories:
  - assert
---

`false( actual [, message ] )`

A boolean check, equivalent to JUnit's `assertFalse()`. Passes if the first argument is false.

| name               | description                          |
|--------------------|--------------------------------------|
| `actual`           | Expression being tested              |
| `message` (string) | A short description of the assertion |

### Description

`false()` requires just one argument. If the argument evaluates to false, the assertion passes; otherwise, it fails.

[`true()`](/assert/true) can be used to explicitly test for a true value.

### Examples

```js
QUnit.test( "false test", function( assert ) {
  assert.false( false, "false succeeds" );

  assert.false( "not-empty", "not-empty string fails" );
  assert.false( "", "empty string fails" );
  assert.false( 0, "0 fails" );
  assert.false( true, "true fails" );
  assert.false( NaN, "NaN fails" );
  assert.false( null, "null fails" );
  assert.false( undefined, "undefined fails" );
});
```
