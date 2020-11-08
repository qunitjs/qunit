---
layout: default
title: QUnit.test.only()
description: Add a test that is exclusively run.
categories:
  - main
redirect_from:
  - "/QUnit.only/"
  - "/QUnit/only/"
version_added: "1.20"
---

`QUnit.test.only( name, callback )`<br>
`QUnit.only( name, callback )`

Add a test that is exclusively run, preventing other tests from running unless they are defined this way.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `callback` (function) | Function to close over assertions |

#### Callback parameters: `callback( assert )`:

| parameter | description |
|-----------|-------------|
| `assert` (object) | A new instance object with the [assertion methods](../assert/index.md) |

### Description

Use this method to focus your test suite on specific tests. `QUnit.only` will cause any other tests in your suite to be ignored.

This method is an alternative to re-running individual tests from the HTML reporter interface, and can be especially useful as it can be done upfront without first running the test suite, e.g. in a codebase with many long-running tests.

It can also be used instead of the `--filter` CLI option, e.g. if you're already having the test open in your text editor. Similar to how one might use the `debugger` keyword.

When debugging a larger area of code, you may want to _only_ run all tests within a given module. You can also use[`QUnit.module.only()`](./module.md) to automatically mark all tests in a module as "only" tests.

##### Changelog

| [QUnit 2.12](https://github.com/qunitjs/qunit/releases/tag/2.12.0) | The `QUnit.only()` method was renamed to `QUnit.test.only()`.<br/>Use of `QUnit.only()` remains supported as an alias.
| [QUnit 1.20](https://github.com/qunitjs/qunit/releases/tag/1.20.0) | The `QUnit.only()` method was introduced.

### Example

How to use `QUnit.test.only` to filter which tests are run.

```js
QUnit.module( "robot", hooks => {
  let robot;
  hooks.beforeEach( () => {
    robot = new Robot();
  });

  QUnit.test( "say()", assert => {
    assert.true( robot.say( "Hello" ) );
  });

  // Run only this test
  // For example, you are working on changing this method.
  QUnit.test.only( "laser()", assert => {
    assert.true( robot.laser() );
  });

  QUnit.test( "take()", assert => {
    assert.true( robot.take( 5 ) );
  });
});
```
