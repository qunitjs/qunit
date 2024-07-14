---
layout: page-api
title: QUnit.dump.setParser()
excerpt: Override string serialization for a given data type.
groups:
  - extension
redirect_from:
  - "/extension/QUnit.dump.setParser/"
version_added: "1.0.0"
---

`QUnit.dump.setParser( name, parser )`

Override string serialization in [`QUnit.dump.parse()`](./QUnit.dump.parse.md) for a given data type.

| name | description |
|------|-------------|
| `name` (string) | Value type |
| `parser` (function) | Value formatter callback |

Value type is one of the following:

* `array`
* `bigint` (ES2020, determined by native `typeof`)
* `boolean`
* `date`
* `document`
* `error`
* `function`
* `node`
* `null`
* `number`
* `object`
* `regexp`
* `string`
* `symbol` (ES2019, determined by native `typeof`)
* `undefined`
* `window`

If your callback allows recursion into arbitrary child value structures, you may call [`QUnit.dump.parse()`](./QUnit.dump.parse.md) recursively. Recursive callers must pass on the stack, and call `QUnit.dump.up()` to increase depth tracking beforehand, and `QUnit.dump.down()` to decrease it afterward.

If your value type may contain any number of children (such as an object or array, something not limited to being formatted on a short single line), check the depth against [`QUnit.config.maxDepth`](../config/maxDepth.md), and return a type-specific placeholder value if the depth limit was exceeded.

You may use `QUnit.dump.join()` to aid in automatic formatting of indentation based on the current depth. Refer to examples below.

## Changelog

| [QUnit 2.1](https://github.com/qunitjs/qunit/releases/tag/2.1.0) | The `QUnit.jsDump` alias was removed.
| [QUnit 1.15](https://github.com/qunitjs/qunit/releases/tag/1.15.0) | The `QUnit.jsDump` interface was renamed to `QUnit.dump`.<br/>The `QUnit.jsDump` alias is deprecated.

## Examples

### Value formatter

```js
QUnit.dump.setParser('document', function (doc) {
  return '[Document ' + doc.location.href + ']';
});
```

```js
var example = { foo: document.createElement('div') };

var dumped1 = QUnit.dump.parse(example);
console.log(dumped1);
// # Default
// {
//   "foo": <div></div>
// }

QUnit.dump.setParser('node', function (obj) {
  return '[Node ' + obj.nodeName.toLowerCase() + ']';
});

var dumped2 = QUnit.dump.parse(example);
console.log(dumped2);
// # Custom
// {
//   "foo": [Node div]
// }
```

### Deep formatter

```js
QUnit.dump.setParser('array', function (arr, stack) {
  if (QUnit.config.maxDepth && QUnit.dump.depth > QUnit.config.maxDepth) {
    return '[object Array]';
  }

  QUnit.dump.up();

  let i = arr.length;
  const ret = new Array(i);
  while (i--) {
    ret[i] = QUnit.dump.parse(arr[i], undefined, stack);
  }

  QUnit.dump.down();

  return QUnit.dump.join('[', ret, ']');
  // Output:
  // 1. 'pre' text.
  // 2. for each value:
  //    - line break and inner indentation
  //    - value as-is
  //    - comma (if not last)
  // 3. line break and outer indentation (if any)
  // 4. 'post' text
  //
  // [
  //   "foo",
  //   "bar"
  // ]
});
```
