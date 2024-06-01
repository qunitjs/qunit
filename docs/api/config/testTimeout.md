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

Set a global default timeout in milliseconds after which a test will fail. This helps to detect async tests that are broken, and prevents a test run from hanging indefinitely.

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

This can be overridden on a per-test basis via [assert.timeout()](../assert/timeout.md).

It is recommended to keep the global default at `3000` (3 seconds) or higher, to avoid intermittent test failures from unrelated delays that may periodically occur inside a browser or CI service.

## Introducing a timeout

Prior to QUnit 3, there has not been a default timeout. This meant that a test could time out or get stuck for many seconds or minutes before diagnostic details are presented (e.g. after a CI job reaches the maximum run time).

QUnit 3.0 will change the default timeout from undefined (Infinity) to 3 seconds.

### Deprecated: No timeout set

Starting in QUnit 2.21, a deprecation warning will be logged if a test takes longer than 3 seconds, when there is no timeout set.

```
Test {name} took longer than 3000ms, but no timeout was set.
```

You can prepare yourself for QUnit 3 when this happens, by calling [assert.timeout()](../assert/timeout.md) inside the slow test, or by setting `QUnit.config.testTimeout` once globally with a higher timeout (in your [HTML or bootstrap script](../config/index.md)).

```js
QUnit.config.testTimeout = 60000; // 1 minute
```

Depending on your test runner of choice, there may be also other convenient ways to set configuration:

* Set `qunit_config_testtimeout` via [preconfig](../config/index.md) as environment variables (for Node.js), or as global variables for HTML/browser environments (before QUnit is loaded).
* Set `testTimeout` via [karma-qunit](https://github.com/karma-runner/karma-qunit/#readme):
  ```js
  config.set({
    frameworks: ['qunit'],
    plugins: ['karma-qunit'],
    client: {
      qunit: {
        testTimeout: 5000
      }
    }
  });
  ```

## Changelog

| [QUnit 2.21.0](https://github.com/qunitjs/qunit/releases/tag/2.21.0) | Announce change of default from undefined to `3000`, with a deprecation warning.
