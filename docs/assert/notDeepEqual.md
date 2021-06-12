---
layout: default
title: assert.notDeepEqual()
excerpt: An inverted deep recursive comparison.
categories:
  - assert
redirect_from:
  - "/notDeepEqual/"
version_added: "1.0.0"
---

`notDeepEqual( actual, expected [, message ] )`

An inverted deep recursive comparison, working on primitive types, arrays, objects, regular expressions, dates and functions.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | A short description of the assertion |

### Description

The `notDeepEqual()` assertion can be used just like `equal()` when comparing the value of objects, such that `{ key: value }` is equal to `{ key: value }`. For non-scalar values, identity will be disregarded by `notDeepEqual`.

[`deepEqual()`](./deepEqual.md) can be used to explicitly test deep, strict equality.

### Examples

Compare the value of two objects.

```js
QUnit.test( "example", assert => {
  const result = { foo: "yep" };

  // succeeds, objects are similar but have a different foo value.
  assert.notDeepEqual( result, { foo: "nope" } );
});
```
