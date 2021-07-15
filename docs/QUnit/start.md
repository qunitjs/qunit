---
layout: default
title: QUnit.start()
excerpt: Start an async test suite.
categories:
  - main
  - async
redirect_from:
  - "/start/"
version_added: "1.0.0"
---

`QUnit.start()` must be used to start a test run that has [`QUnit.config.autostart`](../config/autostart.md) set to `false`.

<p class="note note--warning" markdown="1">Warning: This method was previously used to control async tests on text contexts along with `QUnit.stop`. For asynchronous tests, use [`assert.async`](../assert/async.md) instead.</p>

When your async test has multiple exit points, call `QUnit.start()` for the corresponding number of `QUnit.stop()` increments.

### Examples

A test run that does not begin when the page is done loading. This example uses an Asynchronous Module Definition (AMD) loader-style `require` call.

```js
QUnit.config.autostart = false;

require(
  [ "test/tests1.js", "test/tests2.js" ],
  QUnit.start
);
```
