---
layout: default
categories: [config]
title: QUnit.extend
description: Copy the properties defined by the <code>mixin</code> object into the <code>target</code> object
---

## `QUnit.extend( target, mixin )`

Copy the properties defined by the `mixin` object into the `target` object

| name               | description                          |
|--------------------|--------------------------------------|
| `target`           | An object whose properties are to be modified |
| `mixin`            | An object describing which properties should be modified |

This method will modify the `target` object to contain the "own" properties defined by the `mixin`. If the `mixin` object specifies the value of any attribute as `undefined`, this property will instead be removed from the `target` object.

### Example

Define a custom `mod2` assertion that tests if the provided numbers are equivalent in modulo 2.

```js
QUnit.test( "QUnit.extend", function( assert ) {
  var base = {
    a: 1,
    b: 2,
    z: 3
  };
  QUnit.extend( base, {
    b: 2.5,
    c: 3,
    z: undefined
  } );

  assert.equal( base.a, 1, "Unspecified values are not modified" );
  assert.equal( base.b, 2.5, "Existing values are updated" );
  assert.equal( base.c, 3, "New values are defined" );
  assert.ok( !( "z" in base ), "Values specified as `undefined` are removed" );
});
```
