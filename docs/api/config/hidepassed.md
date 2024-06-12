---
layout: page-api
title: QUnit.config.hidepassed
excerpt: Hide results of passed tests (HTML Reporter).
groups:
  - config
redirect_from:
  - "/config/hidepassed/"
version_added: "1.0.0"
---

In the HTML Reporter, hide results of passed tests.

<table>
<tr>
  <th>type</th>
  <td markdown="span">`boolean`</td>
</tr>
<tr>
  <th>default</th>
  <td markdown="span">`false`</td>
</tr>
</table>

<p class="note" markdown="1">

This option can also be controlled via the [HTML Reporter](../../browser.md).

</p>

By default, the HTML Reporter will list both passing and failing tests. Passing tests are by default collapsed to display only their name. Enable `hidepassed` to hide passing tests completely, and show only failing tests in the list.

## See also

* [QUnit.config.collapse](./collapse.md)
