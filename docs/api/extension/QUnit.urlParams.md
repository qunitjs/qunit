---
layout: page-api
title: QUnit.urlParams
excerpt: Access URL parameters in the current query string.
groups:
  - extension
redirect_from:
  - "/extension/urlParams/"
version_added: "1.0.0"
---

`QUnit.urlParams[key]`<br>
`QUnit.urlParams.key`

In browser environments, this object is populated with the URL parameters in the current query string. If the [`location` global](https://developer.mozilla.org/en-US/docs/Web/API/Location) is not available, the object remains empty.

This is designed for use with [QUnit.config.urlConfig](../config/urlConfig.md), to access the value of your toolbar control.

Values are parsed as follows:

* `true`, boolean true if the key is set without a value.
* `string`, if the key is set once with a value.
* `string[]`, array of strings if the key is set more than once.

```js
// test/index.html?foo&bar=1&thing=xx&thing=yyy

QUnit.urlParams.foo; // true
QUnit.urlParams.bar; // "1"
QUnit.urlParams.thing; // [ "xx", "yyy" ]
```

## Changelog

| UNRELEASED | Available unconditionally.
| [QUnit 1.23.0](https://github.com/qunitjs/qunit/releases/tag/1.23.0)| Now undefined in non-browser environments.
| [QUnit 1.0.0](https://github.com/qunitjs/qunit/releases/tag/1.0.0) | Introduced.

## See also

* [QUnit.config.urlConfig](../config/urlConfig.md)
* [Browser Runner § Toolbar](../../browser.md)
