---
layout: page-api
title: QUnit.config.modules
excerpt: List of defined test modules.
groups:
  - config
  - extension
redirect_from:
  - "/config/modules/"
version_added: "1.16.0"
---

List of defined test modules.

<table>
<tr>
  <th>type</th>
  <td markdown="span">`Array<Module>` (read-only)</td>
</tr>
</table>

This property is exposed under `QUnit.config` for use by plugins and other integrations. It returns an array of internal `Module` objects, one for each call to [`QUnit.module()`](../QUnit/module.md).

Before accessing this property, wait for the [`QUnit.on('runStart')`](../callbacks/QUnit.on.md#the-runstart-event) event, or use a [`QUnit.begin()`](../callbacks/QUnit.begin.md) callback.

### Module object

The following properties are considered publicly supported:

| property | description |
|-----------|-------------|
| `name` (string) | Module name, as passed to [`QUnit.module()`](../QUnit/module.md).
| `moduleId` (string) | Hashed identifier, for the [QUnit.config.moduleId](./moduleId.md) filter.

## Example

```js
QUnit.on('runStart', () => {
  console.log(QUnit.config.modules.map(mod => mod.name));
});
```
