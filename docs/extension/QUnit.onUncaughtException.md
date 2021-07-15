---
layout: default
title: QUnit.onUncaughtException()
excerpt: Handle a global error.
categories:
 - extension
version_added: "unreleased"
redirect_from:
  - "/config/QUnit.onUncaughtException/"
---

`QUnit.onUncaughtException( error )`

Handle a global error that should result in a failed test run.

| name | description |
|------|-------------|
| `error` (any) | Usually an `Error` object, but any other thrown or rejected value may be given as well. |

### Examples

```js
const error = new Error( "Failed to reverse the polarity of the neutron flow" );
QUnit.onUncaughtException( error );
```

```js
process.on( "uncaughtException", QUnit.onUncaughtException );
```

```js
window.addEventListener( "unhandledrejection", function( event ) {
  QUnit.onUncaughtException( event.reason );
} );
```
