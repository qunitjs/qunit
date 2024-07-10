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

When QUnit receives report of a global error strictly inside a test (or one of its module hooks), the exception is reported to the currently running test as extra failed assertion, and thus the test will be marked as failed. This means that uncaught exceptions (such as calling an undefined function) during [QUnit.test.todo](../QUnit/test.todo.md) callback count as expected failure and **not** fail the test run.

Errors received before tests (e.g. early event callbacks), internally between tests, or around the [runEnd event](../callbacks/QUnit.on.md#the-runend-event) (if the process is still alive for some reason), are emitted as an ["error" event](../callbacks/QUnit.on.md#the-error-event) to reporters.

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
