---
layout: default
title: propEqual
description: A strict type and value comparison of an object's own properties.
categories:
  - assert
---

## `propEqual( actual, expected [, message ] )`

A strict type and value comparison of an object's own properties.

| name               | description                          |
|--------------------|--------------------------------------|
| `actual`           | Expression being tested              |
| `expected`         | Known comparison value               |
| `message` (string) | A short description of the assertion |

### Description

The `propEqual()` assertion provides strictly (`===`) comparison of Object properties. Unlike `deepEqual()`, this assertion can be used to compare two objects made with different constructors and prototype.

[`strictEqual()`](/assert/strictEqual) can be used to test strict equality.

[`notPropEqual()`](/assert/notPropEqual) can be used to explicitly test strict inequality of Object properties.

### Example

Compare the properties values of two objects.

```js
QUnit.test( "propEqual test", function( assert ) {
  function Foo( x, y, z ) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  Foo.prototype.doA = function () {};
  Foo.prototype.doB = function () {};
  Foo.prototype.bar = 'prototype';

  var foo = new Foo( 1, "2", [] );
  var bar = {
    x : 1,
    y : "2",
    z : []
  };
  assert.propEqual( foo, bar, "Strictly the same properties without comparing objects constructors." );
});
```
