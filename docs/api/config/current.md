---
layout: page-api
title: QUnit.config.current
excerpt: Internal object representing the currently running test.
groups:
  - config
  - extension
redirect_from:
  - "/config/current/"
version_added: "1.0.0"
---

Internal object representing the currently running test.

<table>
<tr>
  <th>type</th>
  <td markdown="span">`undefined` or `object` (read-only)</td>
</tr>
</table>

This object is not a configuration option, but is exposed under `QUnit.config` for use by plugins and other integrations. This offers access to QUnit's internal `Test` object at runtime.

## Properties

| name | description |
|------|-------------|
| `testName` (string) | Name of the currently-running test, as passed to [QUnit.test](../QUnit/test.md).
| `testId` (string) | Internal ID, used by [QUnit.config.testId](./testId.md) to power "Rerun" links and the HTML API in the [HTML Reporter](../../browser.md).

Other properties may change without notice. When possible, use [QUnit.on](../callbacks/QUnit.on.md) or [event callbacks](../callbacks/index.md) instead.

## Changelog

| [QUnit 1.16](https://github.com/qunitjs/qunit/releases/tag/1.16.0) | Added `testId` property.


## Example

Access `QUnit.config.current.testName` to observe the currently running test's name.

```js
function whatsUp () {
  console.log(QUnit.config.current.testName); // "example"
}

QUnit.test('example', function (assert) {
  whatsUp();

  assert.true(true);
});
```
