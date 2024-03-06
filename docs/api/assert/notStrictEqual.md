---
layout: page-api
title: assert.notStrictEqual()
excerpt: A strict comparison, checking for inequality.
groups:
  - assert
redirect_from:
  - "/assert/notStrictEqual/"
  - "/notStrictEqual/"
version_added: "1.0.0"
---

`notStrictEqual( actual, expected, message = "" )`

A strict comparison, checking for inequality.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | Short description |

The `notStrictEqual` assertion uses the strict inverted comparison operator (`!==`) to compare the actual and expected arguments. When they aren't equal, the assertion passes; otherwise, it fails. When it fails, both actual and expected values are displayed in the test result, in addition to a given message.

[`assert.equal()`](./equal.md) can be used to test equality.

[`assert.strictEqual()`](./strictEqual.md) can be used to test strict equality.

## Examples

```js
QUnit.test('example', assert => {
  const result = '2';

  // succeeds, while the number 2 and string 2 are similar, they are strictly different.
  assert.notStrictEqual(result, 2);
});
```
