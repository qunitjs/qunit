---
layout: page-api
title: QUnit.test.only()
excerpt: Add a test that is exclusively run.
groups:
  - main
redirect_from:
  - "/QUnit.only/"
  - "/QUnit/only/"
  - "/QUnit/test.only/"
version_added: "1.20.0"
---

`QUnit.test.only( name, callback )`<br>
`QUnit.only( name, callback )`

Add a test that is exclusively run, preventing other tests from running unless they are also defined in this way.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `callback` (function) | Function that performs the test |

### Callback parameters

| parameter | description |
|-----------|-------------|
| `assert` (object) | A new instance object with the [assertion methods](../assert/index.md) |

Use this method to focus your test suite on specific tests. `QUnit.test.only` will cause any other tests in your suite to be ignored.

This method is an alternative to re-running individual tests from the HTML reporter interface, and can be especially useful to set your filter upfront without first running the test suite in a browser, e.g. in a codebase with many long-running tests.

It can also be used as alternative to the `--filter` CLI option. If you have a specific test in front of you in your text editor, you set the "only" flag on this test directly by using `QUnit.test.only`, without needing to copy or otherwise match the test name via the `--filter` option. Setting the "only" flag in this way, is similar to how you might use the `debugger` keyword to interact with browser devtools.

When debugging a larger area of code, you may want to expand your filter to run all tests under a given module. You can use[`QUnit.module.only()`](./module.md) to automatically mark all tests inside that module as "only" tests.

## Changelog

| [QUnit 2.12](https://github.com/qunitjs/qunit/releases/tag/2.12.0) | The `QUnit.only()` method was renamed to `QUnit.test.only()`.<br/>Use of `QUnit.only()` remains supported as an alias.
| [QUnit 1.20](https://github.com/qunitjs/qunit/releases/tag/1.20.0) | The `QUnit.only()` method was introduced.

## Examples

How to use `QUnit.test.only` to filter which tests are run.

```js
QUnit.module('robot', hooks => {
  let robot;
  hooks.beforeEach(() => {
    robot = new Robot();
  });

  QUnit.test('say()', assert => {
    assert.true(robot.say('Hello'));
  });

  // Run only this test
  // For example, you are working on changing this method.
  QUnit.test.only('laser()', assert => {
    assert.true(robot.laser());
  });

  QUnit.test('take()', assert => {
    assert.true(robot.take(5));
  });
});
```
