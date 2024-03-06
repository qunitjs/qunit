---
layout: page-api
title: assert.strictEqual()
excerpt: A strict type and value comparison.
groups:
  - assert
redirect_from:
  - "/same/"
  - "/strictEqual/"
  - "/assert/same/"
  - "/assert/strictEqual/"
version_added: "1.0.0"
---

`strictEqual( actual, expected, message = "" )`

A strict type and value comparison.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | Short description of the actual expression |

The `strictEqual()` assertion provides the most rigid comparison of type and value with the strict equality operator (`===`).

[`assert.equal()`](./equal.md) can be used to test non-strict equality.

[`assert.notStrictEqual()`](./notStrictEqual.md) can be used to explicitly test strict inequality.

## Changelog

* Prior to QUnit 1.1, this method was known as `assert.same()`.<br>The alias was removed in QUnit 1.3.

## Examples

Compare the value of two primitives, having the same value and type.

```js
QUnit.test('strictEqual example', assert => {
  const result = 2;

  assert.strictEqual(result, 2);
});
```
