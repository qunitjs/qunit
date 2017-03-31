---
layout: default
title: QUnit.on
description: Register a callback to fire whenever the specified event is emitted.
categories:
  - callbacks
---

## `QUnit.on( eventName, callback )`

Register a callback to fire whenever the specified event is emitted. Conforms to the [js-reporters standard](https://github.com/js-reporters/js-reporters).

`QUnit.on()` allows you to listen for events related to the test suite's execution. Available event names and corresponding data payloads are defined in the [js-reporters specification](https://github.com/js-reporters/js-reporters).

| parameter | description |
|-----------|-------------|
| eventName (string) | The name of the event for which to execute the provided callback. |
| callback (function) | Callback to execute. Receives a single argument representing the data for the event. |

### Example

Printing results of a test suite.

```js
QUnit.on( "runEnd", function( data ) {
  console.log( "Passed: " + data.testCounts.passed );
  console.log( "Failed: " + data.testCounts.failed );
  console.log( "Skipped: " + data.testCounts.skipped );
  console.log( "Todo: " + data.testCounts.todo );
  console.log( "Total: " + data.testCounts.total );
} );
```

Using modern syntax:

```js
QUnit.on( "runEnd", ( { testCounts: { passed, failed, skipped, todo, total } } ) => {
  console.log( `Passed: ${passed}` );
  console.log( `Failed: ${failed}` );
  console.log( `Skipped: ${skipped}` );
  console.log( `Todo: ${todo}` );
  console.log( `Total: ${total}` );
} );
```
