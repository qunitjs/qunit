---
layout: page-api
title: QUnit.done()
excerpt: Register a callback to fire whenever the test suite ends.
groups:
  - callbacks
redirect_from:
  - "/QUnit.done/"
version_added: "1.0.0"
---

`QUnit.done( callback )`

Register a callback to fire whenever the test suite ends. The callback may be an async function, or a function that return a promise which will be waited for before the next callback is handled.

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Provides a single argument with the callback Details object |

### Details object

Passed to the callback:

| property | description |
|-----------|-------------|
| `failed` (number) | The number of failed assertions |
| `passed` (number) | The number of passed assertions |
| `total` (number) | The total number of assertions |
| `runtime` (number) | The time in milliseconds it took tests to run from start to finish. |

## Examples

Register a callback that logs test results to the console.

```js
QUnit.done( details => {
  console.log(
    `Total: ${details.total} Failed: ${details.failed} `
      + `Passed: ${details.passed} Runtime: ${details.runtime}`
  );
});
```

Using classic ES5 syntax:

```js
QUnit.done( function( details ) {
  console.log(
    "Total: " + details.total + " Failed: " + details.failed
    + " Passed: " + details.passed + " Runtime: " + details.runtime
  );
});
```
