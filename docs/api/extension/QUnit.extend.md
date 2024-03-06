---
layout: page-api
title: QUnit.extend()
excerpt: Copy the properties from one object into a target object.
groups:
  - extension
  - deprecated
redirect_from:
  - "/config/QUnit.extend/"
  - "/extension/QUnit.extend/"
version_added: "1.0.0"
version_deprecated: "2.12.0"
---

`QUnit.extend( target, mixin )`

Copy the properties defined by a mixin object into a target object.

<p class="note note--warning" markdown="1">This method is __deprecated__ and it's recommended to use [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) instead.</p>

| name | description |
|------|-------------|
| `target` | An object whose properties are to be modified |
| `mixin` | An object describing which properties should be modified |

This method will modify the `target` object to contain the "own" properties defined by the `mixin`. If the `mixin` object specifies the value of any attribute as `undefined`, this property will instead be removed from the `target` object.

## Examples

Use `QUnit.extend` to merge two objects.

```js
QUnit.test('QUnit.extend', assert => {
  const base = {
    a: 1,
    b: 2,
    z: 3
  };
  QUnit.extend(base, {
    b: 2.5,
    c: 3,
    z: undefined
  });

  assert.strictEqual(base.a, 1, 'Unspecified values are not modified');
  assert.strictEqual(base.b, 2.5, 'Existing values are updated');
  assert.strictEqual(base.c, 3, 'New values are defined');
  assert.false('z' in base, 'Values specified as `undefined` are removed');
});
```
