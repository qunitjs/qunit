---
layout: page-api
title: QUnit.config.fixture
excerpt: HTML content to render in the fixture container at the start of each test (HTML Reporter).
groups:
  - config
redirect_from:
  - "/config/fixture/"
version_added: "1.0.0"
---

In the HTML Reporter, this HTML content will be rendered in the fixture container at the start of each test.

<table>
<tr>
  <th>type</th>
  <td markdown="span">`string` or `null` or `undefined`</td>
</tr>
<tr>
  <th>default</th>
  <td markdown="span">`undefined`</td>
</tr>
</table>

By default QUnit will observe the initial content of the `#qunit-fixture` element, and use that as the fixture content for all tests. Use this option to configure the fixture content through JavaScript instead.

To disable QUnit's fixture resetting behaviour, set the option to `null`.
