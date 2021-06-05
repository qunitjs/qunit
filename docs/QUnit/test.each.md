---
layout: default
title: QUnit.test.each()
excerpt: Add tests using a data provider.
categories:
  - main
version_added: "unreleased"
---

`QUnit.test.each( name, dataset, callback )`<br>
`QUnit.test.only.each( name, dataset, callback )`<br>
`QUnit.test.skip.each( name, dataset, callback )`<br>
`QUnit.test.todo.each( name, dataset, callback )`

Add tests using a data provider.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `dataset` (array) | Array or object of data values passed to each test case |
| `callback` (function) | Function to close over assertions |

#### Callback parameters: `callback( assert, data )`:

| parameter | description |
|-----------|-------------|
| `assert` (object) | A new instance object with the [assertion methods](../assert/index.md) |
| `data` (any) | Data value |

### Description

Use this method to add multiple tests that are similar, but with different data passed in.

`QUnit.test.each()` generates multiple calls to [`QUnit.test()`](./test.md) internally, and has all the same capabilities such support for async functions, returning a Promise, and the `assert` argument.

Each test case is passed one value of your dataset.

The [`only`](./test.only.md), [`skip`](./test.skip.md), and [`todo`](./test.todo.md) variants are also available, as `QUnit.test.only.each`, `QUnit.test.skip.each`, and `QUnit.test.todo.each` respectively.

### Examples

##### Example: Basic data provider

```js
function isEven( x ) {
  return x % 2 === 0;
}

QUnit.test.each( "isEven()", [ 2, 4, 6 ], ( assert, data ) => {
  assert.true( isEven( data ), `${data} is even` );
});
```

##### Example: Array data provider

The original array is passed to your callback. [Array destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) can be used to unpack the data array, directly from the callback signature.


```js
function square( x ) {
  return x * x;
}

QUnit.test.each( "square()", [
  [ 2, 4 ],
  [ 3, 9 ]
], ( assert, [ value, expected ] ) => {
  assert.equal( square( value ), expected, `${value} squared` );
});
```

##### Example: Object data provider

```js
QUnit.test.each( "isEven()", {
  caseEven: [ 2, true ],
  caseNotEven: [ 3, false ]
}, ( assert, [ value, expected ] ) => {
  assert.strictEqual( isEven( value ), expected );
});
```

##### Example: Async functions with `each()`

```js
function isEven( x ) {
  return x % 2 === 0;
}

async function isAsyncEven( x ) {
  return new Promise( resolve => {
    resolve( isEven( x ) );
  } );
}

QUnit.test.each( "isAsyncEven()", [ 2, 4 ], async ( assert, data ) => {
  assert.true( await isAsyncEven( data ), `${data} is even` );
});
```

Return a Promise from each callback, using classic ES5 syntax:

```js
function isEven( x ) {
  return x % 2 === 0;
}

function isAsyncEven( x ) {
  return new Promise( function ( resolve ) {
    resolve( isEven( x ) );
  } );
}

QUnit.test.each( "isAsyncEven()", [ 2, 4 ], ( assert, value ) => {
  return isAsyncEven( value ).then( ( result ) => {
    assert.true( result, `${value} is even` );
  } );
});
```
