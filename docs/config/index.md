---
layout: category
title: QUnit.config
category: config
categories:
  - topics
redirect_from:
  - "/QUnit.config/"
  - "/config/QUnit.config/"
---

General configuration options for QUnit.

### Preconfiguring QUnit

If you want to configure QUnit before it is loaded, you can introduce the global variable `QUnit` with the property `config` specified. All other properties of the QUnit object will be ignored. In the config properties you may specify any of the allowed QUnit.config values.

```js
// QUnit is not yet loaded here
window.QUnit = {
  config: {
    autostart: false,
    noglobals: true,
  }
};
```
