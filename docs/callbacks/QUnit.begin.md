---
layout: default
title: QUnit.begin()
excerpt: Register a callback to fire whenever the test suite begins.
categories:
  - callbacks
redirect_from:
  - "/QUnit.begin/"
version_added: "1.0.0"
---

`QUnit.begin( callback )`

Register a callback to fire whenever the test suite begins. The callback may be an async function, or a function that returns a promise, which will be waited for before the next callback is handled.

The callback will be called once, before QUnit runs any tests.

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Provides a single argument with the callback Details object |

##### Details object

Passed to the callback:

| property | description |
|-----------|-------------|
| `totalTests` | The number of total tests in the test suite |

### Examples

Get total number of tests known at the start.

```js
QUnit.begin( details => {
  console.log( `Test amount: ${details.totalTests}` );
});
```

Use async-await to wait for some asynchronous work:

```js
QUnit.begin( async details => {
  await someAsyncWork();

  console.log( `Test amount: ${details.totalTests}` );
});
```

Using classic ES5 syntax:

```js
QUnit.begin( function( details ) {
  console.log( "Test amount:" + details.totalTests );
});
```

```js
function someAsyncWork() {
  return new Promise( function( resolve, reject ) {
    // do some async work
    resolve();
  });
}

QUnit.begin( function( details ) {
  return someAsyncWork().then( function () {

    console.log( "Test amount:" + details.totalTests );
  });
});
```
