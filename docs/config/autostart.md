---
layout: page-api
title: QUnit.config.autostart
excerpt: Start running the tests once all files have been loaded.
groups:
  - config
version_added: "1.0.0"
---

Start running the tests once all files have been loaded.

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

By default, QUnit starts running the tests when `load` event is triggered on the `window` (in the browser), or after all specified files have been imported (in the CLI).

Set this property to `false` if you load your test files asynchronously through custom means (e.g. RequireJS). Remember to call `QUnit.start()` once you're ready for tests to begin running.

## Example

Disable autostart when loading tests asynchronously, such as when using RequireJS:

```js
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
