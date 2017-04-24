---
layout: default
title: QUnit.testDone
description: Register a callback to fire whenever a test ends.
categories:
  - callbacks
---

## `QUnit.testDone( callback )`

Register a callback to fire whenever a test ends.

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Provides a single argument with the callback details object |

#### Callback details: `callback( details: { name, module, failed, passed, total, runtime, skipped, todo } )`

| parameter | description |
|-----------|-------------|
| `name` (string) | Name of the current test |
| `module` (string) | Name of the current module |
| `failed` (number) | The number of failed assertions |
| `passed` (number) | The number of passed assertions |
| `total` (number) | The total number of assertions |
| `runtime` (number) | The execution time in millseconds of the test, including beforeEach and afterEach calls |
| `skipped` (boolean) | Indicates whether or not the current test was skipped |
| `todo` (boolean) | Indicates whether or not the current test was a todo |

### Example

Register a callback that logs results of a single test

```js
QUnit.testDone( function( details ) {
  var result = {
    "Module name": details.module,
    "Test name": details.name,
    "Assertions": {
      "Total": details.total,
      "Passed": details.passed,
      "Failed": details.failed
    },
    "Skipped": details.skipped,
    "Todo": details.todo,
    "Runtime": details.runtime
  };

  console.log( JSON.stringify( result, null, 2 ) );
} );
```

Using modern syntax:

```js
QUnit.testDone( ( { module, name, total, passed, failed, skipped, todo, runtime } ) => {
  var result = {
    "Module name": module,
    "Test name": name,
    "Assertions": {
      "Total": total,
      "Passed": passed,
      "Failed": failed
    },
    "Skipped": skipped,
    "Todo": todo,
    "Runtime": runtime
  };

  console.log( JSON.stringify( result, null, 2 ) );
} );
```
