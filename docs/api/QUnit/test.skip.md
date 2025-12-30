---
layout: page-api
title: QUnit.test.skip()
excerpt: Define a test that will be skipped.
groups:
  - main
redirect_from:
  - "/QUnit.skip/"
  - "/QUnit/skip/"
  - "/QUnit/test.skip/"
version_added: "1.16.0"
---

`QUnit.test.skip( name )`<br/>
`QUnit.test.skip( name, callback )`<br/>
`QUnit.skip( name )`<br/>
`QUnit.skip( name, callback )`

Define a test that will be skipped. Use this to disable a known broken or "flaky" test case.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit |
| `callback` (function) | Optional, function that would perform the test |

The callback and any module hooks do not run for a skipped test. The name of your test will be included in results as a "skipped" test. This serves as a reminder to contributors. This is often preferred over the alternative of commenting out a test, because the code in the test will remain discoverable through static analysis and code search, and encourages inclusion during refactors and IDE automation.

In larger codebases, you may need to temporarily disable a group of tests at once. You can use [`QUnit.module.skip()`](./module.md) to recursively skip all tests in a module.

## See also

* [`QUnit.test.if( name, condition, callback )`](./test.if.md)

## Changelog

| [QUnit 2.12](https://github.com/qunitjs/qunit/releases/tag/2.12.0) | The `QUnit.skip()` method was renamed to `QUnit.test.skip()`.<br/>Use of `QUnit.skip()` remains supported as an alias.
| [QUnit 1.16](https://github.com/qunitjs/qunit/releases/tag/1.16.0) | The `QUnit.skip()` method was introduced.

## Examples

How to use `skip` as a placeholder for future tests, or to temporarily skip a broken test.

```js
QUnit.module('robot', (hooks) => {
  let robot;
  hooks.beforeEach(() => {
    robot = new Robot();
  });

  QUnit.test('say', (assert) => {
    assert.strictEqual(robot.say(), 'Exterminate!');
  });

  // Robot does not yet have a laser() method yet, skip this test for now
  QUnit.test.skip('laser', (assert) => {
    assert.true(robot.laser());
  });

  // TODO: Implement this later!
  QUnit.test.skip('jump');
});
```
