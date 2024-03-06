---
layout: page-api
title: QUnit.stack()
excerpt: Return a single line string representing the stacktrace.
groups:
  - extension
redirect_from:
  - "/config/QUnit.stack/"
  - "/extension/QUnit.stack/"
version_added: "1.19.0"
---

`QUnit.stack( offset = 0 )`

Return a single line string representing the stacktrace (call stack).

| name | description |
|------|-------------|
| `offset` (number) | Set the stacktrace line offset. Defaults to `0` |

This method returns a single line string representing the stacktrace from where it was called. According to its offset argument, `QUnit.stack()` will return the correspondent line from the call stack.

The default offset is 0 and will return the current location where it was called.

Not all [browsers support retrieving stracktraces][browsers]. In those, `QUnit.stack()` will return `undefined`.

[browsers]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack#Browser_compatibility

## Examples

The stacktrace line can be used on custom assertions and reporters. The following example [logs](../callbacks/QUnit.log.md) the line of each passing assertion.

```js
QUnit.log(function (details) {
  if (details.result) {
    // 5 is the line reference for the assertion method, not the following line.
    console.log(QUnit.stack(5));
  }
});

QUnit.test('foo', assert => {
  // the log callback will report the position of the following line.
  assert.true(true);
});
```
