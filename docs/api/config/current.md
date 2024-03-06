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
  <td markdown="span">`object` (read-only)</td>
</tr>
</table>

This property is not actually a configuration option, but is exposed under `QUnit.config` for use by plugins and other integrations. This offers access to QUnit's internal `Test` object at runtime.

Internals may change without notice. When possible, use [QUnit.on](../callbacks/QUnit.on.md) or [other callbacks](../callbacks/index.md) instead.

## Example

Access `QUnit.config.current.testName` to observe the currently running test's name.

```js
function whatsUp () {
  console.log(QUnit.config.current.testName);
}

QUnit.test('example', assert => {
  whatsUp();

  assert.true(true);
});
```
