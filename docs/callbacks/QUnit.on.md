---
layout: default
title: QUnit.on()
excerpt: Register a callback to fire whenever the specified event is emitted.
categories:
  - callbacks
version_added: "2.2"
---

`QUnit.on( eventName, callback )`

Register a callback to fire whenever the specified event is emitted. Conforms to the [js-reporters standard](https://github.com/js-reporters/js-reporters).

Use this to listen for events related to the test suite's execution. Available event names and corresponding data payloads are defined in the [js-reporters specification](https://github.com/js-reporters/js-reporters).

**NOTE: The QUnit.on() callback does not handle promises and MUST be synchronous.**

| parameter | description |
|-----------|-------------|
| eventName (string) | The name of the event for which to execute the provided callback. |
| callback (function) | Callback to execute. Receives a single argument representing the data for the event. |

### Examples

Printing results of a test suite.

```js
QUnit.on( "runEnd", runEnd => {
  console.log( `Passed: ${runEnd.passed}` );
  console.log( `Failed: ${runEnd.failed}` );
  console.log( `Skipped: ${runEnd.skipped}` );
  console.log( `Todo: ${runEnd.todo}` );
  console.log( `Total: ${runEnd.total}` );
} );
```
