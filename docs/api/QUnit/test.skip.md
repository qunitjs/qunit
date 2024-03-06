---
layout: page-api
title: QUnit.test.skip()
excerpt: Add a test that will be skipped.
groups:
  - main
redirect_from:
  - "/QUnit.skip/"
  - "/QUnit/skip/"
  - "/QUnit/test.skip/"
version_added: "1.16.0"
---

`QUnit.test.skip( name, callback )`<br/>
`QUnit.skip( name, callback )`

Add a test that will be skipped during the run.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `callback` (function) | Function that performs the test |

Use this method to disable a [`QUnit.test()`](./test.md), as alternative to commenting out the test.

This test will be listed in the results as a "skipped" test. The callback and the respective module's hooks will not run.

As a codebase becomes bigger, you may sometimes want to temporarily disable an entire group of tests at once. You can use [`QUnit.module.skip()`](./module.md) to recursively skip all tests in the same module.

## Changelog

| [QUnit 2.12](https://github.com/qunitjs/qunit/releases/tag/2.12.0) | The `QUnit.skip()` method was renamed to `QUnit.test.skip()`.<br/>Use of `QUnit.skip()` remains supported as an alias.
| [QUnit 1.16](https://github.com/qunitjs/qunit/releases/tag/1.16.0) | The `QUnit.skip()` method was introduced.

## Examples

How to use `skip` as a placeholder for future or temporarily broken tests.

```js
QUnit.module('robot', hooks => {
  let robot;
  hooks.beforeEach(() => {
    robot = new Robot();
  });

  QUnit.test('say', assert => {
    assert.strictEqual(robot.say(), 'Exterminate!');
  });

  // Robot does not yet have a laser() method yet, skip this test for now
  QUnit.test.skip('laser', assert => {
    assert.true(robot.laser());
  });
});
```
