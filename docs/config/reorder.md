---
layout: default
title: QUnit.config.reorder
excerpt: Allow re-running of previously failed tests out of order.
categories:
  - config
version_added: "1.0.0"
---

Allow re-running of previously failed tests out of order, before all other tests.

### Description

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

By default, QUnit will first re-run any tests that failed on a previous run. For large test suites, this can speed up your feedback cycle by a lot.

Note that this feature may lead to unexpected failures if you have non-atomic tests that rely on a very specific execution order. You should consider improving such tests, but this option allows you to disable the reordering behaviour.

When a previously failed test is running first, the HTML Reporter displays "_Rerunning previously failed test_" in the summary whereas just "_Running_" is displayed otherwise.
