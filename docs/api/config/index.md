---
layout: group
group: config
title: QUnit.config
excerpt: General configuration options for QUnit.
amethyst:
  # Override inherited "pagetype: navigation" to enable TypeSense indexing
  pagetype: custom
  robots: index
redirect_from:
  - "/QUnit.config/"
  - "/config/"
  - "/config/QUnit.config/"
  - "/category/config/"
---

## Order

Configurations are read in the following order:

1. Default values
2. Flat preconfig
3. Object preconfig
4. Runner options (URL parameters in the HTML Reporter, or CLI options in the QUnit CLI)
5. Set `QUnit.config` from your own inline or bootstrap script.

## Set configuration

You can configure the test run via the `QUnit.config` object. In the HTML Runner, you can set the configuration from any script after qunit.js:

```html
<!DOCTYPE html>
<head>
  <meta charset="utf-8">
  <title>QUnit</title>
  <link rel="stylesheet" href="/lib/qunit/qunit.css">
</head>
<body>
  <div id="qunit"></div>
  <script src="/lib/qunit/qunit.js"></script>
  <script>
  QUnit.config.reorder = false;
  </script>
  <script src="/src/app.js"></script>
  <script src="/test/bootstrap.js"></script>
  <script src="/test/app.test.js"></script>
</body>
```

If you have custom plugins or want to re-use your configuration across multiple HTML test suites, you can also configure your project from an external `/test/bootstrap.js` script. Make sure to place this script before your other test files.

When using the [QUnit CLI](https://qunitjs.com/cli/), you can setup your project and configure QUnit via [`--require`](https://qunitjs.com/cli/#--require).

```bash
qunit --require ./test/bootstrap.js
```
```js
// test/bootstrap.js
QUnit.config.noglobals = true;
QUnit.config.notrycatch = true;

const MyApp = require('../');
MyApp.setAccount('TestUser');
```

## Preconfiguration

Preconfiguration allows you to define QUnit configuration via global variables or environment variables, before QUnit itself is loaded.

This is the recommended approach for general purpose test runners and integrations, as it provides a reliable way to override the default configuration. This can be especially useful if the end-user may control the loading of QUnit, possibly asynchronously, or through custom means, where it would be difficult to inject your overrides at the "right" time (after QUnit loads, but before any user code).

Preconfig allows integrations to declare configuration without needing to embed, wrap, adapt, modify, or otherwise control the loading of QUnit itself. This in turn allows integrations to easily support use of standalone HTML test suites, that developers can also run and debug in the browser directly, without depending on or needing to install and set up any specific integration system.

### Flat preconfig

*Version added: [QUnit 2.21.0](https://github.com/qunitjs/qunit/releases/tag/2.21.0)*.

Flat preconfig allows multiple integrations to seemlessly collaborate, without the risk of projects accidentally unsetting an override (as is the case with Object preconfig).

In the browser context (HTML Runner), global variables that start with `qunit_config_` may override the default value of a configuration option. The following inline script (before loading QUnit), is equivalent to setting `QUnit.config.hidepassed = true; QUnit.config.seed = 'd84af39036'; QUnit.config.testTimeout = 1000;`

```html
<script>
qunit_config_hidepassed = true;
qunit_config_seed = 'd84af39036';
qunit_config_testtimeout = 1000;
</script>
```

For the [QUnit CLI](../../cli.md) and other Node.js runners, the same can also be done via environment variables. Environment variables must be set in the shell before running the `qunit` or `node` command. The variable names are case-sensitive and must be in lowercase. You may set boolean configuration variables using the string `true` or `false`.

```bash
export qunit_config_noglobals=true
export qunit_config_filter=foo
export qunit_config_testtimeout=1000

qunit test.js
```

Or:

```bash
qunit_config_filter=foo qunit_config_testtimeout=1000 qunit test.js
```

Configuration options that are read-only, internal/undocumented, or that require an object value (such as [`QUnit.config.storage`](./storage.md)) cannot be set via environment variables. Options that require an array of strings will be converted to an array holding the given string.

### Object preconfig

*Version added: [2.1.0](https://github.com/qunitjs/qunit/releases/tag/2.1.0)*.

You can create a `QUnit` global variable with a `config` property, before QUnit itself is loaded. Any properties on this `QUnit.config` placeholder object will be carried over and applied to the real `QUnit.config` object once it exists. Any additional properties on the placeholder are ignored.

```js
// Isomorphic global
// For modern browsers, SpiderMonkey, and Node.js (including strict mode).
globalThis.QUnit = {
  config: {
    autostart: false,
    maxDepth: 12
  }
};

// Browser global
// Supported in all browsers (including old browsers, and strict mode).
window.QUnit = { /* config: .. */ };

// Implicit global
// Supported everywhere, including old browsers. (But not ES strict mode.)
QUnit = { /* config: .. */ };
```

### Changelog

| [QUnit 2.21.0](https://github.com/qunitjs/qunit/releases/tag/2.21.0) | Added flat preconfig.
| [QUnit 2.18.1](https://github.com/qunitjs/qunit/releases/tag/2.18.1) | Added object preconfig support for Node.js, SpiderMonkey, and other environments.<br/>Previously, it was limited to the browser environment.
| [QUnit 2.1.0](https://github.com/qunitjs/qunit/releases/tag/2.1.0) | Introduce object preconfig feature.
