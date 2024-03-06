---
layout: page-api
title: QUnit.config.storage
excerpt: The Storage object to use for remembering failed tests between runs.
groups:
  - config
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
  <td markdown="span">`globalThis.sessionStorage`</td>
</tr>
</table>

This is mainly for use by the HTML Reporter, where `sessionStorage` will be used if supported by the browser.

While Node.js and other non-browser environments are not known to offer something like this by default, one can attach any preferred form of persistence by assigning an object that implements the [`Storage` interface methods](https://html.spec.whatwg.org/multipage/webstorage.html#the-storage-interface) of the Web Storage API.
