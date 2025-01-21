---
layout: page-api
title: QUnit.reporters.tap
excerpt: |
  The tap reporter is default in the QUnit CLI and enables pairing QUnit with an ecosystem of TAP-based reporters and other tools.

  ```tap
  TAP version 13
  ok 1 add > two numbers
  1..1
  # pass 1
  # skip 0
  # todo 0
  # fail 0
  ```
groups:
  - reporters
version_added: "2.16.0"
---

The **tap** reporter formats test results according to the [TAP specification](https://testanything.org/), and prints them to the console. It enables pairing QUnit with any tools from the TAP-based ecosystem.

## Example

```tap
TAP version 13
ok 1 add > two numbers
1..1
# pass 1
# skip 0
# todo 0
# fail 0
```

## Command-line

This is the default in the [QUnit CLI](../../cli.md). This allows you to pair QUnit with any [TAP-based reporters](https://github.com/sindresorhus/awesome-tap#reporters), by piping the output. For example:

```sh
qunit test/ | tap-min
```

See also [QUnit CLI § reporter](../../cli.md#qunit-cli-options).

## Enable

Declaratively enable the TAP reporter in a browser environment, or in a custom Node.js runner, e.g. for use with TAP-based tooling such as [Airtap](https://github.com/airtap/airtap), or [karma-tap](https://github.com/bySabi/karma-tap).

```js
// Preconfig:
// Set as environment variable to Node.js,
// or as global variable before loading qunit.js
qunit_config_reporters_tap = true;
```

Enable via [QUnit.config](../config/index.md):

```js
// Config: Set from any inline script or JS file after qunit.js
QUnit.config.reporters.tap = true;
```

Enable manually, since QUnit 2.16:

```js
QUnit.reporters.tap.init(QUnit);
```

## Changelog

| [QUnit 2.24.0](https://github.com/qunitjs/qunit/releases/tag/2.24.0) | Enable declaratively via [`QUnit.config.reporters`](../config/reporters.md).
| [QUnit 2.16.0](https://github.com/qunitjs/qunit/releases/tag/2.16.0) | Exposed as `QUnit.reporters.tap` for programmatic use in browsers or Node.js.
| [QUnit 2.3.0](https://github.com/qunitjs/qunit/releases/tag/2.3.0) | Introduced as part of the QUnit CLI.
