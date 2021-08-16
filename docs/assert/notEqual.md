---
layout: page-api
title: assert.notEqual()
excerpt: A non-strict comparison, checking for inequality.
groups:
  - assert
redirect_from:
  - "/notEqual/"
version_added: "1.0.0"
---

`notEqual( actual, expected [, message ] )`

A non-strict comparison, checking for inequality.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | A short description of the assertion |

## Description

The `notEqual` assertion uses the simple inverted comparison operator (`!=`) to compare the actual and expected arguments. When they aren't equal, the assertion passes; otherwise, it fails. When it fails, both actual and expected values are displayed in the test result, in addition to a given message.

[`equal()`](./equal.md) can be used to test equality.

[`notStrictEqual()`](./notStrictEqual.md) can be used to test strict inequality.

## Examples

The simplest assertion example:

```js
QUnit.test( "good example", assert => {
  const result = "2";

  // succeeds, 1 and 2 are different.
  assert.notEqual( result, 1, "string and number" );
});

QUnit.test( "bad example", assert => {
  const result = "2";

  // fails, the number 2 and the string "2" are actually considered equal
  // when loosely compared. Use notStrictEqual instead to consider them different
  assert.notEqual( result, 2, "string and number" );
});
```
