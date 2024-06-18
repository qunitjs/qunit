---
layout: page-api
title: QUnit.config.autostart
excerpt: Control when the test run may start.
groups:
  - config
redirect_from:
  - "/config/autostart/"
version_added: "1.0.0"
---

Control when the test run may start, e.g. after asynchronously loading test files with RequireJS, AMD, ES6 dynamic imports, or other means.

<table>
<tr>
  <th>type</th>
  <td markdown="span">`boolean`</td>
</tr>
<tr>
  <th>default</th>
  <td markdown="span">`true`</td>
</tr>
</table>

In the browser, QUnit by default waits for all `<script>`  elements to finish loading (by means of the window `load` event). When using the QUnit CLI, it waits until the specified files are imported.

Set this property to `false` to instruct QUnit to wait longer, allowing you to load test files asynchronously. Remember to call [`QUnit.start()`](../QUnit/start.md) once you're ready for tests to begin running.

## Examples

### Error: Unexpected test after runEnd {#E0001}

If tests are new tests defined after QUnit has finished its run, you may encounter this error:

```
Error: Unexpected test after runEnd.
```

If you load test files asynchronously, make sure to disable autostart and call [`QUnit.start()`](../QUnit/start.md) accordingly.

If you encounter this error unrelated to autostart, it might be that you're dynamically registering a new [QUnit.test](../QUnit/test.md) from inside a hook or event callback towards the end of the test run, such as `hooks.after()` or `QUnit.done()`. It is recommended to define dynamic tests via [`QUnit.begin()`](../callbacks/QUnit.begin.md) instead. ([#1663](https://github.com/qunitjs/qunit/issues/1663))

To report global errors from a plugin or other integration layer, consider calling [QUnit.onUncaughtException()](../extension/QUnit.onUncaughtException.md) instead.

### ESM Dynamic imports

This example uses the [import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) operator to dynamically load ECMAScript module (ESM) files.

```html
<script src="../lib/qunit.js"></script>
<script type="module" src="tests.js"></script>
```

```js
// tests.js
QUnit.config.autostart = false;

Promise.all([
  import('./foo.js'),
  import('./bar.js')
]).then(function () {
  QUnit.start();
});
```

### Loading with RequireJS

This example uses [RequireJS](https://requirejs.org/) to load your test files through the `require()` function (as defined in the [AMD specification](https://github.com/amdjs/amdjs-api/blob/master/require.md)).

It is recommended to load QUnit itself before RequireJS. See also [RequireJS wiki](https://github.com/requirejs/requirejs/wiki/Test-frameworks).

```html
<!DOCTYPE html>
<meta charset="utf-8">
<title>QUnit</title>
<link rel="stylesheet" href="./lib/qunit.css">
<body>
  <div id="qunit"></div>
  <script src="../lib/qunit.js"></script>
  <script src="../lib/requirejs/require.js"></script>
  <script src="tests.js"></script>
</body>
```
```js
// tests.js
QUnit.config.autostart = false;

require(
  [
    'tests/testModule1',
    'tests/testModule2'
  ],
  function () {
    QUnit.start();
  }
);
```
