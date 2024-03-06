---
layout: page-api
title: assert.notPropEqual()
excerpt: Compare an object's own properties for inequality.
groups:
  - assert
redirect_from:
  - "/assert/notPropEqual/"
  - "/notPropEqual/"
version_added: "1.11.0"
---

`notPropEqual( actual, expected, message = "" )`

Compare an object's own properties using a strict inequality comparison.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | Short description |

The `notPropEqual` assertion compares only an object's own properties, using the strict inequality operator (`!==`).

The test passes if there are properties with different values, or extra properties, or missing properties.

## See also

* Use [`assert.notPropContains()`](./notPropContains.md) to only check for the absence or inequality of some properties.
* Use [`assert.propEqual()`](./propEqual.md) to test for equality of properties instead.

## Examples

Compare the values of two objects properties.

```js
QUnit.test('example', assert => {
  class Foo {
    constructor () {
      this.x = '1';
      this.y = 2;
    }

    walk () {}
    run () {}
  }

  const foo = new Foo();

  // succeeds, only own property values are compared (using strict equality),
  // and property "x" is indeed not equal (string instead of number).
  assert.notPropEqual(foo, {
    x: 1,
    y: 2
  });
});
```
