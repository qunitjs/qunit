---
layout: page-api
title: QUnit.testDone()
excerpt: Register a callback to fire whenever a test ends.
groups:
  - callbacks
redirect_from:
  - "/callbacks/QUnit.testDone/"
  - "/QUnit.testDone/"
version_added: "1.0.0"
---

`QUnit.testDone( callback )`

Register a callback to fire whenever a test ends. The callback may be an async function, or a function that return a promise which will be waited for before the next callback is handled.

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Provides a single argument with the callback Details object |

### Details object

Passed to the callback:

| property | description |
|-----------|-------------|
| `name` (string) | Name of the current test |
| `module` (string) | Name of the current module |
| `failed` (number) | The number of failed assertions |
| `passed` (number) | The number of passed assertions |
| `total` (number) | The total number of assertions |
| `runtime` (number) | The execution time in milliseconds of the test, including beforeEach and afterEach calls |
| `skipped` (boolean) | Indicates whether or not the current test was skipped |
| `todo` (boolean) | Indicates whether or not the current test was a todo |

## Examples

Register a callback that logs results of a single test:

```js
QUnit.testDone(details => {
  const result = {
    'Module name': details.module,
    'Test name': details.name,
    Assertions: {
      Total: details.total,
      Passed: details.passed,
      Failed: details.failed
    },
    Skipped: details.skipped,
    Todo: details.todo,
    Runtime: details.runtime
  };

  console.log(JSON.stringify(result, null, 2));
});
```
