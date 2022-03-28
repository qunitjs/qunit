---
layout: page-api
title: assert.notDeepEqual()
excerpt: An inverted deep recursive comparison.
groups:
  - assert
redirect_from:
  - "/notDeepEqual/"
version_added: "1.0.0"
---

`notDeepEqual( actual, expected, message = "" )`

An inverted deep recursive comparison, working on primitive types, arrays, objects, regular expressions, dates and functions.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | A short description of the assertion |

This is the inverse of [`assert.deepEqual()`](./deepEqual.md).

## Examples

Compare the value of two objects.

```js
QUnit.test('example', assert => {
  const result = { foo: 'yep' };

  // succeeds, objects are similar but have a different foo value.
  assert.notDeepEqual(result, { foo: 'nope' });
});
```
