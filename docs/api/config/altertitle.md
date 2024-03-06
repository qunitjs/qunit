---
layout: page-api
title: QUnit.config.altertitle
excerpt: Insert a success or failure symbol in the document title (HTML Reporter).
groups:
  - config
redirect_from:
  - "/config/altertitle/"
version_added: "1.0.0"
---

In the HTML Reporter, whether to insert a success or failure symbol in the document title.

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

By default, QUnit updates `document.title` to insert a checkmark or cross symbol to indicate whether the test run passed or failed. This helps quickly spot from the tab bar whether a run passed, without opening it.

If you're integration-testing code that makes changes to `document.title`, or otherwise conflicts with this feature, you can disable it.
