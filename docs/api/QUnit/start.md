---
layout: page-api
title: QUnit.start()
excerpt: Start the test runner.
groups:
  - main
  - async
redirect_from:
  - "/QUnit/start/"
  - "/start/"
version_added: "1.0.0"
---

`QUnit.start()`

Call this method to start the test runner. This indicates that all relevant source code has been loaded and all tests have been defined.

In most environments this is **automatically called** and you do not need to call it. This includes testing via the HTML Runner and the QUnit CLI.

If you build a custom test runner (such in SpiderMonkey or Node.js), or if you disable `QUnit.config.autostart` and load test files asynchronously (with AMD, RequireJS, or ESM dynamic imports), then you need to call this once after your test files have been loaded.

See [`QUnit.config.autostart`](../config/autostart.md) for detailed examples of how to use `QUnit.start()`.

<p class="note note--warning" markdown="1">Prior to QUnit 1.16, this method was used for resuming an async `QUnit.test()` function, as complement to `QUnit.stop()`. To resume asynchronous tests, use [`assert.async()`](../assert/async.md) instead.</p>

## Changelog

| [QUnit 2.1.1](https://github.com/qunitjs/qunit/releases/tag/2.1.1) | `QUnit.start()` no longer requires calling [`QUnit.load()`](./load.md) first.
| [QUnit 2.0](https://github.com/qunitjs/qunit/releases/tag/2.0.0) | Support for calling `start()` to resume an async test was removed. ([Migration guide](../../upgrade-guide-2.x.md#introducing-assertasync))
| [QUnit 1.16](https://github.com/qunitjs/qunit/releases/tag/1.16.0) | Use of `start()` to resume an async test was deprecated in favour of [`assert.async()`](../assert/async.md).
