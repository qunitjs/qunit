---
layout: default
categories: [config]
title: QUnit.push
status: deprecated
description: "<strong>DEPRECATED</strong> Report the result of a custom assertion"
---

## `QUnit.push( result, actual, expected, message )`

__DEPRECATED__: Report the result of a custom assertion

| name               | description                          |
|--------------------|--------------------------------------|
| `result` (boolean) | Result of the assertion              |
| `actual`           | Expression being tested              |
| `expected`         | Known comparison value               |
| `message` (string) | A short description of the assertion |

<p class="warning" markdown="1">This method is __deprecated__ and it's recommended to use [`pushResult`](/assert/pushResult) on its direct reference in the assertion context.</p>

`QUnit.push` reflects to the current running test, and it may leak assertions in asynchronous mode. Checkout [`assert.pushResult()`](/assert/pushResult) to set a proper custom assertion.

Invoking `QUnit.push` allows to create a readable expectation that is not defined by any of QUnit's built-in assertions.
