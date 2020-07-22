---
layout: default
title: QUnit.skip()
description: Add a test that will be skipped.
categories:
  - main
---

`QUnit.skip( name )`

Add a test, similar to `QUnit.test`, but that will be skipped.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |

### Description

Use this method to replace [`QUnit.test()`](./test.md) instead of commenting out entire tests.

This test will be listed on the results as a skipped test. The callback and the respective module's hooks will not run.

As the codebase becomes bigger, you may sometimes want to temporarily disable an entire group of tests at once. You can use [`QUnit.module.skip()`](./module.md) to recursively skip an entire module.

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
