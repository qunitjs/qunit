---
layout: default
title: QUnit.test.each()
excerpt: Add a parameterized test to run.
categories:
  - main
version_added: "unreleased"
---

`QUnit.test.each( name, data, callback )`

Add a parameterized test to run.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `data` (Array | Object) | Array of arrays of parameters to be passed as input to each test. This can also be specified as a 1D array of primitives or an object with each key representing a test case |
| `callback` (function) | Function to close over assertions |

#### Callback parameters: `callback( assert, args )`:

| parameter | description |
|-----------|-------------|
| `assert` (object) | A new instance object with the [assertion methods](../assert/index.md) |
| `args` (any) | All input parameters. The original array is passed. Array destructuring can be used to unpack input values |

### Description

Add a parameterized test to run using `QUnit.test.each()`. `QUnit.test.each()` generates multiple calls to `QUnit.test()` so `then`-able behavior is maintained.


The `assert` argument to the callback contains all of QUnit's [assertion methods](../assert/index.md). Use this argument to call your test assertions.
`QUnit.test.only.each`, `QUnit.test.skip.each` and `QUnit.test.todo.each` are also available.

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

function isEven( x ) {
  return x % 2 === 0;
}

function isAsyncEven( x ) {
  return new Promise( resolve => {
    return resolve( isEven( x ) );
  } );
}

QUnit.test.each( "square()", [ [ 2, 4 ], [ 3, 9 ] ], ( assert, [ value, expected ] ) => {
  assert.strictEqual( square( value ), expected, `square(${value})` );
});

QUnit.test.each( "isEven()", [ 2, 4 ], ( assert, value ) => {
  assert.true( isEven( value ), `isEven(${value})` );
});

QUnit.test.each( "isEven()", { caseEven: [ 2, true ], caseNotEven: [ 3, false ] }, ( assert, [ value, expected ] ) => {
  assert.strictEqual( isEven( value ), expected, `isEven(${value})` );
});

QUnit.test.each( "isAsyncEven()", [ 2, 4 ], ( assert, value ) => {
  return isAsyncEven( value ).then( ( value ) => {
    assert.true( isAsyncEven( value ), `isAsyncEven(${value})` );
  } );
});
```
