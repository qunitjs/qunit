---
layout: default
title: start
description: QUnit.start() is used to start an async test set
categories:
  - main
  - async
---

## `QUnit.start()`

`QUnit.start()` must be used to start a test run that has [`QUnit.config.autostart`](/config/QUnit.config) set to `false`.

<p class="warning" markdown="1">Warning: This method was previously used to control async tests on text contexts along with `QUnit.stop`. For asynchronous tests, use [`assert.async`](/assert/async) instead.</p>

When your async test has multiple exit points, call `QUnit.start()` for the corresponding number of `QUnit.stop()` increments.

### Example

A test run that does not begin when the page is done loading. This example uses an Asynchronous Module Definition (AMD) loader-style `require` call.

```js
QUnit.config.autostart = false;

require(["test/tests1.js", "test/tests2.js"], function() {
  QUnit.start();
});
```
