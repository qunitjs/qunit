---
layout: page-api
title: assert.propEqual()
excerpt: A strict type and value comparison of an object's own properties.
groups:
  - assert
redirect_from:
  - "/propEqual/"
version_added: "1.11.0"
---

`propEqual( actual, expected [, message ] )`

A strict type and value comparison of an object's own properties.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | A short description of the assertion |

## Description

The `propEqual()` assertion provides strictly (`===`) comparison of Object properties. Unlike `deepEqual()`, this assertion can be used to compare two objects made with different constructors and prototype.

[`strictEqual()`](./strictEqual.md) can be used to test strict equality.

[`notPropEqual()`](./notPropEqual.md) can be used to explicitly test strict inequality of Object properties.

## Examples

Compare the properties values of two objects.

```js
QUnit.test( "example", assert => {
  class Foo {
    constructor() {
      this.x = 1;
      this.y = 2;
    }
    walk() {}
    run() {}
  }

  const foo = new Foo();

  // succeeds, own properties are strictly equal,
  // and inherited properties (such as which object constructor) are ignored.
  assert.propEqual( foo, {
    x: 1,
    y: 2
  } );
});
```

Using classic ES5 syntax:

```js
QUnit.test( "example", function ( assert ) {
  function Foo() {
    this.x = 1;
    this.y = 2;
  }
  Foo.prototype.walk = function () {};
  Foo.prototype.run = function () {};

  var foo = new Foo();
  var expected = {
    x: 1,
    y: 2
  };

  // succeeds, own properties are strictly equal.
  assert.propEqual( foo, expected );
});
```
