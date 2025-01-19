---
layout: page-api
title: QUnit.reporters.html
excerpt: The HTML Reporter provides a toolbar, renders test results, diffs, and more.
groups:
  - reporters
version_added: "1.0.0"
---

The **html** reporter renders a toolbar that lets you filter which modules or tests run, visualizes test results with diffs, provides "Rerun" links for individual tests, and more. This is enabled by default in [Browser](../../browser.md) environments

The HTML Reporter is documented in detail at [Browser § HTML Reporter](../../browser.md#lead).

## Usage

By default, the [HTML Reporter](../../browser.md#lead) is automatically enabled in browser environments if a `<div id="qunit">` element exists. If such element doesn't exist, it remains disabled ("headless").

You can override this and disable the HTML Reporter even if the element does exist. For example, to share and reuse the same HTML file for CI, debugging, and manual testing; but disable the HTML Reporter in CI for improved performance.

### Example

```js
// Preconfig: Set as global variable before loading qunit.js
qunit_config_reporters_html = false;
```

Or
```js
// Config: Set from any inline script or JS file after qunit.js
QUnit.config.reporters.html = false;
```

## Changelog

| UNRELEASED | Toggle declaratively via [`QUnit.config.reporters`](../config/reporters.md).
| [QUnit 1.0.0](https://github.com/qunitjs/qunit/releases/tag/1.0.0) | Initial release.
