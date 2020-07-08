---
layout: default
title: QUnit.done
description: Register a callback to fire whenever the test suite ends.
categories:
  - callbacks
redirect_from:
  - "/QUnit.done/"
---

## `QUnit.done( callback )`

Register a callback to fire whenever the test suite ends. The callback can return a promise that will be waited for before the next callback is handled.

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Provides a single argument with the callback details object |

#### Callback details: `callback( details: { failed, passed, total, runtime } )`

| parameter | description |
|-----------|-------------|
| `failed` (number) | The number of failed assertions |
| `passed` (number) | The number of passed assertions |
| `total` (number) | The total number of assertions |
| `runtime` (number) | The time in milliseconds it took tests to run from start to finish. |

### Example

Register a callback that logs test results to the console.

```js
QUnit.done(function( details ) {
  console.log( "Total: ", details.total, " Failed: ", details.failed, " Passed: ", details.passed, " Runtime: ", details.runtime );
});
```

Using modern syntax:

```js
QUnit.done( ( { total, failed, passed, runtime } ) => {
  console.log( `Total: ${total}, Failed: ${failed}, Passed: ${passed}, Runtime: ${runtime}` );
});
```

Returning a promise:

```js
QUnit.done( () => {
  return new Promise(function(resolve, reject) {
    // do some async work
    resolve();
  });
});
```
