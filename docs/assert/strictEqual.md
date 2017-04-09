---
layout: default
title: strictEqual
description: A strict type and value comparison.
categories:
  - assert
---

## `strictEqual( actual, expected [, message ] )`

A strict type and value comparison.

| name               | description                          |
|--------------------|--------------------------------------|
| `actual`           | Expression being tested              |
| `expected`         | Known comparison value               |
| `message` (string) | A short description of the assertion |

### Description

The `strictEqual()` assertion provides the most rigid comparison of type and value with the strict equality operator (`===`).

[`equal()`](/assert/equal) can be used to test non-strict equality.

[`notStrictEqual()`](/assert/notStrictEqual) can be used to explicitly test strict inequality.

### Example

Compare the value of two primitives, having the same value and type.

```js
QUnit.test( "strictEqual test", function( assert ) {
  assert.strictEqual( 1, 1, "1 and 1 have the same value and type" );
});
```
