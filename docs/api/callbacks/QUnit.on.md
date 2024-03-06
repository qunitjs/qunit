---
layout: page-api
title: QUnit.on()
excerpt: Register a callback to fire whenever the specified event is emitted.
groups:
  - callbacks
redirect_from:
  - "/callbacks/QUnit.on/"
version_added: "2.2.0"
---

`QUnit.on( eventName, callback )`

Register a callback to fire whenever a specified event is emitted.

This API implements the [js-reporters CRI standard](https://github.com/js-reporters/js-reporters/blob/v2.1.0/spec/cri-draft.adoc), and is the primary interface for use by continuous integration plugins and other reporting software.

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
