---
layout: default
title: QUnit.begin()
excerpt: Register a callback to fire whenever the test suite begins.
categories:
  - callbacks
redirect_from:
  - "/QUnit.begin/"
version_added: "1.0"
---

`QUnit.begin( callback )`

Register a callback to fire whenever the test suite begins. The callback can return a promise that will be waited for before the next callback is handled.

`QUnit.begin()` is called once before running any tests.

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Provides a single argument with the callback details object |

#### Callback details: `callback( details: { totalTests } )`

| parameter | description |
|-----------|-------------|
| `totalTests` | The number of total tests in the test suite |

### Example

Get total amount of tests.

```js
QUnit.begin(function( details ) {
  console.log( "Test amount:", details.totalTests );
});
```

Using modern syntax:

```js
QUnit.begin( ( { totalTests } ) => {
  console.log( `Test amount: ${totalTests}` );
});
```

Returning a promise:

```js
QUnit.begin( () => {
  return new Promise(function(resolve, reject) {
    // do some async work
    resolve();
  });
});
```
