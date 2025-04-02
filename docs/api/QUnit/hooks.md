---
layout: page-api
title: QUnit.hooks
excerpt: Add global callbacks to run before or after every test.
groups:
  - extension
redirect_from:
  - "/QUnit/hooks/"
version_added: "2.18.0"
---

`QUnit.hooks.beforeEach( callback )`<br>
`QUnit.hooks.afterEach( callback )`

Register a global callback to run before or after every test.

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Called with an [assert](../assert/index.md) argument. |

This is the equivalent of adding a hook in all modules, and all tests, including global tests that are not grouped in a module.

As with module hooks, global hooks may be async functions or return a Promise, which will be waited for before QUnit continues executing tests. Each global hook also has access to the same `assert` object and test context as the [QUnit.test](./test.md) that the hook is running for.

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
