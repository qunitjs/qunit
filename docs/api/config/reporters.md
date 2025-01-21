---
layout: page-api
title: QUnit.config.reporters
excerpt: Control which reporters to enable or disable.
groups:
  - config
redirect_from:
  - "/config/reporters/"
version_added: "2.24.0"
---

Control which reporters to enable or disable.

<table>
<tr>
  <th>type</th>
  <td markdown="span">`Object<string,bool>`</td>
</tr>
<tr>
  <th>default</th>
  <td markdown="span">`{}`</td>
</tr>
</table>

## Built-in reporters

* [`tap`](../reporters/tap.md)
* [`console`](../reporters/console.md)
* [`perf`](../reporters/perf.md)
* [`html`](../reporters/html.md)

## Example

Enable TAP in the browser via [preconfig](./index.md#preconfiguration):
```js
// Set as global variable before loading qunit.js
qunit_config_reporters_tap = true;
```

Or, via [QUnit.config](../config/index.md):

```js
// Set from any inline script or JS file after qunit.js
QUnit.config.reporters.tap = true;
```
