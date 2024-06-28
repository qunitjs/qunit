---
layout: page-api
title: QUnit.config.module
excerpt: Select a single test module to run.
groups:
  - config
redirect_from:
  - "/config/module/"
version_added: "1.8.0"
---

Select a single test module to run by name. The module name must be a complete but case-insensitive match.

<table>
<tr>
  <th>type</th>
  <td markdown="span">`string` or `undefined`</td>
</tr>
<tr>
  <th>default</th>
  <td markdown="span">`undefined`</td>
</tr>
</table>

<p class="note" markdown="1">This option can also be set by URL query parameter.</p>

When specified, only the tests (and nested modules) under the selected module will run. If no module name matches, then no tests will be run.

This option is undefined by default, which means all loaded test modules will be run.

See also:
* [QUnit.config.filter](./filter.md)
* [QUnit.config.moduleId](./moduleId.md)

## Changelog

| [QUnit 1.23](https://github.com/qunitjs/qunit/releases/tag/1.23.0) | The public config property was restored.
| [QUnit 1.16](https://github.com/qunitjs/qunit/releases/tag/1.16.0) | The public config property was removed (the URL query parameter was unaffected).
