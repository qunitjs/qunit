---
layout: default
title: QUnit.test.each()
excerpt: Add a parameterized test to run.
categories:
  - main
  - async
version_added: "1.0"
---

`QUnit.test.each( name, data, callback )`

Add a parameterized test to run.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `data` (Array) | Array of arrays of parameters to be passed as input to each test. This can also be specified as a 1D array of primitives |
| `callback` (function) | Function to close over assertions |

#### Callback parameters: `callback( assert, ...args )`:

| parameter | description |
|-----------|-------------|
| `assert` (object) | A new instance object with the [assertion methods](../assert/index.md) |
| `...args` (any) | All input parameters |

### Description

Add a parameterized test to run using `QUnit.test.each()`. `QUnit.test.each()` generates multiple calls to `QUnit.test()` so `then`-able behavior is maintained.


The `assert` argument to the callback contains all of QUnit's [assertion methods](../assert/index.md). Use this argument to call your test assertions.
`QUnit.test.each.only`, `QUnit.test.each.skip` and `QUnit.test.each.todo` are also available.

See also:
* [`QUnit.test.only()`](./test.only.md)
* [`QUnit.test.skip()`](./test.skip.md)
* [`QUnit.test.todo()`](./test.todo.md)


### Examples

A practical example, using the assert argument and no globals.

```js
function square( x ) {
  return x * x;
}

QUnit.test.each( "square()", [ [ 2, 4 ], [ 3, 9 ] ], ( assert value, expected ) => {
  assert.equal( square( value ), expected, `square(${value})` );
});

QUnit.test.each( "isEven()", [ 2, 4 ], ( assert, value ) => {
  assert.true( isEven( value ), `isEven(${value})` );
});
```
