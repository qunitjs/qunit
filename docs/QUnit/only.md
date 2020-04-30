---
layout: default
title: only
description: Adds a test to exclusively run, preventing any other tests not defined with `QUnit.only()` from running.
categories:
  - main
---

## `QUnit.only( name, callback )`

Adds a test to exclusively run, preventing any other tests not defined with `QUnit.only()` from running.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `callback` (function) | Function to close over assertions |

#### Callback parameters: `callback( assert )`:

| parameter | description |
|-----------|-------------|
| `assert` (object) | A new instance object with the [assertion methods](/assert) |

### Description

Use this method to focus your test suite on specific tests. `QUnit.only` will cause any other tests in your suite to be ignored.

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

// You're currently working on the laser feature, so we run only these tests
QUnit.only( "laser", function( assert ) {
  assert.ok( this.robot.laser() );
});

QUnit.only( "other laser", function( assert ) {
  assert.ok( this.robot.otherLaser() );
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

// You're currently working on the laser feature, so we run only these tests
only( "laser", function( t ) {
  t.ok( this.robot.laser() );
});

only( "other laser", function( t ) {
  t.ok( this.robot.otherLaser() );
});
```
