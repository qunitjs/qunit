---
layout: default
title: only
description: Adds a test to exclusively run, preventing all other tests from running.
categories:
  - main
---

## `QUnit.only( name, callback )`

Adds a test to exclusively run, preventing all other tests from running.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `callback` (function) | Function to close over assertions |

#### Callback parameters: `callback( assert )`:

| parameter | description |
|-----------|-------------|
| `assert` (object) | A new instance object with the [assertion methods](/assert) |

### Description

Use this method to focus your test suite on a specific test. `QUnit.only` will cause any other tests in your suite to be ignored.

Note that if more than one `QUnit.only` is present only the first instance will run.

This is an alternative to filtering tests to run in the HTML reporter. It is especially useful when you use a console reporter or in a codebase with a large set of long running tests.

### Example

How to use `QUnit.only` to filter your test suite.

```js
QUnit.module( "robot", {
  beforeEach: function() {
    this.robot = new Robot();
  }
});

QUnit.test( "say", function( assert ) {
  assert.ok( false, "I'm not quite ready yet" );
});

QUnit.test( "stomp", function( assert ) {
  assert.ok( false, "I'm not quite ready yet" );
});

// You're currently working on the laser feature, so we run only this test
QUnit.only( "laser", function( assert ) {
  assert.ok( this.robot.laser() );
});
```

Using modern syntax:

```js
const { test, only } = QUnit;

QUnit.module( "robot", {
  beforeEach: function() {
    this.robot = new Robot();
  }
});

test( "say", t => {
  t.ok( false, "I'm not quite ready yet" );
});

test( "stomp", t => {
  t.ok( false, "I'm not quite ready yet" );
});

// You're currently working on the laser feature, so we run only this test
only( "laser", function( t ) {
  t.ok( this.robot.laser() );
});
```
