---
layout: group
group: config
title: QUnit.config
redirect_from:
  - "/QUnit.config/"
  - "/config/"
---

General configuration options for QUnit.

## Preconfiguring QUnit

If you load QUnit asynchronously or otherwise need to configure QUnit before it is loaded, you can predefine the configuration by creating a global variable `QUnit` with a `config` property.

The config values specified here will be carried over to the real `QUnit.config` object. Any other properties of this object will be ignored.

```js
// Implicit global
// Supported everywhere, including old browsers. (But not ES strict mode.)
QUnit = {
  config: {
    autostart: false,
    maxDepth: 12
  }
};

// Browser global
// For all browsers (including strict mode and old browsers)
window.QUnit = { /* .. */ };

// Isomorphic global
// For modern browsers, SpiderMonkey, and Node.js (incl. strict mode).
globalThis.QUnit = { /* .. */ };
```

### Changelog

| [QUnit 2.18.1](https://github.com/qunitjs/qunit/releases/tag/2.18.1) | Preconfig support added for SpiderMonkey and other environments.<br/>Previously, it was limited to the browser environment.
| [QUnit 2.1.0](https://github.com/qunitjs/qunit/releases/tag/2.1.0) | Preconfig feature introduced.
