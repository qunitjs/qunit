---
layout: page-api
title: QUnit.config.notrycatch
excerpt: Disable handling of uncaught exceptions during tests.
groups:
  - config
redirect_from:
  - "/config/notrycatch/"
version_added: "1.0.0"
---

Disable handling of uncaught exceptions during tests.

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

This option can also be controlled via the [HTML Reporter](../../browser.md) interface, and is supported as URL query parameter.

</p>

By default, QUnit handles uncaught errors during test execution and reports them as test failures. This allows reporters to reliably summarise results.

Enabling this flag will disable this error handling, allowing your error to become a "native" uncaught exception and thus interrupt QUnit. This can sometimes ease debugging through a browser's developer tools, such as when dealing with breakpoints, or source maps.

