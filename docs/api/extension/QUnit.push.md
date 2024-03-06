---
layout: page-api
title: QUnit.push()
excerpt: Report the result of a custom assertion.
groups:
  - extension
  - deprecated
redirect_from:
  - "/config/QUnit.push/"
  - "/extension/QUnit.push/"
version_added: "1.0.0"
version_deprecated: "2.1.0"
---

`QUnit.push( result, actual, expected, message )`

Report the result of a custom assertion.

<p class="note note--warning" markdown="1">This method is __deprecated__ and it's recommended to use [`pushResult`](../assert/pushResult.md) in the assertion context instead.</p>

| name | description |
|------|-------------|
| `result` (boolean) | Result of the assertion |
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | A short description of the assertion |

`QUnit.push` reflects to the current running test, and it may leak assertions in asynchronous mode. Checkout [`assert.pushResult()`](../assert/pushResult.md) to set a proper custom assertion.

Invoking `QUnit.push` allows to create a readable expectation that is not defined by any of QUnit's built-in assertions.
