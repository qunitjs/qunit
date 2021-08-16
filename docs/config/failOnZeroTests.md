---
layout: page-api
title: QUnit.config.failOnZeroTests
excerpt: Fail the test run if no tests were run.
groups:
  - config
version_added: "2.16.0"
---

Whether to fail the test run if no tests were run.

## Description

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

By default, it is considered an error if no tests were loaded, or if no tests matched the current filter.

Set this option to `false` to let an empty test run result in a success instead.
