---
layout: page-api
title: QUnit.moduleDone()
excerpt: Register a callback to fire whenever a module ends.
groups:
  - callbacks
redirect_from:
  - "/callbacks/QUnit.moduleDone/"
  - "/QUnit.moduleDone/"
version_added: "1.0.0"
---

`QUnit.moduleDone( callback )`

Register a callback to fire whenever a module ends. The callback may be an async function, or a function that return a promise which will be waited for before the next callback is handled.

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Provides a single argument with the callback Details object |

### Details object

Passed to the callback:

| property | description |
|-----------|-------------|
| `name` (string) | Name of this module |
| `failed` (number) | The number of failed assertions |
| `passed` (number) | The number of passed assertions |
| `total` (number) | The total number of assertions |
| `runtime` (number) | The execution time in milliseconds of this module |

## Examples

Register a callback that logs the module results

```js
QUnit.moduleDone(details => {
  console.log(`Finished running: ${details.name} Failed/total: ${details.failed}/${details.total}`);
});
```
