---
layout: page-api
title: QUnit.config.maxDepth
excerpt: The depth up-to which an object will be serialized during a diff (HTML Reporter).
groups:
  - config
redirect_from:
  - "/config/maxDepth/"
version_added: "1.16.0"
---

In the HTML Reporter, the depth up-to which an object will be serialized during the diff of an assertion failure.

<table>
<tr>
  <th>type</th>
  <td markdown="span">`number`</td>
</tr>
<tr>
  <th>default</th>
  <td markdown="span">`5`</td>
</tr>
</table>

To disable the depth limit and allow infinite depth, use a value of `0`.

This is used by [`QUnit.dump.parse()`](../extension/QUnit.dump.parse.md).

## Changelog

| [QUnit 1.18](https://github.com/qunitjs/qunit/releases/tag/1.18.0) | Introduce `QUnit.config.maxDepth` to enable setting via [preconfig](./index.md). Temporary changes at runtime must change `QUnit.dump.maxDepth` instead.
| [QUnit 1.16](https://github.com/qunitjs/qunit/releases/tag/1.16.0) | Introduce `QUnit.dump.maxDepth`.
