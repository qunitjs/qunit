---
layout: page-api
title: assert.push()
excerpt: Report the result of a custom assertion.
groups:
  - deprecated
  - removed
redirect_from:
  - "/config/QUnit.push/"
  - "/extension/QUnit.push/"
  - "/api/extension/QUnit.push/"
version_added: "1.0.0"
version_deprecated: "2.1.1"
version_removed: "unreleased"
---

`push( result, actual, expected, message )`

Report the result of a custom assertion.

<p class="note note--warning" markdown="1">This method is __deprecated__ and it's recommended to use [`assert.pushResult()`](../assert/pushResult.md) instead.</p>

| name | description |
|------|-------------|
| `result` (boolean) | Result of the assertion |
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | A short description of the assertion |

`QUnit.assert.push()` relies on global state to push the assertion to the currently running test. This may leak assertions from asynchronous tests into an unrelated test.

To create a QUnit assertion plugin, refer to [`assert.pushResult()`](../assert/pushResult.md).

To safely report a global error from inside a plugin or other integration layer, without needing to know whether or which test is running, use [`QUnit.onUncaughtException()`](../extension/QUnit.onUncaughtException.md) instead.

## Changelog

| UNRELEASED | Removed.
| [QUnit 2.1.0](https://github.com/qunitjs/qunit/releases/tag/2.1.0) | Deprecated. Use `assert.pushResult` instead.
| [QUnit 2.0.0](https://github.com/qunitjs/qunit/releases/tag/2.0.0)| Remove `QUnit.push` alias.
| [QUnit 1.15.0](https://github.com/qunitjs/qunit/releases/tag/1.15.0) | Rename `QUnit.push` to `QUnit.assert.push`, with alias.
