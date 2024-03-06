---
layout: page
title: QUnit 2.0 Upgrade Guide
---

<!--
	Follow semistandard in code examples.

	<https://github.com/standard/semistandard>
	<https://standardjs.com/rules.html>
-->
<p class="lead" markdown="1">This guide will assist you in upgrading from QUnit 1 to QUnit 2.</p>

## Overview

The QUnit 2 release only removes old methods. The "QUnit 2" methods were introduced as part of QUnit 1.x releases. If you are on QUnit 1.23, you can already migrate gradually, before making the jump.

The old methods are removed in QUnit 2.0 and replaced with placeholder methods that throw descriptive errors to simplify migration (`"Global 'test()' method is removed, use 'QUnit.test() instead"`). QUnit 2.1 removes that layer and would instead throw native errors like `"ReferenceError: test is not defined"`.

| QUnit 1.x | QUnit 2.x
|--|--
| `module()` | [`QUnit.module()`](./api/QUnit/module.md)
| `test()` | [`QUnit.test()`](./api/QUnit/test.md)
| `asyncTest()` | [`QUnit.test()`](./api/QUnit/test.md) with [`assert.async()`](./api/assert/async.md)
| `stop()`/`start()` | [`assert.async()`](./api/assert/async.md)
| `expect()` | [`assert.expect()`](./api/assert/expect.md)
| `ok()`, `equal()`, `deepEqual()`, … | [`assert`](./api/assert/index.md)
| `setup`/`teardown` options | [`beforeEach` and `afterEach` hooks](./api/QUnit/module.md#options-object)

For plugins and other integrations:

| QUnit 1.x | QUnit 2.x
|--|--
| `QUnit.log = …`<br/>`QUnit.begin = …`<br/>… | [`QUnit.log(…)`](./api/callbacks/QUnit.log.md),<br/>[`QUnit.begin(…)`](./api/callbacks/QUnit.begin.md),<br/>…
| `QUnit.push()` | [`assert.pushResult()`](./api/assert/pushResult.md)
| `QUnit.jsDump.parse()` | [`QUnit.dump.parse()`](./api/extension/QUnit.dump.parse.md)

## Changes

<p class="note" markdown="1">The [qunit-migrate](https://github.com/apsdehal/qunit-migrate) tool can automate the transition to QUnit 2.</p>

* [Removed global functions](#removed-global-functions)
* [Introducing `assert.async`](#introducing-assertasync)
* [Renamed module hooks](#renamed-module-hooks)
* [Removed legacy callback properties](#removed-legacy-callback-properties)
* [Replace `QUnit.push` with `assert.pushResult`](#replace-qunitpush-with-assertpushresult)
* [Removed `QUnit.init` without replacement](#removed-qunitinit-without-replacement)
* [Removed `QUnit.reset`](#removed-qunitreset)
* [Renamed `QUnit.jsDump` to `QUnit.dump`](#renamed-qunitjsdump-to-qunitdump)
* [Replace `expected` number argument of `QUnit.test`](#replace-expected-number-argument-of-qunittest)
* [Replace `assert.throws(Function, string, message)` signature](#replace-assertthrowsfunction-string-message-signature)

### Removed global functions

QUnit 2 no longer uses global functions. The main methods are now part of the `QUnit` interface, and the assertion methods are exposed through a new [`assert`](./api/assert/index.md) object that is bound to each test.

Before:

```js
module('example');

test('add', function () {
	equal(add(2, 3), 5);
});
```

After:

```js
QUnit.module('example');

QUnit.test('add', assert => {
	assert.equal(add(2, 3), 5);
});
```

### Introducing `assert.async()`

Use [`assert.async()`](./api/assert/async.md) instead of the `stop()` and `start()` functions. Calling `assert.async()` returns a `done` function that should be called once the asynchronous operation is finished.

Similarly, if you were using `asyncTest()`, use the regular [`QUnit.test()`](./api/QUnit/test.md) with [`assert.async()`](./api/async.md) instead.

Before:

```js
QUnit.test('navigates to new page', function () {
	stop();
	router.navigate(function (newPage) {
		equal(newPage.id, 1);
		start();
	});
});

// Or

asyncTest('navigates to new page', function () {
	router.navigate(function (newPage) {
		equal(newPage.id, 1);
		start();
	});
});
```

After:

```js
QUnit.test('navigates to new page', assert => {
	const done = assert.async();
	router.navigate(newPage => {
		assert.equal(newPage.id, 1);
		done();
	});
});
```

### Renamed module hooks

The [module hooks](./api/QUnit/module.md) `setup` and `teardown` have been renamed to `beforeEach` and `afterEach`. The new names were first introduced in QUnit 1.16, and removed in QUnit 2.0.

Before:

```js
QUnit.module('router', {
	setup: function () {
		this.router = new Router();
	},
	teardown: function () {
		this.router.destroy();
	}
});
```

After:

```js
QUnit.module('router', {
	beforeEach: () => {
		this.router = new Router();
	},
	afterEach: () => {
		this.router.destroy();
	}
});
```

You can also use a [nested scope](./api/QUnit/module.md#nested-scope) as of QUnit 1.20, which makes for simpler sharing of variables and associating of tests with modules.

Example:

```js
QUnit.module('router', hooks => {
	let router;

	hooks.beforeEach(() => {
		router = new Router();
	});
	hooks.afterEach(() => {
		router.destroy();
	});

	QUnit.test('add', assert => {
		assert.true(router.add('/about'));
	});
});
```

### Removed legacy callback properties

Early alpha releases of QUnit 0.x required property assignments to register callback events. In QUnit 1.0, these were deprecated in favour of more modern event registration methods. The ability to use assignments as way to register callbacks was removed in QUnit 2.0.

<p class="note" markdown="1">

See also [`QUnit.on()`](./api/callbacks/QUnit.on.md), which implements the [js-reporters spec](https://github.com/js-reporters/js-reporters) since QUnit 2.2.

</p>

Before:

```js
QUnit.log = function (results) {
	console.log(results);
};
```

After:

```js
QUnit.log(function (results) {
	console.log(results);
});
```

This applies to all reporting callbacks, specifically: [`begin`](./api/callbacks/QUnit.begin.md), [`done`](./api/callbacks/QUnit.done.md), [`log`](./api/callbacks/QUnit.log.md), [`moduleDone`](./api/callbacks/QUnit.moduleDone.md), [`moduleStart`](./api/callbacks/QUnit.moduleStart.md), [`testDone`](./api/callbacks/QUnit.testDone.md), and [`testStart`](./api/callbacks/QUnit.testStart.md).

### Replace `QUnit.push()` with `assert.pushResult()`

To implement custom assertions, assign functions to [`QUnit.assert`](./api/extension/QUnit.assert.md), and inside use [`this.pushResult()`](./api/assert/pushResult.md) instead of `QUnit.push`. This allows assertions to be directly associated with its test context, preventing asynchronous tests from leaking into other tests.

Before:

```js
QUnit.assert.mod2 = function (value, expected, message) {
    const actual = value % 2;
    QUnit.push(actual === expected, actual, expected, message);
};
```

After:

```js
QUnit.assert.mod2 = function (value, expected, message) {
    const actual = value % 2;
    this.pushResult({ result: actual === expected, actual, expected, message });
};
```

### Removed `QUnit.init` without replacement

This method used to reinitialize the test runner. It should never have been exposed as a public method and is now gone, without replacement. If you've built an integration or runner framework that requires the use of `QUnit.init`, reach out in our [Chat room](https://gitter.im/qunitjs/qunit), or contact us in the [issue tracker](https://github.com/qunitjs/qunit/issues) to help find a replacement.

### Removed `QUnit.reset`

This method accessed QUnit's internal fixture reset. This is now gone, without replacement. If your code is using it, you may need to split affected tests into separate tests.

Before:

```js
QUnit.test('currentPage', assert => {
	router.refresh();
	assert.equal(router.currentPage.id, 1);

	QUnit.reset();

	history.replaceState('/about');
	router.refresh();
	assert.equal(router.currentPage.id, 42);
});
```

After:

```js
QUnit.test('currentPage default', assert => {
	router.refresh();
	assert.equal(router.currentPage.id, 1);
});

QUnit.test('currentPage after replaceState', assert => {
	history.replaceState('/about');
	router.refresh();
	assert.equal(router.currentPage.id, 42);
});
```

### Renamed `QUnit.jsDump` to `QUnit.dump`

Originally `jsDump` was a standalone library imported into QUnit. It has since evolved further within the library. To reflect that, the property was renamed to [`QUnit.dump.parse`](./api/extension/QUnit.dump.parse.md). This should only affect custom reporter code, not regular testsuites.

Before:

```js
QUnit.log(obj => {
  const actual = QUnit.jsDump.parse(obj.actual);
  const expected = QUnit.jsDump.parse(obj.expected);
  sendMessage(obj.result, actual, expected);
});
```

After:

```js
QUnit.log(obj => {
  const actual = QUnit.dump.parse(obj.actual);
  const expected = QUnit.dump.parse(obj.expected);
  sendMessage(obj.result, actual, expected);
});
```

### Replace `expected` number argument of `QUnit.test`

The optional `expected` argument to `QUnit.test` for specifying the expected number of assertions, was removed. Call `assert.expect()` instead.

Before:

```js
QUnit.test('addition', 1, assert => {
    assert.equal(add(2, 3), 5);
});
```

After:

```js
QUnit.test('addition', assert => {
    assert.expect(1);
    assert.equal(add(2, 3), 5);
});
```

### Replace `assert.throws(Function, string, message)` signature

The signature of [`assert.throws()`](./api/assert/throws.md) that accepted an error string as second parameter has been removed. This avoids ambiguity with the assertion message, as both parameters were optional.

It is recommended to use a regular expression or error object as the expected value instead.

For example, to test the following code:

```js
function add(a, b) {
	if (a === undefined) {
		throw new Error('This is an error');
	}
}
```

Before:

```js
QUnit.test('add', assert => {
	assert.throws(() => {
		add();
	}, 'This is an error', 'Fail if A is undefined');
});
```

After:

```js
QUnit.test('add', assert => {
	assert.throws(() => {
		add();
	}, /This is an error/, 'Fail if A is undefined');
});

// Or

QUnit.test('add', assert => {
	assert.throws(() => {
		add();
	}, new Error('This is an error'), 'Fail if A is undefined');
});
```

See [`assert.throws()`](./api/assert/throws.md) for an overview of the supported signatures.

Note that in the two-argument signature `assert.throws(Function, string)` has always been interpreted as asserting _anything_ is thrown, with the string argument being the assertion message. This continues to be supported.
