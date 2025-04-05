---
layout: page-api
title: QUnit.extend()
excerpt: Copy the properties from one object into a target object.
groups:
  - extension
redirect_from:
  - "/config/QUnit.extend/"
  - "/extension/QUnit.extend/"
version_added: "1.0.0"
---

`QUnit.extend( target, mixin )`

Copy the properties defined by a mixin object into a target object.

<p class="note note--warning" markdown="1">It is recommended to use the built-in [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) instead.</p>

| name | description |
|------|-------------|
| `target` | An object whose properties are to be modified |
| `mixin` | An object describing which properties should be modified |

This method will modify the `target` object to contain the "own" properties defined by the `mixin`. If the `mixin` object specifies the value of any attribute as `undefined`, this property will instead be removed from the `target` object.

## Examples

Use `QUnit.extend` to merge two objects.

```js
QUnit.test('using extend', function (assert) {
  const base = {
    a: 1,
    b: 2,
    zed: 3
  };
  QUnit.extend(base, {
    b: 2.5,
    c: 3,
    zed: undefined
  });

  assert.strictEqual(base.a, 1, 'Unspecified keys remain unchanged');
  assert.strictEqual(base.b, 2.5, 'Matching keys are replaced');
  assert.strictEqual(base.c, 3, 'New keys are added');
  assert.false('zed' in base, 'Keys with the value `undefined` are removed');
});
```
