---
layout: page
title: QUnit 3.0 Upgrade Guide
---

<p class="lead" markdown="1">If your tests pass without warnings on QUnit 2.24, you can upgrade to QUnit 3 without changes.</p>

The QUnit 3.0 release only removes deprecated methods, and promotes warnings to errors. If your tests pass on QUnit 2.24 or later without warnings, then you should be able to upgrade to QUnit 3 without changes.

As is our tradition, no significant features are introduced in major releases. The new features that you may informally associate with "QUnit 3" have been gradually in the QUnit 2.x series. Learn about new features introduced since QUnit 2.0 in [The Road to QUnit 3]({% post_url 2026-09-20-new-features-road-to-qunit-3 %}).

## Changes

* [New features](#new-features)
* [New theme](#new-theme)
* [Deprecation warnings](#deprecation-warnings)
* [Remove QUnit.load](#remove-qunitload)
* [Remove QUnit.onError and QUnit.onUnhandledRejection](remove-qunitonerror-and-qunitonunhandledrejection)
* [Remove support for legacy markup](#remove-support-for-legacy-markup)
* [Remove support for Node.js 10-16](#remove-support-for-nodejs-10-16)
* [Remove support for PhantomJS](#remove-support-for-phantomjs)
* [Remove Bower distribution](#remove-bower-distribution)
* [Remove AMD export](#remove-amd-export)

### New features

Check out [The Road to QUnit 3]({% post_url 2026-09-20-new-features-road-to-qunit-3 %}) to learn more about features introduced between QUnit 2.1 and QUnit 2.24, such as:

* [`assert.step()`](./api/assert/verifySteps.md) provides a complete and strict way to verify asynchronous or event-driven code.
* [`assert.timeout()`](./api/assert/timeout.md) to control the allowed duration of an async test.
* [`assert.rejects()`](./api/assert/rejects.md) to cleanly wait for and match an expected error from any async function or rejected Promise.
* [`assert.true()`](./api/assert/true.md) and [`assert.false()`](./api/assert/false.md) shortcuts.
* [`assert.propContains()`](./api/assert/propContains.md) to partially compare an object while ignoring other properties.
* [`assert.closeTo()`](./api/assert/closeTo.md) to expect a number within a certain range or tolerance.
* [`QUnit.test.each()`](./api/QUnit/test.each.md) to generate test cases via a data provider.
* [`QUnit.test.if()`](./api/QUnit/test.if.md) to automatically skip a test when a condition is false.
* [`QUnit.reporters.perf`](./api/reporters/perf.md) to find and analyze slow tests in your browser DevTools.

### New theme

The default theme in QUnit 3 is faster, more accessible, and includes better error reporting.

Read [First look at the QUnit 3 theme]({% post_url 2026-09-12-qunit-3-theme %}) and [Instant render with QUnit 3]({% post_url 2026-09-11-instant-render %}) on the QUnit Blog.

### Deprecation warnings

#### Hook on wrong module

This warning was introduced in QUnit 2.15 ([#1576](https://github.com/qunitjs/qunit/issues/1576)) and has been promoted to an error ([learn more](./api/QUnit/module.md#E0002)):

```
Warning: The beforeEach hook was called inside the wrong module.
```

#### Async module scope

This warning was introduced in QUnit 2.16 ([#1600](https://github.com/qunitjs/qunit/issues/1600)) and has been promoted to an error:
```
Warning: Returning a promise from a module callback is not supported.
```
```
Error: QUnit.module() callback must not be async. For async module setup, use hooks.
```

#### Unexpected test after runEnd

This warning was introduced in QUnit 2.17 ([#1377](https://github.com/qunitjs/qunit/issues/1377)) and has been promoted to an error ([learn more](./api/config/autostart.md#E0001)):

```
Warning: Unexpected test after runEnd.
```

#### Default test timeout

If a test takes longer than 3 seconds and you have no timeout set, the following deprecation warning is logged (since QUnit 2.21, [#1483](https://github.com/qunitjs/qunit/issues/1483)):

```
Warning: Test {name} took longer than 3000ms, but no timeout was set.
```

QUnit 3 enables a default test timeout of 3 seconds. Check [config.testTimeout](./api/config/testTimeout.md#deprecated-no-timeout-set) for how to address this warning before upgrading to QUnit 3.

#### Change `assert.expect()` counting

QUnit 3 excludes `assert.step()` calls from the assertion count. QUnit 2.21 added this warning:

```
Warning: Counting each assert.step() for assert.expect() is changing in QUnit 3.0.
Omit assert.expect() from tests that use assert.step(), or enable QUnit.config.countStepsAsOne.
```

Review [`assert.expect()`](./api/assert/expect.md) and decide if you still need to count assertions. See also [The value and benefit of assert.expect()](https://discuss.emberjs.com/t/the-value-and-benefit-of-assert-expect/20145) on the Ember Discuss forum, which resulted in a recommendation and ESLint rule to discourages assertion counting, especially because `assert.verifySteps()` already counts the steps. If you prefer to keep counting assertions, check [Migration: countStepsAsOne](./api/assert/expect.md#migration-countstepsasone).

### Remove `QUnit.load()`

The `QUnit.load()` method was used by some test runners and CI plugins to customize loading of scripts.

This is deprecated and can usually be removed without replacement. Refer to [`QUnit.load()`](./api/QUnit/load.md) for a migration guide.

### Remove `QUnit.onError()` and `QUnit.onUnhandledRejection()`

The undocumented `QUnit.onError()` and `QUnit.onUnhandledRejection()` callbacks could be used by an integration plugin or custom test runner. These are deprecated in favor of [`QUnit.onUncaughtException()`](./api/extension/QUnit.onUncaughtException.md) since [QUnit 2.17]({% post_url 2021-09-05-qunit-2-17-0 %}).

### Remove support for legacy markup

Prior to QUnit 1.2, test pages used the following markup:

```html
<body>
  <h1 id="qunit-header">Tests</h1>
  <h2 id="qunit-banner"></h2>
  <div id="qunit-testrunner-toolbar"></div>
  <h2 id="qunit-userAgent"></h2>
  <ol id="qunit-tests"></ol>
</body>
```

Since QUnit 1.3, released in 2012, this markup is automatically created and inserted into a `<div id="qunit">` element on the page.

```html
<body>
  <div id="qunit"></div>
</body>
```

QUnit 1.x and 2.x supported manual creation of this markup for backwards compatibility. This has now been removed. Use `<div id="qunit">` instead. Learn about HTML test file markup on the [Browser Runner](./browser.md) page.

### Remove support for Node.js 10-16

Support for Node.js 10-16 was removed. The QUnit CLI now requires Node.js 18 or later.

### Remove support for PhantomJS

QUnit no longer supports running tests in the PhantomJS browser. This was deprecated in [QUnit 2.13]({% post_url 2020-11-29-qunit-2-13-0 %}).

Other browser support remains unchanged. View the support table for browsers and other runtimes at [Getting Started § Compatibility](./intro.md#compatibility).

### Remove Bower distribution

Future QUnit releases are no longer published to the Bower registry. QUnit 1.x and 2.x packages remain available via the [Bower CLI](https://bower.io/).

Review [supported installation methods](./intro.md#download), or follow [Getting Started in the browser](./browser.md).

### Remove AMD export

The `qunit.js` distribution no longer exports the QUnit API via AMD.

This change only affects the loading of the `qunit.js` file. You can continue to load your application source code and QUnit test files via AMD or RequireJS. See [Example: Loading with RequireJS](./api/config/autostart.md#loading-with-requirejs).

## See also

* [Blog: The Road to QUnit 3]({% post_url 2026-09-20-new-features-road-to-qunit-3 %})
* [QUnit 3.0.0 Full changelog](https://github.com/qunitjs/qunit/blob/3.0.0-rc1/History.md)
