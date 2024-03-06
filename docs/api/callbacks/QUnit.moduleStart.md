---
layout: page-api
title: QUnit.moduleStart()
excerpt: Register a callback to fire whenever a module begins.
groups:
  - callbacks
redirect_from:
  - "/callbacks/QUnit.moduleStart/"
  - "/QUnit.moduleStart/"
version_added: "1.0.0"
---

`QUnit.moduleStart( callback )`

Register a callback to fire whenever a module begins. The callback can return a promise that will be waited for before the next callback is handled.

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Provides a single argument with the callback Details object |

### Details object

Passed to the callback:

| property | description |
|-----------|-------------|
| `name` (string) | Name of the next module to run |

## Examples

Register a callback that logs the module name

```js
QUnit.moduleStart(details => {
  console.log(`Now running: ${details.name}`);
});
```
