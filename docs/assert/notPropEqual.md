---
layout: default
title: notPropEqual
description: A strict comparison of an object's own properties, checking for inequality.
categories:
  - assert
---

## `notPropEqual( actual, expected [, message ] )`

A strict comparison of an object's own properties, checking for inequality.

| name               | description                          |
|--------------------|--------------------------------------|
| `actual`           | Expression being tested              |
| `expected`         | Known comparison value               |
| `message` (string) | A short description of the assertion |

The `notPropEqual` assertion uses the strict inverted comparison operator (`!==`) to compare the actual and expected arguments as Objects regarding only their properties but not their constructors.

When they aren't equal, the assertion passes; otherwise, it fails. When it fails, both actual and expected values are displayed in the test result, in addition to a given message.

[`equal()`](/assert/equal) can be used to test equality.

[`propEqual()`](/assert/propEqual) can be used to test strict equality of an Object properties.

### Examples

Compare the values of two objects properties.

```js
QUnit.test( "notPropEqual test", function( assert ) {
  function Foo( x, y, z ) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  Foo.prototype.doA = function () {};
  Foo.prototype.doB = function () {};
  Foo.prototype.bar = 'prototype';

  var foo = new Foo( 1, "2", [] );
  var bar = new Foo( "1", 2, {} );
  assert.notPropEqual( foo, bar, "Properties values are strictly compared." );
});
```
