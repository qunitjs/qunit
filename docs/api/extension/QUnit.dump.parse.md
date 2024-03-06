---
layout: page-api
title: QUnit.dump.parse()
excerpt: Extensible data dumping and string serialization.
groups:
  - extension
redirect_from:
  - "/QUnit.dump.parse/"
  - "/QUnit.jsDump.parse/"
  - "/config/QUnit.dump.parse/"
  - "/extension/QUnit.dump.parse/"
version_added: "1.0.0"
---

`QUnit.dump.parse( data )`

Extensible data dumping and string serialization.

| name | description |
|------|-------------|
| `data` | Data structure or object to parse. |

This method does string serialization by parsing data structures and objects. It parses DOM elements to a string representation of their outer HTML. By default, nested structures will be displayed up to five levels deep. Anything beyond that is replaced by `[object Object]` and `[object Array]` placeholders.

If you need more or less output, change the value of `QUnit.dump.maxDepth`, representing how deep the elements should be parsed.

## Changelog

| [QUnit 2.1](https://github.com/qunitjs/qunit/releases/tag/2.1.0) | The `QUnit.jsDump` alias was removed.
| [QUnit 1.15](https://github.com/qunitjs/qunit/releases/tag/1.15.0) | The `QUnit.jsDump` interface was renamed to `QUnit.dump`.<br/>The `QUnit.jsDump` alias is deprecated.

## Examples

The following is an example from [grunt-contrib-qunit][], which sends results from QUnit (running in Headless Chrome) to a CLI tool.

[grunt-contrib-qunit]: https://github.com/gruntjs/grunt-contrib-qunit/blob/188a29af7817e1798fdd95f1ab7d3069231e4859/chrome/bridge.js#L42-L60

```js
QUnit.log(function (obj) {
  var actual;
  var expected;

  if (!obj.result) {
    // Format before sending
    actual = QUnit.dump.parse(obj.actual);
    expected = QUnit.dump.parse(obj.expected);
  }

  // ...
});
```

---

This example shows the formatted representation of a DOM element.

```js
var qHeader = document.getElementById('qunit-header');
var parsed = QUnit.dump.parse(qHeader);

console.log(parsed);

// Logs: '<h1 id="qunit-header"></h1>'
```

---

Limit output to one or two levels

```js
var input = {
  parts: {
    front: [],
    back: []
  }
};
QUnit.dump.maxDepth = 1;
console.log(QUnit.dump.parse(input));
// Logs: { "parts": [object Object] }

QUnit.dump.maxDepth = 2;
console.log(QUnit.dump.parse(input));
// Logs: { "parts": { "back": [object Array], "front": [object Array] } }
```
