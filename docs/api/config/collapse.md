---
layout: page-api
title: QUnit.config.collapse
excerpt: Collapse the details of failing tests after the first one (HTML Reporter).
groups:
  - config
redirect_from:
  - "/config/collapse/"
version_added: "1.0.0"
---

In the HTML Reporter, collapse the details of failing tests after the first one.

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

By default, QUnit's HTML Reporter collapses consecutive failing tests showing only the details for the first failed test. The other tests can be expanded manually with a single click on the test title.

Set this option to `false` to expand the details for all failing tests.
