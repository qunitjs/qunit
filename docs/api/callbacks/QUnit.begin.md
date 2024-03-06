---
layout: page-api
title: QUnit.begin()
excerpt: Register a callback to fire when the test run begins.
groups:
  - callbacks
redirect_from:
  - "/callbacks/QUnit.begin/"
  - "/QUnit.begin/"
version_added: "1.0.0"
---

`QUnit.begin( callback )`

Register a callback to fire when the test run begins. The callback may be an async function, or a function that returns a Promise, which will be waited for before the next callback is handled.

The callback will be called once, before QUnit runs any tests.

| parameter | description |
|-----------|-------------|
| `callback` (function) | Callback to execute, called with a `details` object. |

### Details object

| property | description |
|-----------|-------------|
| `totalTests` (number) | Number of registered tests |
| `modules` (array) | List of registered modules,<br>as  `{ name: string, moduleId: string }` objects. |

## Changelog

| [QUnit 2.19.0](https://github.com/qunitjs/qunit/releases/tag/2.19.0) | Added `moduleId` to the `details.modules` objects.
| [QUnit 1.16](https://github.com/qunitjs/qunit/releases/tag/1.16.0) | Added `details.modules` property, containing `{ name: string }` objects.
| [QUnit 1.15](https://github.com/qunitjs/qunit/releases/tag/1.15.0) | Added `details.totalTests` property.

## Examples

Get total number of tests known at the start.

```js
QUnit.begin(details => {
  console.log(`Test amount: ${details.totalTests}`);
});
```

Use async-await to wait for some asynchronous work:

```js
QUnit.begin(async details => {
  await someAsyncWork();

  console.log(`Test amount: ${details.totalTests}`);
});
```

Using classic ES5 syntax:

```js
QUnit.begin(function (details) {
  console.log('Test amount:' + details.totalTests);
});
```

```js
function someAsyncWork () {
  return new Promise(function (resolve, reject) {
    // do some async work
    resolve();
  });
}

QUnit.begin(function (details) {
  return someAsyncWork().then(function () {
    console.log('Test amount:' + details.totalTests);
  });
});
```
