---
layout: page-api
title: assert.deepEqual()
excerpt: A deep recursive strict comparison.
groups:
  - assert
redirect_from:
  - "/deepEqual/"
version_added: "1.0.0"
---

`deepEqual( actual, expected [, message ] )`

A deep recursive strict comparison, working on primitive types, arrays, objects, regular expressions, dates and functions considering all own and inherited properties.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | A short description of the assertion |

## Description

The `deepEqual()` assertion can be used just like `equal()` when comparing the value of objects, such that `{ key: value }` is equal to `{ key: value }`. For non-scalar values, identity will be disregarded by `deepEqual`.

[`notDeepEqual()`](./notDeepEqual.md) can be used to explicitly test deep, strict inequality.

[`propEqual()`](./propEqual.md) can be used to explicitly test deep, strict equality but only considering own properties. `deepEqual()` compares all inherited properties.

## Examples

Validate the properties and values of a given object.

```js
QUnit.test( "good example", assert => {
  const result = { foo: "bar" };

  assert.deepEqual( result, { foo: "bar" }, "result object" );
});
```

```js
QUnit.test( "bad example", assert => {
  const result = {
    a: "Albert",
    b: "Berta",
    num: 123
  };

  // fails because the number 123 is not strictly equal to the string "123".
  assert.deepEqual( result, {
    a: "Albert",
    b: "Berta",
    num: "123"
  } );
} );
```
