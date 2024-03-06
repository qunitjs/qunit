---
layout: page-api
title: QUnit.done()
excerpt: Register a callback to fire when the test run has ended.
groups:
  - callbacks
redirect_from:
  - "/callbacks/QUnit.done/"
  - "/QUnit.done/"
version_added: "1.0.0"
---

`QUnit.done( callback )`

Register a callback to fire when the test run has ended. The callback may be an async function, or a function that return a Promise which will be waited for before the next callback is handled.

| parameter | description |
|-----------|-------------|
| `callback` (function) | Callback to execute, called with a `details` object:

### Details object

| property | description |
|-----------|-------------|
| `failed` (number) | Number of failed assertions |
| `passed` (number) | Number of passed assertions |
| `total` (number) | Total number of assertions |
| `runtime` (number) | Duration of the test run in milliseconds |

<div class="note note--warning" markdown="1">

Use of `details` is __deprecated__ and it's recommended to use [`QUnit.on('runEnd')`](./QUnit.on.md#the-runend-event) instead.

Caveats:

* This callback reports the **internal assertion count**.

* The default browser and CLI interfaces for QUnit and other popular test frameworks, and most CI integrations, report the number of tests. Reporting the number _assertions_ may be confusing to developers.

* Failed assertions of a [`test.todo()`](../QUnit/test.todo.md) test are reported exactly as such. While rare, this means that a test run and all tests within it may be reported as passing, while internally there were some failed assertions. Unfortunately, this internal detail is exposed for compatibility reasons.

</div>

## Changelog

| [QUnit 2.2](https://github.com/qunitjs/qunit/releases/tag/2.2.0) | Deprecate `details` parameter in favour of `QUnit.on('runEnd')`.

## Examples

Register a callback that logs internal assertion counts.

```js
QUnit.done(function (details) {
  console.log(
    'Total: ' + details.total + ' Failed: ' + details.failed +
    ' Passed: ' + details.passed + ' Runtime: ' + details.runtime
  );
});
```
