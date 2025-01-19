---
layout: page-api
title: QUnit.reporters.console
excerpt: |
  The console reporter logs a JSON object from all `QUnit.on()` reporting events.

  ```
  runStart {…}
  testStart {…}
  testEnd {…}
  testStart {…}
  testEnd {…}
  runEnd {…}
  ```
groups:
  - reporters
version_added: "2.3.0"
---

The **console** reporter logs a JSON object from all [`QUnit.on`](../callbacks/QUnit.on.md) reporting events.

Use this to explore or debug the [QUnit event emitter](../callbacks/QUnit.on.md).

## Example

```
runStart {…}
testStart {…}
testEnd {…}
testStart {…}
testEnd {…}
runEnd {…}
```

## Usage

[QUnit CLI](../../cli.md#qunit-cli-options):

```sh
qunit --reporter console test/
```

Enable manually in JavaScript code:

```js
QUnit.reporters.console.init(QUnit);
```

Enable declaratively via [QUnit.config](../config/index.md):

```js
// Preconfig:
// Set as environment variable to Node.js,
// or as global variable before loading qunit.js
qunit_config_reporters_console = true;

// Config: Set from any inline script or JS file after qunit.js
QUnit.config.reporters.console = true;
```

## Changelog

| UNRELEASED | Enable declaratively via [`QUnit.config.reporters`](../config/reporters.md).
| [QUnit 2.16.0](https://github.com/qunitjs/qunit/releases/tag/2.16.0) | Exposed as `QUnit.reporters.perf` for programmatic usage.
| [QUnit 2.3.0](https://github.com/qunitjs/qunit/releases/tag/2.3.0) | Introduced as part of the QUnit CLI and `--reporter console`.
