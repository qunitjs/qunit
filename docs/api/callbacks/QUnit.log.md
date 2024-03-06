---
layout: page-api
title: QUnit.log()
excerpt: Register a callback to fire whenever an assertion completes.
groups:
  - callbacks
redirect_from:
  - "/callbacks/QUnit.log/"
  - "/QUnit.log/"
version_added: "1.0.0"
---

`QUnit.log( callback )`

Register a callback to fire whenever an assertion completes.

**NOTE: The QUnit.log() callback does not handle promises and MUST be synchronous.**

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Provides a single argument with the callback Details object |

### Details object

Passed to the callback:

| property | description |
|-----------|-------------|
| `result` (boolean) | The boolean result of an assertion, `true` means passed, `false` means failed. |
| `actual` | One side of a comparison assertion. Can be _undefined_ when `ok()` is used. |
| `expected` | One side of a comparison assertion. Can be _undefined_ when `ok()` is used. |
| `message` (string) | A string description provided by the assertion. |
| `source` (string) | The associated stacktrace, either from an exception or pointing to the source of the assertion. Depends on browser support for providing stacktraces, so can be undefined. |
| `module` (string) | The test module name of the assertion. If the assertion is not connected to any module, the property's value will be _undefined_. |
| `name` (string) | The test block name of the assertion. |
| `runtime` (number) | The time elapsed in milliseconds since the start of the containing [`QUnit.test()`](../QUnit/test.md), including setup. |
| `todo` (boolean) | Indicates whether or not this assertion was part of a todo test. |

## Examples

Register a callback that logs the assertion result and its message:

```js
QUnit.log(details => {
  console.log(`Log: ${details.result}, ${details.message}`);
});
```

---

Log the module name and test result whenever an assertion fails:

```js
QUnit.log(details => {
  if (details.result) {
    return;
  }

  let output = `[FAILED] ${details.module} > ${details.name}`;

  if (details.message) {
    output += `: ${details.message}`;
  }
  if (details.actual) {
    output += `\nexpected: ${details.expected}\nactual: ${details.actual}`;
  }
  if (details.source) {
    output += `\n${details.source}`;
  }

  console.log(output);
});
```
