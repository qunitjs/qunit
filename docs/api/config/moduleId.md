---
layout: page-api
title: QUnit.config.moduleId
excerpt: Select one or more modules to run, by their internal ID (HTML Reporter).
groups:
  - config
redirect_from:
  - "/config/moduleId/"
version_added: "1.23.0"
---

Used by the HTML Reporter, this selects one or more modules by their internal ID to run exclusively.

<table>
<tr>
  <th>type</th>
  <td markdown="span">`array` or `undefined`</td>
</tr>
<tr>
  <th>default</th>
  <td markdown="span">`undefined`</td>
</tr>
</table>

<p class="note" markdown="1">

This option can be controlled via the [HTML Reporter](../../browser.md) interface.

</p>

Specify modules by their internally hashed identifier for a given module. You can specify one or multiple modules to run. This option powers the multi-select dropdown menu in the HTML Reporter.

See also:
* [QUnit.config.module](./module.md)
* [QUnit.config.testId](./testId.md)
