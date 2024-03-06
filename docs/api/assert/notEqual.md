---
layout: page-api
title: assert.notEqual()
excerpt: A loose inequality comparison.
groups:
  - assert
redirect_from:
  - "/assert/notEqual/"
  - "/notEqual/"
version_added: "1.0.0"
---

`notEqual( actual, expected, message = "" )`

A loose inequality comparison, checking for non-strict differences between two values.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | Short description |

The `notEqual` assertion uses the simple inverted comparison operator (`!=`) to compare the actual and expected values. When they aren't equal, the assertion passes; otherwise, it fails. When it fails, both actual and expected values are displayed in the test result, in addition to a given message.

[`assert.equal()`](./equal.md) can be used to test equality.

[`assert.notStrictEqual()`](./notStrictEqual.md) can be used to test strict inequality.

## Examples

The simplest assertion example:

```js
QUnit.test('passing example', assert => {
  const result = '2';

  // succeeds, 1 and 2 are different.
  assert.notEqual(result, 1);
});

QUnit.test('failing example', assert => {
  const result = '2';

  // fails, the number 2 and the string "2" are considered equal when
  // compared loosely. Use `assert.notStrictEqual` to consider them different.
  assert.notEqual(result, 2);
});
```
