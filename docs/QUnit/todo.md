---
layout: default
title: todo
description: Adds a test which expects at least one failing assertion during its run.
categories:
  - main
---

## `QUnit.todo( name, callback )`

Adds a test which expects at least one failing assertion during its run.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `callback` (function) | Function to close over assertions |

#### Callback parameters: `callback( assert )`:

| parameter | description |
|-----------|-------------|
| `assert` (object) | A new instance object with the [assertion methods](/assert) |

### Description

Use this method to test a unit of code which is still under development (in a "todo" state). The test will pass as long as one failing assertion is present.

If all assertions pass, then the test will fail signaling that `QUnit.todo` should be replaced by `QUnit.test`.

### Example

How to use `QUnit.todo` to denote code that is still under development.

```js
QUnit.module( "robot", {
  beforeEach: function() {
    this.robot = new Robot();
  }
});

// fireLazer hasn't been properly implemented yet, so this is a todo test
QUnit.todo( "fireLazer returns the correct value", function( assert ) {
  var result = this.robot.fireLazer(); // Currently returns undefined
  assert.equal( result, "I'm firing my lazer!" );
});
```
