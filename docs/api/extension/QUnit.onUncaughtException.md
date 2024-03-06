---
layout: page-api
title: QUnit.onUncaughtException()
excerpt: Handle a global error.
groups:
 - extension
version_added: "2.17.0"
redirect_from:
  - "/config/QUnit.onUncaughtException/"
  - "/extension/QUnit.onUncaughtException/"
---

`QUnit.onUncaughtException( error )`

Handle a global error that should result in a failed test run.

| name | description |
|------|-------------|
| `error` (any) | Usually an `Error` object, but any other thrown or rejected value may be given as well. |

## Examples

```js
const error = new Error('Failed to reverse the polarity of the neutron flow');
QUnit.onUncaughtException(error);
```

```js
process.on('uncaughtException', QUnit.onUncaughtException);
```

```js
window.addEventListener('unhandledrejection', function (event) {
  QUnit.onUncaughtException(event.reason);
});
```
