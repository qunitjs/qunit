---
layout: default
title: verifySteps
description: A helper assertion to verify the order and number of steps in a test.
categories:
  - assert
---

## `verifySteps( steps [, message ] )`

A helper assertion to verify the order and number of steps in a test.

| name               | description                          |
|--------------------|--------------------------------------|
| `steps` (array)    | Array of strings representing steps to verify |
| `message` (string) | A short description of the assertion |

### Description

The `verifySteps()` assertion compares a given array of string values (representing steps) and compares them with the order and values of previous `step()` calls. This assertion is helpful for verifying the order of execution for asynchronous flows.

### Examples

```js
QUnit.test( "step test", function( assert ) {
  obj.start = function() {
    assert.step('start');
  };
  obj.middle = function() {
    assert.step('middle');
  };
  obj.end = function() {
    assert.step('end');
  };

  return obj.process().then(function() {
    assert.verifySteps(['start', 'middle', 'end']);
  });
});
```
