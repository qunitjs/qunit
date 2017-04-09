---
layout: default
title: deepEqual
description: A deep recursive comparison, working on primitive types, arrays, objects, regular expressions, dates and functions.
categories:
  - assert
---

## `deepEqual( actual, expected [, message ] )`

A deep recursive comparison, working on primitive types, arrays, objects, regular expressions, dates and functions.

| name               | description                          |
|--------------------|--------------------------------------|
| `actual`           | Expression being tested              |
| `expected`         | Known comparison value               |
| `message` (string) | A short description of the assertion |

### Description

The `deepEqual()` assertion can be used just like `equal()` when comparing the value of objects, such that `{ key: value }` is equal to `{ key: value }`. For non-scalar values, identity will be disregarded by `deepEqual`.

[`notDeepEqual()`](/assert/notDeepEqual) can be used to explicitly test deep, strict inequality.

### Examples

Compare the value of two objects.
```js
QUnit.test( "deepEqual test", function( assert ) {
  var obj = { foo: "bar" };

  assert.deepEqual( obj, { foo: "bar" }, "Two objects can be the same in value" );
});
```
