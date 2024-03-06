---
layout: page-api
title: assert.propEqual()
excerpt: Compare an object's own properties.
groups:
  - assert
redirect_from:
  - "/assert/propEqual/"
  - "/propEqual/"
version_added: "1.11.0"
---

`propEqual( actual, expected, message = "" )`

Compare an object's own properties using a strict comparison.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | Short description of the actual expression |

The `propEqual` assertion only compares an object's own properties. This means the expected value does not need to be an instance of the same class or otherwise inherit the same prototype. This is in contrast with [`assert.deepEqual()`](./deepEqual.md).

This assertion fails if the values differ, or if there are extra properties, or if some properties are missing.

This method is recursive and can compare any nested or complex object via a plain object.

## See also

* Use [`assert.propContains()`](./propContains.md) to only check a subset of properties.
* Use [`assert.notPropEqual()`](./notPropEqual.md) to test for the inequality of object properties instead.

## Examples

Compare the property values of two objects.

```js
QUnit.test('example', assert => {
  class Foo {
    constructor () {
      this.x = 1;
      this.y = 2;
    }

    walk () {}
    run () {}
  }

  const foo = new Foo();

  // succeeds, own properties are strictly equal,
  // and inherited properties (such as which constructor) are ignored.
  assert.propEqual(foo, {
    x: 1,
    y: 2
  });
});
```

Using classic ES5 syntax:

```js
QUnit.test('example', function (assert) {
  function Foo () {
    this.x = 1;
    this.y = 2;
  }
  Foo.prototype.walk = function () {};
  Foo.prototype.run = function () {};

  var foo = new Foo();

  // succeeds, own properties are strictly equal.
  var expected = {
    x: 1,
    y: 2
  };
  assert.propEqual(foo, expected);
});
```
