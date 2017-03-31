---
layout: default
title: ok
description: A boolean check, equivalent to CommonJS's assert.ok() and JUnit's assertTrue(). Passes if the first argument is truthy.
categories:
  - assert
---

## `ok( state [, message ] )`

A boolean check, equivalent to CommonJS's assert.ok() and JUnit's assertTrue(). Passes if the first argument is truthy.

| name               | description                          |
|--------------------|--------------------------------------|
| `state`            | Expression being tested              |
| `message` (string) | A short description of the assertion |

### Description

The most basic assertion in QUnit, `ok()` requires just one argument. If the argument evaluates to true, the assertion passes; otherwise, it fails. If a second message argument is provided, it will be displayed in place of the result.

```js
QUnit.test( "ok test", function( assert ) {
  assert.ok( true, "true succeeds" );
  assert.ok( "non-empty", "non-empty string succeeds" );

  assert.ok( false, "false fails" );
  assert.ok( 0, "0 fails" );
  assert.ok( NaN, "NaN fails" );
  assert.ok( "", "empty string fails" );
  assert.ok( null, "null fails" );
  assert.ok( undefined, "undefined fails" );
});
```
