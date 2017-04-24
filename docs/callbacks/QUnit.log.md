---
layout: default
title: QUnit.log
description: Register a callback to fire whenever an assertion completes.
categories:
  - callbacks
---

## `QUnit.log( callback )`

Register a callback to fire whenever an assertion completes.

This is one of several callbacks QUnit provides. Its intended for integration scenarios like PhantomJS or Jenkins.
The properties of the details argument are listed below as options.

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Provides a single argument with the callback details object |

#### Callback details: `callback( details: { result, actual, expected, message, source, module, name, runtime, todo } )`

| parameter | description |
|-----------|-------------|
| `result` (boolean) | The boolean result of an assertion, `true` means passed, `false` means failed. |
| `actual` | One side of a comparision assertion. Can be _undefined_ when `ok()` is used. |
| `expected` | One side of a comparision assertion. Can be _undefined_ when `ok()` is used. |
| `message` (string) | A string description provided by the assertion. |
| `source` (string) | The associated stacktrace, either from an exception or pointing to the source of the assertion. Depends on browser support for providing stacktraces, so can be undefined. |
| `module` (string) | The test module name of the assertion. If the assertion is not connected to any module, the property's value will be _undefined_. |
| `name` (string) | The test block name of the assertion. |
| `runtime` (number) | The time elapsed in milliseconds since the start of the containing [`QUnit.test()`](/QUnit/test), including setup. |
| `todo` (boolean) | Indicates whether or not this assertion was part of a todo test. |

### Examples

Register a callback that logs the assertion result and its message

```js
QUnit.log(function( details ) {
  console.log( "Log: ", details.result, details.message );
});
```

Using modern syntax:

```js
QUnit.log( ( { result, message } ) => {
  console.log( `Log: ${result}, ${message}` );
});
```

---

Logs the module and test block whenever an assertion fails.

```js
QUnit.log(function( details ) {
  if ( details.result ) {
    return;
  }
  var loc = details.module + ": " + details.name + ": ",
    output = "FAILED: " + loc + ( details.message ? details.message + ", " : "" );

  if ( details.actual ) {
    output += "expected: " + details.expected + ", actual: " + details.actual;
  }
  if ( details.source ) {
    output += ", " + details.source;
  }
  console.log( output );
});
```

Using modern syntax:

```js
QUnit.log( ( { result, module, name, message, actual, expected, source } ) => {
  if ( result ) {
    return;
  }

  let output = `FAILED: ${module}: ${name}: `;

  if ( message ) {
    output += `${message}, `;
  }
  if ( actual ) {
    output += `expected: ${expected}, actual: ${actual}`;
  }
  if ( source ) {
    output += `, ${source}`;
  }

  console.log( output );
});
```
