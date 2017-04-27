---
layout: default
categories: [config]
title: QUnit.dump.parse
description: Advanced and extensible data dumping for JavaScript
---

## `QUnit.dump.parse( data )`

Advanced and extensible data dumping for JavaScript

| name               | description                          |
|--------------------|--------------------------------------|
| `data`             | Data structure or Object to parse.   |

This method does string serialization by parsing data structures and objects. It parses DOM elements to a string representation of their outer HTML. By default, nested structures will be displayed up to five levels deep. Anything beyond that is replaced by `[object Object]` and `[object Array]` placeholders.

If you need more or less output, change the value of `QUnit.dump.maxDepth`, representing how deep the elements should be parsed.

### Examples

The following example is used on [grunt-contrib-qunit][] to send messages from QUnit to PhantomJS.

[grunt-contrib-qunit]: https://github.com/gruntjs/grunt-contrib-qunit/blob/7568f3ba04a5790b2c92f44da3ce5c7bdc1c7491/phantomjs/bridge.js#L24-L33

```js
QUnit.log(function( obj ) {

  // Parse some stuff before sending it.
  var actual = QUnit.dump.parse( obj.actual );
  var expected = QUnit.dump.parse( obj.expected );

  // Send it.
  sendMessage( "qunit.log", obj.result, actual, expected, obj.message, obj.source );
});
```

---

This example shows the parsed output of a simple JS object with a DOM reference.

```js
var qHeader = document.getElementById( "qunit-header" ),
  parsed = QUnit.dump.parse( qHeader );

console.log( parsed );

// Logs: "<h1 id=\"qunit-header\"></h1>"
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
console.log( QUnit.dump.parse( input ) );
// Logs: { "parts": [object Object] }

QUnit.dump.maxDepth = 2;
console.log( QUnit.dump.parse( input ) );
// Logs: { "parts": { "back": [object Array], "front": [object Array] } }
```
