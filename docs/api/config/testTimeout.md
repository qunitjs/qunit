---
layout: page-api
title: QUnit.config.testTimeout
excerpt: Set a global default timeout after which a test will fail.
groups:
  - config
redirect_from:
  - "/config/testTimeout/"
version_added: "1.0.0"
---

Set a global default timeout in milliseconds after which a test will fail. This helps to detect async tests that are broken, and prevents tests from running indefinitely.

<table>
<tr>
  <th>type</th>
  <td markdown="span">`number` or `undefined`</td>
</tr>
<tr>
  <th>default</th>
  <td markdown="span">`undefined`</td>
</tr>
</table>

This can be overridden on a per-test basis via [assert.timeout()](../assert/timeout.md). If you don't have per-test overrides, it is recommended to set this to a relatively high value (e.g. `30000` for 30 seconds) to avoid intermittent test failures from unrelated delays one might in a browser or CI service.
