---
layout: page-api
title: assert.deepEqual()
excerpt: A recursive and strict comparison.
groups:
  - assert
redirect_from:
  - "/assert/deepEqual/"
  - "/deepEqual/"
version_added: "1.0.0"
---

`deepEqual( actual, expected, message = "" )`

A recursive and strict comparison, considering all own and inherited properties.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | Short description of the actual expression |

This assertion compares the full objects as passed. For primitive values, a strict comparison is performed. For objects, the object identity is disregarded and instead a recursive comparison of all own and inherited properties is used. This means arrays, plain objects, and arbitrary class instance objects can all be compared in this way.

The deep comparison includes built-in support for Date objects, regular expressions (RegExp), NaN, as well as ES6 features such as Symbol, Set, and Map objects.

To assert strict equality on own properties only, refer to [`assert.propEqual()`](./propEqual.md) instead.

[`assert.notDeepEqual()`](./notDeepEqual.md) can be used to check for inequality instead.

## Examples

Validate the properties and values of a given object.

```js
QUnit.test('passing example', assert => {
  const result = { foo: 'bar' };

  assert.deepEqual(result, { foo: 'bar' });
});
```

```js
QUnit.test('failing example', assert => {
  const result = {
    a: 'Albert',
    b: 'Berta',
    num: 123
  };

  // fails because the number 123 is not strictly equal to the string "123".
  assert.deepEqual(result, {
    a: 'Albert',
    b: 'Berta',
    num: '123'
  });
});
```
