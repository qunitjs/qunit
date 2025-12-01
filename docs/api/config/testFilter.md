---
layout: page-api
title: QUnit.config.testFilter
excerpt: Programmatically filter which tests to run.
groups:
  - config
version_added: "3.0.0"
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
* Dynamically skipping tests based on runtime capabilities
* Loading filter criteria from external sources (APIs, files, etc.)

The callback receives a `testInfo` object and must return a boolean:
* Return `true` to run the test
* Return `false` to skip the test

If the callback throws an error, the error is logged as a warning and the test is skipped.

## Filter hierarchy

The `testFilter` callback runs as part of a layered filtering system:

1. **Test-level filters** run first: [`test.only()`](../QUnit/test.only.md), [`test.skip()`](../QUnit/test.skip.md), [`test.if()`](../QUnit/test.if.md)
2. **Programmatic filter** runs next: `QUnit.config.testFilter`
3. **CLI/URL filters** run last: [`--filter`](./filter.md), [`--module`](./module.md), [`--moduleId`](./moduleId.md), [`--testId`](./testId.md)

This layering enables:
* Test authors to control test execution via `test.only()`, `test.skip()`, `test.if()`
* Project maintainers to implement dynamic filtering via `testFilter`
* Developers to manually filter tests via CLI or browser URL parameters

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

### Runtime capability detection

Skip tests for features not available in the current environment.

```js
const features = {
  webgl: typeof WebGLRenderingContext !== 'undefined',
  indexedDB: typeof indexedDB !== 'undefined'
};

QUnit.config.testFilter = function (testInfo) {
  // Tests tagged with [feature] in their name
  for (const feature in features) {
    const tag = '[' + feature + ']';
    if (testInfo.testName.indexOf(tag) !== -1 && !features[feature]) {
      console.log('[FEATURE] Skipping ' + feature + ' test');
      return false;
    }
  }
  return true;
};

QUnit.test('[webgl] 3D rendering', function (assert) {
  // Only runs if WebGL is available
  assert.ok(true);
});
```

### Combine multiple conditions

```js
const quarantined = ['flaky test'];

QUnit.config.testFilter = function (testInfo) {
  // Skip quarantined tests
  if (quarantined.some(function (p) { return testInfo.testName.indexOf(p) !== -1; })) {
    return false;
  }

  // Skip slow tests in quick mode
  if (process.env.QUICK_RUN && testInfo.testName.indexOf('slow') !== -1) {
    return false;
  }

  // Filter by module if specified
  if (process.env.TEST_MODULE && testInfo.module.indexOf(process.env.TEST_MODULE) === -1) {
    return false;
  }

  return true;
};
```
