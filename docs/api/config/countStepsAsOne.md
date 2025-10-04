---
layout: page-api
title: QUnit.config.countStepsAsOne
excerpt: Count assert.verifySteps() as one assertion for the assert.expect() count.
groups:
  - config
redirect_from:
  - "/config/countStepsAsOne/"
version_added: "2.21.1"
---

Count `assert.verifySteps()` as one assertion for the `assert.expect()` count.

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

If you have tests that use both `assert.expect()` and `assert.step()` with [`assert.verifySteps()`](../assert/verifySteps.md) in the same test, you may encounter the following warning on QUnit 2.x:

```
Counting each assert.step() for assert.expect() is changing
in QUnit 3.0. Omit assert.expect() from tests that use assert.step(),
or enable QUnit.config.countStepsAsOne to prepare for the upgrade.
```

Refer to [assert.expect(): Migration guide](../assert/expect.md#migration-countstepsasone) for before and after examples.
