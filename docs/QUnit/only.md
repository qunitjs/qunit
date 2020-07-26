---
layout: default
title: QUnit.only()
description: Add a test that is exclusively run.
categories:
  - main
version_added: "1.20"
---

`QUnit.only( name, callback )`

Add a test to exclusively run, preventing other tests from running unless also defined with `QUnit.only()`.

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

This method is an alternative to re-running individual tests from the HTML reporter interface, and can be especially useful as it can be done upfront without first running the test suite, e.g. in a codebase with long-running tests.

It can also be instead of the `--filter` CLI option, e.g. if you're already having the test open in your text editor. Similar to how one might use the `debugger` keyword.

When debugging a larger area of code, you may want to _only_ run a subset of tests. Note that you can also replace `QUnit.module()` with [`QUnit.module.only()`](./module.md) to declaratively filter an entire module.

### Example

How to use `QUnit.only` to filter your test suite.

```js
QUnit.module( "robot", {
  beforeEach: function() {
    this.robot = new Robot();
  }
});

QUnit.test( "say()", function( assert ) {
  assert.ok( false, "I'm not quite ready yet" );
});

// You're currently working on the laser methiod, so run only this test
QUnit.only( "laser()", function( assert ) {
  assert.ok( this.robot.laser() );
});

QUnit.test( "stomp()", function( assert ) {
  assert.ok( false, "I'm not quite ready yet" );
});

```

Using modern syntax:

```js
const { module, test, only } = QUnit;

let robot;

module( "robot", hooks => {
  let robot;
  hooks.beforeEach( () => {
    robot = new Robot();
  });

  test( "say()", assert => {
    assert.ok( false, "I'm not quite ready yet" );
  });

  // You're currently working on the laser methiod, so run only this test
  only( "laser()", assert => {
    assert.ok( robot.laser() );
  });

  test( "stomp()", assert => {
    assert.ok( false, "I'm not quite ready yet" );
  });
});
```
