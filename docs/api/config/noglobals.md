---
layout: page-api
title: QUnit.config.noglobals
excerpt: Check the global object after each test and report new properties as failures.
groups:
  - config
redirect_from:
  - "/config/noglobals/"
version_added: "1.0.0"
---

Check the global object after each test and report new properties as failures.

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

Enable this option to let QUnit keep track of which global variables and properties exist on the global object (e.g. `window` in browsers). When new global properties are found, they will result in test failures to you make sure your application and your tests are not leaking any state.

<p class="note" markdown="1">This option can also be controlled via the [HTML Reporter](../../intro.md#in-the-browser).</p>
