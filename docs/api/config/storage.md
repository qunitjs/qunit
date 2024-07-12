---
layout: page-api
title: QUnit.config.storage
excerpt: The Storage object to use for remembering failed tests between runs.
groups:
  - config
  - extension
redirect_from:
  - "/config/storage/"
version_added: "2.1.0"
---

The Storage object to use for remembering failed tests between runs.

<table>
<tr>
  <th>type</th>
  <td markdown="span">`object` or `undefined`</td>
</tr>
<tr>
  <th>default</th>
  <td markdown="span">`globalThis.sessionStorage` or `undefined`</td>
</tr>
</table>

This is used to power the [reorder feature](./reorder.md). In [browser environments](../../browser.md) this will use `sessionStorage` if supported by the browser.

In Node.js and other non-browser environments, there is no storage object available for this purpose by default. You can attach your own preferred form of persistence between test runs, by assigning an object to `QUnit.config.storage` that implements `getItem`, `setItem` and `removeItem` methods, similar to the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).
