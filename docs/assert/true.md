---
layout: default
title: true
description: A boolean check, equivalent to Chai's assert.isTrue() and JUnit's assertTrue(). Passes if the first argument is true.
categories:
  - assert
redirect_from:
  - "/true/"
---

## `true( state [, message ] )`

A boolean check, equivalent to Chai's assert.true() and JUnit's assertTrue(). Passes if the first argument is `true`.

| name               | description                          |
|--------------------|--------------------------------------|
| `state`            | Expression being tested              |
| `message` (string) | A short description of the assertion |

### Description

The most basic assertion in QUnit, `true()` requires just one argument. If the argument evaluates to true, the assertion passes; otherwise, it fails. If a second message argument is provided, it will be displayed in place of the result.

[`false()`](/assert/false) can be used to explicitly test for a false value.

### Examples

```js
QUnit.test( "true test", function( assert ) {
  assert.true( true, "true succeeds" );

  assert.true( "non-empty", "non-empty string fails" );
  assert.true( false, "false fails" );
  assert.true( 0, "0 fails" );
  assert.true( NaN, "NaN fails" );
  assert.true( "", "empty string fails" );
  assert.true( null, "null fails" );
  assert.true( undefined, "undefined fails" );
});
```

