---
layout: page-api
title: QUnit.start()
excerpt: Start the test runner.
groups:
  - main
  - async
redirect_from:
  - "/start/"
version_added: "1.0.0"
---

`QUnit.start()`

Start the test runner manually, when [`QUnit.config.autostart`](../config/autostart.md) is `false`. For example, if you load test files with AMD, RequireJS, or ESM dynamic imports.

Note: See [`QUnit.config.autostart`](../config/autostart.md) for detailed examples of how to use this.

<p class="note note--warning" markdown="1">**Warning**: Prior to QUnit 1.16, this method was used for resuming an async `QUnit.start` function, as complement to `QUnit.stop()`. To resume asynchronous tests, use [`assert.async()`](../assert/async.md) instead.</p>
