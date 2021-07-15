---
layout: default
title: QUnit.config.testId
excerpt: Select one or more tests to run, by their internal ID (HTML Reporter).
categories:
  - config
version_added: "1.16.0"
---

In the HTML Reporter, select one or more tests to run by their internal ID.

### Description

<table>
<tr>
  <th>type</th>
  <td markdown="span">`array` or `undefined`</td>
</tr>
<tr>
  <th>default</th>
  <td markdown="span">`undefined`</td>
</tr>
</table>

<p class="note" markdown="1">This option can be controlled via the [HTML Reporter](https://qunitjs.com/intro/#in-the-browser) interface.</p>

This property allows QUnit to run specific tests by their internally hashed identifier. You can specify one or multiple tests to run. This option powers the "Rerun" button in the HTML Reporter.

See also:
* [QUnit.config.test](./test.md)
* [QUnit.config.module](./module.md)
