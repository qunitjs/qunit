---
layout: default
title: assert.deepEqual()
description: A deep recursive strict comparison, working on primitive types, arrays, objects, regular expressions, dates and functions considering all own and inherited properties.
categories:
  - assert
redirect_from:
  - "/deepEqual/"
---

`deepEqual( actual, expected [, message ] )`

A deep recursive strict comparison, working on primitive types, arrays, objects, regular expressions, dates and functions considering all own and inherited properties.

| name               | description                          |
|--------------------|--------------------------------------|
| `actual`           | Expression being tested              |
| `expected`         | Known comparison value               |
| `message` (string) | A short description of the assertion |

### Description

The `deepEqual()` assertion can be used just like `equal()` when comparing the value of objects, such that `{ key: value }` is equal to `{ key: value }`. For non-scalar values, identity will be disregarded by `deepEqual`.

[`notDeepEqual()`](./notDeepEqual.md) can be used to explicitly test deep, strict inequality.

[`propEqual()`](./propEqual.md) can be used to explicitly test deep, strict equality but only considering own properties. `deepEqual()` compares all inherited properties.

### Examples

Compare the value of two objects.
```js
QUnit.test( "deepEqual test", function( assert ) {
  var obj = { foo: "bar" };

  assert.deepEqual( obj, { foo: "bar" }, "Two objects can be the same in value" );
});
```

```js
QUnit.test( 'deepEqual failing test', function( assert ) {
  assert.deepEqual( {
    a: 'Albert',
    b: 'Berta',
    num: 123
  }, {
    a: 'Albert',
    b: 'Berta',
    num: '123' // Fails: the number `123` is not strictly equal to the string `'123'`.
  } );
} );
```
