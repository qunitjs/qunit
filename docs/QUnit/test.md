---
layout: default
title: test
description: Add a test to run.
categories:
  - main
  - async
---

## `QUnit.test( name, callback )`

Add a test to run.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `callback` (function) | Function to close over assertions |

#### Callback parameters: `callback( assert )`:

| parameter | description |
|-----------|-------------|
| `assert` (object) | A new instance object with the [assertion methods](/assert) |

### Description

Add a test to run using `QUnit.test()`.

The `assert` argument to the callback contains all of QUnit's [assertion methods](/assert). Use this argument to call your test assertions.

`QUnit.test()` can automatically handle the asynchronous resolution of a Promise on your behalf if you return a `then`able Promise as the result of your callback function.

### Examples

A practical example, using the assert argument and no globals.

```js
function square( x ) {
  return x * x;
}

QUnit.test( "square()", function( assert ) {
  var result = square( 2 );

  assert.equal( result, 4, "square(2) equals 4" );
});
```

Using modern syntax:

```js
function square( x ) {
  return x * x;
}

const { test } = QUnit;

test( "square()", t => {
  t.equal( square( 2 ), 4, "square(2) equals 4" );
  t.equal( square( 3 ), 9, "square(3) equals 9" );
});
```

---

An example of handling an asynchronous `then`able Promise result. This example uses an [ES6 Promise][] interface that is fulfilled after waiting 500ms.

[ES6 Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

```js
QUnit.test( "a Promise-returning test", function( assert ) {
  assert.expect( 1 );

  var thenable = new Promise(function( resolve, reject ) {
    setTimeout(function() {
      assert.ok( true );
      resolve( "result" );
    }, 500 );
  });
  return thenable;
});
```

---

Following the example above, `QUnit.test` also supports JS [async functions][] syntax out of the box.

[async functions]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

```js
function squareAfter1Second(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x * x);
    }, 1000);
  });
}

const { test } = QUnit;

test( "an async test", async t => {
  var a = await squareAfter1Second(2);
  var b = await squareAfter1Second(3);

  t.equal( a, 4 );
  t.equal( b, 9 );
  t.equal( await squareAfter1Second(5), 25 );
});
```
