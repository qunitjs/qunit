---
layout: page-api
title: QUnit.testStart()
excerpt: Register a callback to fire whenever a test begins.
groups:
  - callbacks
redirect_from:
  - "/callbacks/QUnit.testStart/"
  - "/QUnit.testStart/"
version_added: "1.0.0"
---

`QUnit.testStart( callback )`

Register a callback to fire whenever a test begins. The callback may be an async function, or a function that return a promise which will be waited for before the next callback is handled.

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Provides a single argument with the callback Details object |

### Details object

Passed to the callback:

| property | description |
|-----------|-------------|
| `name` (string) | Name of the next test to run |
| `module` (string) | Name of the current module |
| `testId` (string) | Id of the next test to run |
| `previousFailure` (boolean) | Whether the next test failed on a previous run |

## Examples

Register a callback that logs the module and test name:

```js
QUnit.testStart(details => {
  console.log(`Now running: ${details.module} ${details.name}`);
});
```
