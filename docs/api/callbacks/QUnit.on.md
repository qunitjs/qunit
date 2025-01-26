---
layout: page-api
title: QUnit.on()
excerpt: Register an event listener callback.
groups:
  - callbacks
  - extension
redirect_from:
  - "/callbacks/QUnit.on/"
version_added: "2.2.0"
---

`QUnit.on( eventName, callback )`

Register a callback that will be invoked after the specified event is emitted.

This event emitter is the primary interface for QUnit reporters, plugins, and continuous integration support. It is based on the [js-reporters CRI standard](https://github.com/js-reporters/js-reporters/blob/v2.1.0/spec/cri-draft.adoc), and includes a [Reporter API](#reporter-api).

| type | parameter | description
|--|--|--
| `string` | `eventName` | Name of an event.
| `Function` | `callback`| A callback function.

## The `runStart` event

The `runStart` event indicates the beginning of a test run. It is emitted exactly once, and before any other events.

| `Object` | `testCounts` | Aggregate counts about tests.
| `number` | `testCounts.total` | Total number of registered tests.

```js
QUnit.on('runStart', runStart => {
  console.log(`Test plan: ${runStart.testCounts.total}`);
});
```

## The `suiteStart` event

The `suiteStart` event indicates the beginning of a module. It is eventually be followed by a corresponding `suiteEnd` event.

| `string` | `name` | Name of the module.
| `Array<string>` | `fullName`| List of one or more strings, containing (in order) the names of any ancestor modules and the name of the current module.

```js
QUnit.on('suiteStart', suiteStart => {
  console.log('suiteStart', suiteStart);
  // name: 'my module'
  // fullName: ['grandparent', 'parent', 'my module']
});
```

## The `suiteEnd` event

The `suiteEnd` event indicates the end of a module. It is emitted after its corresponding `suiteStart` event.

| `string` | `name` | Name of the module.
| `Array<string>` | `fullName`| List of one or more strings, containing (in order) the names of any ancestor modules and the name of the current module.
| `string` | `status` | Aggregate result of tests in this module, one of:<br>`failed`: at least one test has failed; <br>`passed`: there were no failing tests, which means there were only tests with a passed, skipped, or todo status.
| `number` | `runtime` | Duration of the module in milliseconds.

```js
QUnit.on('suiteEnd', suiteEnd => {
  console.log(suiteEnd);
  // …
});
```

## The `testStart` event

The `testStart` event indicates the beginning of a test. It is eventually followed by a corresponding `testEnd` event.

| `string` | `name` | Name of the test.
| `string|null` | `moduleName` | The module the test belongs to, or null for a global test.
| `Array<string>` | `fullName` | List (in order) of the names of any ancestor modules and the name of the test itself.

```js
QUnit.on('testStart', testStart => {
  console.log(testStart);
  // name: 'my test'
  // moduleName: 'my module'
  // fullName: ['parent', 'my module', 'my test']

  // name: 'global test'
  // moduleName: null
  // fullName: ['global test']
});
```

## The `testEnd` event

The `testEnd` event indicates the end of a test. It is emitted after its corresponding `testStart` event.

Properties of a testEnd object:

| `string` | `name` | Name of the test.
| `string|null` | `moduleName` | The module the test belongs to, or null for a global test.
| `Array<string>` | `fullName` | List (in order) of the names of any ancestor modules and the name of the test itself.
| `string` | `status` | Result of the test, one of:<br>`passed`: all assertions passed or no assertions found;<br>`failed`: at least one assertion failed or it is a [todo test](../QUnit/test.todo.md) that no longer has any failing assertions;<br>`skipped`: the test was intentionally not run; or<br>`todo`: the test is "todo" and still has a failing assertion.
| `number` | `runtime` | Duration of the test in milliseconds.
| `Array<FailedAssertion>` | `errors` | For tests with status `failed` or `todo`, there will be at least one failed assertion. However, the list may be empty if the status is `failed` due to a "todo" test having no failed assertions.<br><br>Note that all negative test outcome communicate their details in this manner. For example, timeouts, uncaught errors, and [global pollution](../config/noglobals.md) also synthesize a failed assertion.

Properties of a FailedAssertion object:

| `boolean` | `passed` | False for a failed assertion.
| `string|undefined` | `message` | Description of what the assertion checked.
| `any` | `actual` | The actual value passed to the assertion.
| `any` | `expected` | The expected value passed to the assertion.
| `string|undefined` | `stack` | Stack trace, may be undefined if the result came from an old web browsers.

```js
QUnit.on('testEnd', testEnd => {
  if (testEnd.status === 'failed') {
    console.error('Failed! ' + testEnd.fullName.join(' > '));
    testEnd.errors.forEach(assertion => {
      console.error(assertion);
      // message: speedometer
      // actual: 75
      // expected: 88
      // stack: at dmc.test.js:12
    });
  }
});
```

## The `runEnd` event

The `runEnd` event indicates the end of a test run. It is emitted exactly once.

<p class="note" markdown="1">

The `runEnd` event has **memory** (since QUnit 2.24.0). This means listening for this event is possible, even if the event already fired. For example, if you build an integration system that automates running tests in a browser, and are unable to reliably inject a listener before tests have finished executing. You can attach a late event listeners for the `runEnd` event. These will be invoked immediately in that case. This removes the need for HTML scraping.

</p>

| `string` | `status` | Aggregate result of all tests, one of:<br>`failed`: at least one test failed or a global error occurred;<br>`passed`: there were no failed tests, which means there were only tests with a passed, skipped, or todo status. If [`QUnit.config.failOnZeroTests`](../config/failOnZeroTests.md) is disabled, then the run may also pass if there were no tests.
| `Object` | `testCounts` | Aggregate counts about tests:
| `number` | `testCounts.passed` | Number of passed tests.
| `number` | `testCounts.failed` | Number of failed tests.
| `number` | `testCounts.skipped` | Number of skipped tests.
| `number` | `testCounts.todo` | Number of todo tests.
| `number` | `testCounts.total` | Total number of tests, equal to the sum of the above properties.
| `number` | `runtime` | Total duration of the run in milliseconds.

```js
QUnit.on('runEnd', runEnd => {
  console.log(`Passed: ${runEnd.passed}`);
  console.log(`Failed: ${runEnd.failed}`);
  console.log(`Skipped: ${runEnd.skipped}`);
  console.log(`Todo: ${runEnd.todo}`);
  console.log(`Total: ${runEnd.total}`);
});
```

## The `error` event

*Version added: [QUnit 2.17.0](https://github.com/qunitjs/qunit/releases/tag/2.17.0)*.

The `error` event notifies plugins of uncaught global errors during a test run.

See also [QUnit.onUncaughtException()](../extension/QUnit.onUncaughtException.md) which is where you can report your own uncaught errors.

<p class="note" markdown="1">

The `error` event has **memory** (since QUnit 2.24.1). This means listening for this event is possible, even if the event already fired. This improves reliability of reporters in browser automations, where it might be difficult to reliably inject a listener between qunit.js and anything else.

</p>

| `Error|any` | `error`

```js
QUnit.on('error', error => {
  console.error(error);
});
```

## Reporter API

The QUnit CLI accepts a [`--reporter` option](../../cli.md#--reporter) that loads a reporter from a Node module (e.g. npm package). Such module must export an `init` function, which QUnit will call and pass the `QUnit` object, which you can then use to call `QUnit.on()`. This contract is known as the *Reporter API*.

You can implement your reporter either as simply an exported function, or as a class with a static `init` method.

### Example: Reporter class

```js
class MyReporter {
  static init (QUnit) {
    return new MyReporter(QUnit);
  }

  constructor (QUnit) {
    QUnit.on('error', this.onError.bind(this));
    QUnit.on('testEnd', this.onTestEnd.bind(this));
    QUnit.on('runEnd', this.onRunEnd.bind(this));
  }

  onError (error) {
  }

  onTestEnd (testEnd) {
  }

  onRunEnd (runEnd) {
  }
}

// CommonJS, or ES Module
module.exports = MyReporter;
export default MyReporter;
```

### Example: Reporter function

```js
function init (QUnit) {
  QUnit.on('error', onError);
  QUnit.on('testEnd', onTestEnd);
  QUnit.on('runEnd', onRunEnd);

  function onError (error) {
  }
  function onTestEnd (testEnd) {
  }
  function onRunEnd (runEnd) {
  }
}

// CommonJS, or ES Module
module.exports.init = init;
export { init };
```
