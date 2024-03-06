---
layout: page-api
title: QUnit.config.scrolltop
excerpt: Scroll to the top of the page after the test run (HTML Reporter).
groups:
  - config
redirect_from:
  - "/config/scrolltop/"
version_added: "1.14.0"
---

In the HTML Reporter, ensure the browser is scrolled to the top of the page when the tests are done.

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

By default, QUnit scrolls the browser to the top of the page when tests are done. This reverses any programmatic scrolling performed by the application or its tests.

Set this option to `false` to disable this behaviour, and thus leave the page in its final scroll position.
