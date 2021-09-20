---
layout: page-api
title: QUnit.config.hidepassed
excerpt: Hide results of passed tests (HTML Reporter).
groups:
  - config
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

<p class="note" markdown="1">This option can also be controlled via the [HTML Reporter](https://qunitjs.com/intro/#in-the-browser).</p>

By default, the HTML Reporter will list (in collapsd form) the names of all passed tests. Enable this option, to only list failing tests.
