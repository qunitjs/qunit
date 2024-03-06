---
layout: page-api
title: QUnit.hooks
excerpt: Add global callbacks to run before or after each test.
groups:
  - extension
redirect_from:
  - "/QUnit/hooks/"
version_added: "2.18.0"
---

`QUnit.hooks.beforeEach( callback )`<br>
`QUnit.hooks.afterEach( callback )`

Register a global callback to run before or after each test.

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Called with an [assert](../assert/index.md) argument. |

This is the equivalent of applying a `QUnit.module()` hook to all modules and all tests, including global tests that are not associated with any module.

Similar to module hooks, global hooks support async functions or returning a Promise, which will be waited for before QUnit continues executing tests. Each global hook also has access to the same `assert` object and test context as the [QUnit.test](./test.md) that the hook is running for.

For more details about hooks, refer to [QUnit.module § Hooks](./module.md#hooks).

## Examples

```js
QUnit.hooks.beforeEach(function () {
  this.app = new MyApp();
});

QUnit.hooks.afterEach(async function (assert) {
  assert.deepEqual([], await this.app.getErrors(), 'MyApp errors');

  MyApp.reset();
});
```
