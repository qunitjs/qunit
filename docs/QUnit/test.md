---
layout: default
title: QUnit.test()
excerpt: Add a test to run.
categories:
  - main
  - async
redirect_from:
  - "/QUnit.asyncTest/"
  - "/QUnit.test/"
  - "/asyncTest/"
  - "/test/"
version_added: "1.0"
---

`QUnit.test( name, callback )`

Add a test to run.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `callback` (function) | Function to close over assertions |

#### Callback parameters: `callback( assert )`:

| parameter | description |
|-----------|-------------|
| `assert` (object) | A new instance object with the [assertion methods](../assert/index.md) |

### Description

Add a test to run using `QUnit.test()`.

The `assert` argument to the callback contains all of QUnit's [assertion methods](../assert/index.md). Use this argument to call your test assertions.

`QUnit.test()` can automatically handle the asynchronous resolution of a Promise on your behalf if you return a "then-able" Promise as the result of your callback function.

See also:
* [`QUnit.test.only()`](./test.only.md)
* [`QUnit.test.skip()`](./test.skip.md)
* [`QUnit.test.todo()`](./test.todo.md)


##### Changelog

| [QUnit 1.16](https://github.com/qunitjs/qunit/releases/tag/1.16.0) | Added support for async functions, and returning of a Promise.


### Examples

A practical example, using the assert argument and no globals.

```js
function square( x ) {
  return x * x;
}

QUnit.test( "square()", assert => {
  assert.equal( square( 2 ), 4, "square(2)" );
  assert.equal( square( 3 ), 9, "square(3)" );
});
```

---

An example of handling an asynchronous "then-able" Promise result. This example uses an [ES6 Promise][] interface that is fulfilled after waiting 500ms.

[ES6 Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

```js
function fetchSquare( x ) {
  return new Promise( resolve => {
    setTimeout(() => { resolve( x * x ); }, 1000);
  });
}

QUnit.test( "Test with Promise", assert => {
  return fetchSquare( 3 ).then( result => {
    assert.equal( result, 9 );
  });
});
```

---

Following the example above, `QUnit.test` also supports JS [async functions][] syntax out of the box.

[async functions]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

```js
QUnit.test( "Test with async-await", async assert => {
  const a = await fetchSquare(2);
  const b = await fetchSquare(3);

  assert.equal( a, 4 );
  assert.equal( b, 9 );
  assert.equal( await fetchSquare(5), 25 );
});
```
