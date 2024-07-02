---
layout: page-api
title: QUnit.test.if()
excerpt: Add a test that may be skipped.
groups:
  - main
redirect_from:
  - "/QUnit/test.if/"
version_added: "unreleased"
---

`QUnit.test.if( name, condition, callback )`

Add a test that only runs if a condition is true.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `condition` (string) | Expression to decide if the test should be run |
| `callback` (function) | Function that performs the test |

If the condition is true, this is equivalent to calling [`QUnit.test()`](./test.md).

If the conditional is false, this is equivalent to calling [`QUnit.test.skip()`](./test.skip.md), and test will not run. Instead, it be listed in the results as a "skipped" test.

As a codebase becomes bigger, you may need to conditionally skip an entire group of tests. You can use [`QUnit.module.if()`](./module.md) to recursively skip all tests in a module based on a given condition.

## Examples

```js
QUnit.module('MyApp');

// Skip if executed without a DOM
QUnit.test.if('render', typeof document !== 'undefined', function (assert) {
  assert.strictEqual(MyApp.render(), '<p>Hello world!</p>');
});
```

```js
QUnit.module.if('MyApp', typeof document !== 'undefined');

QUnit.test('render', function (assert) {
  assert.strictEqual(MyApp.render(), '<p>Hello world!</p>');
});
```
