---
layout: default
title: assert.propEqual()
excerpt: A strict type and value comparison of an object's own properties.
categories:
  - assert
redirect_from:
  - "/propEqual/"
version_added: "1.11"
---

`propEqual( actual, expected [, message ] )`

A strict type and value comparison of an object's own properties.

| name               | description                          |
|--------------------|--------------------------------------|
| `actual`           | Expression being tested              |
| `expected`         | Known comparison value               |
| `message` (string) | A short description of the assertion |

### Description

The `propEqual()` assertion provides strictly (`===`) comparison of Object properties. Unlike `deepEqual()`, this assertion can be used to compare two objects made with different constructors and prototype.

[`strictEqual()`](./strictEqual.md) can be used to test strict equality.

[`notPropEqual()`](./notPropEqual.md) can be used to explicitly test strict inequality of Object properties.

### Examples

Compare the properties values of two objects.

```js
QUnit.test( "example", assert => {
  function Foo() {
    this.x = 1;
    this.y = "2";
  }
  Foo.prototype.walk = function () {};
  Foo.prototype.run = function () {};
  Foo.prototype.z = "inherited";

  const result = new Foo();

  assert.propEqual( result, {
    x: 1,
    y: "2"
  } );
});
```
