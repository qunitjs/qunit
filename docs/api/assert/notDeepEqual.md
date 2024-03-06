---
layout: page-api
title: assert.notDeepEqual()
excerpt: An inverted deep equal comparison.
groups:
  - assert
redirect_from:
  - "/assert/notDeepEqual/"
  - "/notDeepEqual/"
version_added: "1.0.0"
---

`notDeepEqual( actual, expected, message = "" )`

An inverted deep equal comparison.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | Short description |

This assertion fails if the actual and expected values are recursively equal by strict comparison, considering both own and inherited properties.

The assertion passes if there are structural differences, type differences, or even a subtle difference in a particular property value.

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
