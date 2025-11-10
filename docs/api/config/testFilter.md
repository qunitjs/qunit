---
layout: page-api
title: QUnit.config.testFilter
excerpt: Programmatically filter which tests to run.
groups:
  - config
version_added: "2.25.0"
---

Programmatically filter which tests to run.

<table>
<tr>
  <th>type</th>
  <td markdown="span">`function` or `null`</td>
</tr>
<tr>
  <th>default</th>
  <td markdown="span">`null`</td>
</tr>
</table>

The `testFilter` property allows you to implement custom logic for filtering which tests to run at runtime. This is useful for advanced scenarios such as:

* Quarantining flaky tests in CI environments
* Distributing tests across parallel workers
* Loading filter criteria from external sources (APIs, files, etc.)

The callback receives a `testInfo` object and must return a boolean:
* Return `true` to run the test
* Return `false` to skip the test

If the callback throws an error, the error is logged as a warning and the test is skipped.

## Parameters

### `testInfo` (object)

| Property | Type | Description |
|----------|------|-------------|
| `testId` | string | Internal hash identifier (used by "Rerun" links)
| `testName` | string | Name of the test
| `module` | string | Name of the parent module
| `skip` | boolean | Whether test was already marked to skip

## See also

* [QUnit.config.filter](./filter.md)
* [QUnit.config.module](./module.md)
* [test.if()](../QUnit/test.if.md)

## Examples

### Quarantine flaky tests

Use an external quarantine list to skip unstable tests in CI without modifying test code.

```js
const quarantineList = ['flaky network test', 'timing-dependent test'];

QUnit.config.testFilter = function (testInfo) {
  if (process.env.CI === 'true') {
    const isQuarantined = quarantineList.some(function (pattern) {
      return testInfo.testName.indexOf(pattern) !== -1;
    });
    if (isQuarantined) {
      console.log('[QUARANTINE] Skipping: ' + testInfo.testName);
      return false;
    }
  }
  return true;
};
```

### Parallel test sharding

Distribute tests across multiple workers using deterministic hash-based assignment.

```js
const WORKER_ID = parseInt(process.env.WORKER_ID, 10);
const TOTAL_WORKERS = parseInt(process.env.TOTAL_WORKERS, 10);

QUnit.config.testFilter = function (testInfo) {
  let hash = 0;
  for (let i = 0; i < testInfo.testId.length; i++) {
    const char = testInfo.testId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  hash = Math.abs(hash);

  // Assign test to worker
  const assignedWorker = hash % TOTAL_WORKERS;
  return assignedWorker === WORKER_ID;
};
```
