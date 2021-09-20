---
layout: group
group: config
title: QUnit.config
redirect_from:
  - "/QUnit.config/"
  - "/config/QUnit.config/"
---

General configuration options for QUnit.

## Preconfiguring QUnit

If you load QUnit asynchronously or otherwise need to configure QUnit before it is loaded, you can define the global variable `QUnit` with a `config` property. Any other properties of the QUnit object will be ignored. The config values specified here will be carried over to the real `QUnit.config` object.

```js
// Before QUnit is loaded
window.QUnit = {
  config: {
    autostart: false,
    noglobals: true,
  }
};
```
