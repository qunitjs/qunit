---
layout: page-api
title: QUnit.load()
excerpt: Inform the test runner that code has finished loading.
groups:
  - deprecated
redirect_from:
  - "/QUnit/load/"
version_added: "1.0.0"
version_deprecated: "unreleased"
---

`QUnit.load()`

Inform the test runner that your source code and tests have finished loading.

This method was used in conjunction with the [`QUnit.config.autostart`](../config/autostart.md) option in a web browser, to indicate when your custom way of loading scripts is complete.

As of [QUnit 2.1.1](https://github.com/qunitjs/qunit/releases/tag/2.1.1), calls to `QUnit.load()` are no longer needed. Existing calls are usually ignored and safe to remove.

<p class="note note--warning" markdown="1">This method is __deprecated__. Remove call, or replace by a single call to [`QUnit.start()`](./start.md).</p>

## Changelog

| UNRELEASED | Deprecated. Use [`QUnit.start()`](./start.md) instead.
| [QUnit 2.1.1](https://github.com/qunitjs/qunit/releases/tag/2.1.1) | `QUnit.start()` no longer requires calling `QUnit.load()` first.

## Migration guide

If you still call `QUnit.load()` with QUnit 2.2 or later, the call is usually redundant and safe to remove.

### If you call both `QUnit.load()` and `QUnit.start()`

If your project started with QUnit 1.x, and you use `QUnit.config.autostart = false`, then you might be calling both of these methods. In the QUnit 1.x era, [`QUnit.start()`](./start.md) required that you also call `QUnit.load()` first.

This is no longer needed since [QUnit 2.1.1](https://github.com/qunitjs/qunit/releases/tag/2.1.1), and the call to `QUnit.load()` is safe to remove.

### If you call `QUnit.load()`

Prior to QUnit 2.21, the built-in HTML Reporter called `QUnit.load()` from the window.onload event, which in turn gracefully calls `QUnit.start()` if it has not been called already.

If your test runner works in a similar way, call [`QUnit.start()`](./start.md) instead of `QUnit.load()`. This will solve the deprecation warning and prepares you for QUnit 3.

### Karma runner

```
QUnit.load is deprecated and will be removed in QUnit 3.0.
```

If you encounter this warning in Karma output, upgrade to [karma-qunit](https://github.com/karma-runner/karma-qunit) 4.2.0 or later, which [fixes](https://github.com/karma-runner/karma-qunit/pull/184) this warning.
