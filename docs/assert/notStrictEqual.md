---
layout: default
title: notStrictEqual
description: A strict comparison, checking for inequality.
categories:
  - assert
---

## `notStrictEqual( actual, expected [, message ] )`

A strict comparison, checking for inequality.

| name               | description                          |
|--------------------|--------------------------------------|
| `actual`           | Expression being tested              |
| `expected`         | Known comparison value               |
| `message` (string) | A short description of the assertion |

### Description

The `notStrictEqual` assertion uses the strict inverted comparison operator (`!==`) to compare the actual and expected arguments. When they aren't equal, the assertion passes; otherwise, it fails. When it fails, both actual and expected values are displayed in the test result, in addition to a given message.

[`equal()`](/assert/equal) can be used to test equality.

[`strictEqual()`](/assert/strictEqual) can be used to test strict equality.

### Examples

The simplest assertion example:

```js
QUnit.test( "a test", function( assert ) {
  assert.notStrictEqual( 1, "1", "String '1' and number 1 have the same value but not the same type" );
});
```
