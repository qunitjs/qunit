---
layout: default
title: skip
description: Adds a test like object to be skipped
categories:
  - main
---

## `QUnit.skip( name )`

Adds a test like object to be skipped

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |

### Description

Use this method to replace [`QUnit.test()`](/QUnit/test) instead of commenting out entire tests.

This test's prototype will be listed on the suite as a skipped test, ignoring the callback argument and the respective global and module's hooks.

### Example

How to use `skip` as a placeholder for future or temporarily broken tests.

```js
QUnit.module( "robot", {
  beforeEach: function() {
    this.robot = new Robot();
  }
});

QUnit.test( "say", function( assert ) {
  assert.strictEqual( this.robot.say(), "Exterminate!" );
});

// Robot doesn't have a laser method, yet, skip this test
// Will show up as skipped in the results
QUnit.skip( "laser", function( assert ) {
  assert.ok( this.robot.laser() );
});
```

Using modern syntax:

```js
const { test, skip } = QUnit;

QUnit.module( "robot", {
  beforeEach() {
    this.robot = new Robot();
  }
});

test( "say", function( t ) {
  t.strictEqual( this.robot.say(), "Exterminate!" );
});

// Robot doesn't have a laser method, yet, skip this test
// Will show up as skipped in the results
skip( "laser", function( t ) {
  t.ok( this.robot.laser() );
});
```
