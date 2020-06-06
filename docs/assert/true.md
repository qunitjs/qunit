---
layout: default
title: true
description: A strict boolean true comparison.
categories:
  - assert
---

## `true( actual [, message ] )`

A boolean check, equivalent to JUnit's `assertTrue()`. Passes if the first argument is `true`.

| name               | description                          |
|--------------------|--------------------------------------|
| `actual`           | Expression being tested              |
| `message` (string) | A short description of the assertion |

### Description

`true()` requires just one argument. If the argument evaluates to true, the assertion passes; otherwise, it fails.

[`false()`](/assert/false) can be used to explicitly test for a false value.

### Examples

```js
QUnit.test( "true test", function( assert ) {
  assert.true( true, "true succeeds" );

  assert.true( "non-empty", "non-empty string fails" );
  assert.true( "", "empty string fails" );
  assert.true( 1, "1 fails" );
  assert.true( false, "false fails" );
  assert.true( NaN, "NaN fails" );
  assert.true( null, "null fails" );
  assert.true( undefined, "undefined fails" );
});
```

