---
layout: default
title: equal
description: A non-strict comparison.
categories:
  - assert
---

## `equal( actual, expected [, message ] )`

A non-strict comparison, roughly equivalent to JUnit's `assertEquals`.

| name               | description                          |
|--------------------|--------------------------------------|
| `actual`           | Expression being tested              |
| `expected`         | Known comparison value               |
| `message` (string) | A short description of the assertion |

### Description

The `equal` assertion uses the simple comparison operator (`==`) to compare the actual and expected arguments. When they are equal, the assertion passes; otherwise, it fails. When it fails, both actual and expected values are displayed in the test result, in addition to a given message.

[`notEqual()`](/assert/notEqual) can be used to explicitly test inequality.

[`strictEqual()`](/assert/strictEqual) can be used to test strict equality.

### Examples

The simplest assertion example:

```js
QUnit.test( "a test", function( assert ) {
  assert.equal( 1, "1", "String '1' and number 1 have the same value" );
});
```

A slightly more thorough set of assertions:

```js
QUnit.test( "equal test", function( assert ) {
  assert.equal( 0, 0, "Zero, Zero; equal succeeds" );
  assert.equal( "", 0, "Empty, Zero; equal succeeds" );
  assert.equal( "", "", "Empty, Empty; equal succeeds" );

  assert.equal( "three", 3, "Three, 3; equal fails" );
  assert.equal( null, false, "null, false; equal fails" );
});
```
