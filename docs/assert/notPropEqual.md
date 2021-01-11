---
layout: default
title: assert.notPropEqual()
excerpt: A strict comparison of an object's own properties, checking for inequality.
categories:
  - assert
redirect_from:
  - "/notPropEqual/"
version_added: "1.11"
---

`notPropEqual( actual, expected [, message ] )`

A strict comparison of an object's own properties, checking for inequality.

| name               | description                          |
|--------------------|--------------------------------------|
| `actual`           | Expression being tested              |
| `expected`         | Known comparison value               |
| `message` (string) | A short description of the assertion |

The `notPropEqual` assertion uses the strict inverted comparison operator (`!==`) to compare the actual and expected arguments as Objects regarding only their properties but not their constructors.

When they aren't equal, the assertion passes; otherwise, it fails. When it fails, both actual and expected values are displayed in the test result, in addition to a given message.

[`equal()`](./equal.md) can be used to test equality.

[`propEqual()`](./propEqual.md) can be used to test strict equality of an Object properties.

### Examples

Compare the values of two objects properties.

```js
QUnit.test( "example", assert => {
  class Foo {
    constructor() {
      this.x = "1";
      this.y = 2;
    }
    walk() {}
    run() {}
  }

  const foo = new Foo();
  const expected = ;

  // succeeds, only own property values are compared (using strict equality),
  // and propery "x" is indeed not equal (string instead of number).
  assert.notPropEqual( foo, {
    x: 1,
    y: 2
  } );
});
```
