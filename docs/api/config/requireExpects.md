---
layout: page-api
title: QUnit.config.requireExpects
excerpt: Fail tests that don't specify how many assertions they expect.
groups:
  - config
redirect_from:
  - "/config/requireExpects/"
version_added: "1.7.0"
---

Fail tests that don't specify how many assertions they expect.

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

Enabling this option will cause tests to fail if they don't call [`assert.expect()`](../assert/expect.md).
