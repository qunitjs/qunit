---
layout: page-api
title: QUnit.test.todo()
excerpt: Add a test which expects at least one failing assertion.
groups:
  - main
redirect_from:
  - "/QUnit.todo/"
  - "/QUnit/todo/"
  - "/QUnit/test.todo/"
version_added: "2.2.0"
---

`QUnit.test.todo( name, callback )`<br>
`QUnit.todo( name, callback )`

Add a test which expects at least one failing assertion or exception during its run.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `callback` (function) | Function that performs the test |

### Callback parameters

| parameter | description |
|-----------|-------------|
| `assert` (object) | A new instance object with the [assertion methods](../assert/index.md) |

Use this method to test a unit of code that is still under development (in a "todo" state). The "todo" test will pass as long as there is at least one assertion still failing, or if an exception is thrown.

When all assertions are passing, the "todo" test will fail, thus signaling that `QUnit.test.todo()` should be changed to [`QUnit.test()`](./test.md).

You can also use [`QUnit.module.todo()`](./module.md) to manage the "todo" state for all tests within a module at once.

## Changelog

| [QUnit 2.12](https://github.com/qunitjs/qunit/releases/tag/2.12.0) | The `QUnit.todo()` method was renamed to `QUnit.test.todo()`.<br/>Use of `QUnit.todo()` remains supported as an alias.
| [QUnit 2.2](https://github.com/qunitjs/qunit/releases/tag/2.2.0) | The `QUnit.todo()` method was introduced.

## Examples

How to use `QUnit.test.todo` to denote code that is still under development.

```js
QUnit.module('Robot', hooks => {
  let robot;
  hooks.beforeEach(() => {
    robot = new Robot();
  });

  // Robot is not yet finished
  QUnit.test.todo('fireLazer', assert => {
    const result = robot.fireLazer();
    assert.equal(result, "I'm firing my lazer!");
  });
});
```
