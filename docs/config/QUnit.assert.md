---
layout: default
title: QUnit.assert
description: Namespace for QUnit assertions.
categories:
  - config
version_added: "1.7"
---

Namespace for QUnit assertions.

QUnit's built-in assertions are defined on the `QUnit.assert` object. An instance of this object is passed as the only argument to the `QUnit.test` function callback.

This object has properties for each of [QUnit's built-in assertion methods](../assert/index.md).

### Example

Use the `true` assertion through the test callback parameter:

```js
QUnit.test( "`true` assertion defined in the callback parameter", function( assert ) {
  assert.true( true, "on the object passed to the `test` function" );
});
```
