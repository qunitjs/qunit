---
layout: page-api
title: QUnit.onUncaughtException()
excerpt: Report a global error.
groups:
 - extension
version_added: "2.17.0"
redirect_from:
  - "/config/QUnit.onUncaughtException/"
  - "/extension/QUnit.onUncaughtException/"
---

`QUnit.onUncaughtException( error )`

Report a global error that should result in a failed test run.

| name | description |
|------|-------------|
| `error` (any) | Usually an `Error` object, but any other thrown or rejected value may be given as well. |


This method can be safely called at any time, including between or outside tests. It is designed for use by plugins and integration layers.

In general, you should not use this method and instead throw an error. QUnit automatically finds and reports uncaught errors. The following are handled by default and should not be connected to `QUnit.onUncaughtException()` a second time:

* HTML Runner: `window.onerror`
* HTML Runner: `window.addEventListener('unhandledrejection', …)`
* QUnit CLI: `process.on('unhandledRejection', …)`
* QUnit CLI: `process.on('uncaughtException', …)`

## Examples

```js
const error = new Error('Failed to reverse the polarity of the neutron flow');
QUnit.onUncaughtException(error);
```

```js
process.on('unhandledExample', QUnit.onUncaughtException);
```

```js
window.addEventListener('unhandledexample', function (event) {
  QUnit.onUncaughtException(event.reason);
});
```
