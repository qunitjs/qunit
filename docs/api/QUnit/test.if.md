---
layout: page-api
title: QUnit.test.if()
excerpt: Add a test that may be skipped.
groups:
  - main
redirect_from:
  - "/QUnit/test.if/"
version_added: "2.22.0"
---

`QUnit.test.if( name, condition, callback )`

Add a test that only runs if a condition is true.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `condition` (string) | Expression to decide if the test should run |
| `callback` (function) | Function that performs the test |

If the condition is true, this is equivalent to calling [`QUnit.test()`](./test.md).

If the conditional is false, this is equivalent to calling [`QUnit.test.skip()`](./test.skip.md), and test will not run. Instead, it will be listed in the results as a "skipped" test.

Use cases:
* Skip tests for a feature not supported in an older browser, when cross-browser testing in CI.
* Skip tests for code that relies on an optional dependency.
* Skip tests for an optional integration on one operating system, when testing a cross-platform application on Linux, macOS, and Windows.

You can use [`QUnit.module.if()`](./module.md) to skip several tests or nested modules at once, without repeating the same condition.

## Examples

### Feature test

This is an example that automatically skips a test in environments where [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial) is unsupported. For example, if you do cross-browser testing in CI and support older browsers in your project, you can use this to cover optional features for newer browsers that are expected to fail in older browsers.

```js
QUnit.module('MyApp');

QUnit.test.if('drawCanvas [red square]', typeof WebGLRenderingContext !== 'undefined', function (assert) {
  const canvas = MyApp.drawCanvas();
  assert.pixelEqual(canvas, 10, 10, 255, 0, 0);
  assert.pixelEqual(canvas, 20, 20, 255, 0, 0);
});
```

### Skip a test

This example is for a library that targets both browsers and Node.js, where this test is for a feature that is only meant to work in browsers, and naturally skipped when the test suite is run in Node.js.

```js
QUnit.module('MyApp');

// Browser-only test, skipped if executed without a DOM
QUnit.test.if('render', typeof document !== 'undefined', function (assert) {
  assert.strictEqual(MyApp.render(), '<p>Hello world!</p>');
});
```

This is equivalent to:

```js
QUnit.module('MyApp');

if (typeof document !== 'undefined') {
  QUnit.test('render', function (assert) {
    assert.strictEqual(MyApp.render(), '<p>Hello world!</p>');
  });
} else {
  QUnit.test.skip('render');
}
```

<span id="conditional-module"></span>
Use [`QUnit.module.if()`](./module.md), to conditionally skip all tests in a given module.

```js
QUnit.module.if('MyApp', typeof document !== 'undefined');

QUnit.test('render', function (assert) {
  assert.strictEqual(MyApp.render(), '<p>Hello world!</p>');
});
```

### Legacy idiom

Prior to QUnit 2.22, the following shortcuts were sometimes used. This may be replaced by `QUnit.test.if()`.

```js
(typeof document !== 'undefined' ? QUnit.test : QUnit.skip)('example', function (assert) {
  assert.true(true);
});

QUnit[typeof document !== 'undefined' ? 'test' : 'skip']('example', function (assert) {
  assert.strue(true);
});
```
