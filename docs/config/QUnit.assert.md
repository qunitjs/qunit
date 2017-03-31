---
layout: default
title: QUnit.assert
description: Namespace for QUnit assertions.
categories:
  - config
---

## `QUnit.assert`

Namespace for QUnit assertions.

QUnit's built-in assertions are defined on the `QUnit.assert` object. An instance of this object is passed as the only argument to the `QUnit.test` function callback.

This object has properties for each of [QUnit's built-in assertion methods](/assert/).

### Example

Use the `ok` assertion through the test callback parameter:

```js
QUnit.test( "`ok` assertion defined in the callback parameter", function( assert ) {
  assert.ok( true, "on the object passed to the `test` function" );
});
```
