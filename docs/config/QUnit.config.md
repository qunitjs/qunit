---
layout: default
categories: [config]
title: QUnit.config
description: General configuration for QUnit. Check the description of each option for details.
---

## `QUnit.config`

Configuration for QUnit. QUnit has a bunch of internal configuration defaults, some of which are useful to override. Check the description for each option for details.

### `QUnit.config.altertitle` (boolean) | default: `true`

By default, QUnit updates document.title to add a checkmark or x-mark to indicate if a testsuite passed or failed. This makes it easy to see a suites result even without looking at a tab's content.

If you're dealing with code that tests `document.title` changes or have some other problem with this feature, set this option to false to disable it.

### `QUnit.config.autostart` (boolean) | default: `true`

By default, QUnit runs tests when `load` event is triggered on the `window`. If you're loading tests asynchronously, you can set this property to `false`, then call `QUnit.start()` once everything is loaded. See below for an example.

### `QUnit.config.collapse` (boolean) | default: `true`

By default, QUnit's HTML reporter collapses consecutive failing tests showing only the details for the first failed test. The other tests can be expanded manually with a single click on the test title. Setting this value to `false` will expand the details for every failing test.

### `QUnit.config.current` (object)

This object isn't actually a configuration property, but is listed here anyway, as it's exported through `QUnit.config`. This gives you access to some QUnit internals at runtime. See below for an example.

### `QUnit.config.filter` (string) | default: `undefined`

Allows you to filter which tests are run by matching the module name and test title against the provided string. You can do an inverse filter, matching all tests that don't contain the string, by prefixing a `!` to the value.

You can also match via a regular expression by passing in a string version of the regular expression literal, such as `/(this|that)/i`.

### `QUnit.config.fixture` (string) | default: `undefined`

Defines the HTML content to use in the fixture container which is reset at the start of each test.

By default QUnit will use whatever the starting content of `#qunit-fixture` is as the fixture reset. If you do not want the fixture to be reset in between tests, set the value to `null`.

### `QUnit.config.hidepassed` (boolean) | default: `false`

By default, the HTML Reporter will show all the tests results. Enabling this option will make it show only the failing tests, hiding all that pass. This can also be managed by the HTML interface.

### `QUnit.config.maxDepth` (number) | default: `5`

Specifies the depth up-to which an object will be dumped during a diff. To run without a max depth, use a value of `-1`.

### `QUnit.config.module` (string) | default: `undefined`

Specify a single module to run by name (exact case-insensitive match required). By default, QUnit will run all the loaded modules when this property is not specified.

This property was absent in versions 1.16.0 through 1.22.0.

### `QUnit.config.moduleId` (array) | default: `undefined`

This property allows QUnit to run specific modules identified by the hashed version of their module name. You can specify one or multiple modules to run.

### `QUnit.config.notrycatch` (boolean) | default: `false`

By default, QUnit will run tests within a `try-catch` block to prevent uncaught exceptions from crashing the entire test suite.

Enabling this flag will run tests without the `try-catch` to allow exceptions to remain uncaught for easier debugging in certain environments.

### `QUnit.config.noglobals` (boolean) | default: `false`

Enabling this flag will cause QUnit to check if any new properties have been added to the global context after each test. New global properties being found will result in test failures to help ensure your tests are not leaking state.

### `QUnit.config.seed` (string) | default: `undefined`

This property tells QUnit to run tests in a seeded-random order. The value provided will be used as the seed in a pseudo-random number generator to ensure that results are reproducible. The randomization will also respect the `reorder` option if enabled and re-run failed tests first without randomizing them.

Randomly ordering your tests can help identify non-atomic tests which either depend on a previous test or are leaking state to following tests. This is particularly beneficial in a development CI or post-commit process.

If `seed` is specified in the page's url parameters, but no value is specified, then QUnit will generate a random value to use as the seed. You can access the value from this property and use it to repeat the same sequence in another run.

### `QUnit.config.storage` (object) | default: `sessionStorage`

Defines the storage object used to record failed tests between runs. The object must implement [the `Storage` interface][Storage] of the Web Storage API.

[Storage]: https://html.spec.whatwg.org/multipage/webstorage.html#the-storage-interface

Defaults to the global `sessionStorage` if defined.

### `QUnit.config.reorder` (boolean) | default: `true`

By default, QUnit will run tests first that failed on a previous run. In a large testsuite, this can speed up testing a lot.

It can also lead to random errors, in case your testsuite has non-atomic tests, where the order is important. You should fix those issues, instead of disabling reordering!

When a failed test is running first, `Rerunning previously failed test` is displayed in the summary whereas just `Running` is displayed otherwise.

### `QUnit.config.requireExpects` (boolean) | default: `false`

The `expect()` method is optional by default, though it can be useful to require each test to specify the number of expected assertions.

Enabling this option will cause tests to fail, if they don't call `expect()` at all.

### `QUnit.config.testId` (array) | default: `undefined`

This property allows QUnit to run specific tests identified by the hashed version of their module name and test name. You can specify one or multiple tests to run.

### `QUnit.config.testTimeout` (number) | default: `undefined`

Specify a global timeout in milliseconds after which all tests will fail with an appropriate message. Useful when async tests aren't finishing, to prevent the testrunner getting stuck. Set to something high, e.g. 30000 (30 seconds) to avoid slow tests to time out by accident.

### `QUnit.config.scrolltop` (boolean) | default: `true`

By default, scroll to top of the page when suite is done. Setting this to false will leave the page scroll alone.

### `QUnit.config.urlConfig` (array)

This property controls which form controls to put into the QUnit toolbar element (below the header). By default, the "noglobals" and "notrycatch" checkboxes are there. By extending this array, you can add your own checkboxes and select lists.

Each element should be an object with an `id` property (used as the config and query-string key) and a `label` property (used as text in the UI), and optionally a `tooltip` property (used as the   title attribute to explain what the control does). Each element should also have a `value` property controlling available options and rendering.

If `value` is undefined, the option will render as a checkbox. The corresponding URL parameter will be set to "true" when the checkbox is checked, and otherwise will be absent.

If `value` is a string, the option will render as a checkbox. The corresponding URL parameter will be set to the string when the checkbox is checked, and otherwise will be absent.

If `value` is an array, the option will render as a select-one with an empty first option, followed by an option for each element of the array, with text and value matching the element. The corresponding URL parameter will be absent when the empty option is selected, and otherwise will be set to the value of the selected array element.

If `value` is an object, the option will render as a select-one with an empty first option, followed by an option for each property of the object, with text and value matching the name and value (respectively) of the property. The corresponding URL parameter will be absent when the empty option is selected, and otherwise will be set to the value of the selected object property.

See also the examples below.

### Examples

Disable autostart, useful when loading tests asynchronsly, here using requirejs:

```js
QUnit.config.autostart = false;
require(
  [ "tests/testModule1", "tests/testModule2" ],
  function() {
    QUnit.start();
  }
);
```

Access `QUnit.config.current.testName` to pass the current test's name on to another tool

```js
QUnit.test("some test", function() {
  // a few regular assertions
  // then a call to another tool
  speedTest( QUnit.config.current.testName, codeUnderTest );
});
```

---

Add a new checkbox to the toolbar, using the `urlConfig` property. This assumes there's other code on the page that will check the `QUnit.config.min` property to react to the selection.

```js
QUnit.config.urlConfig.push({
  id: "min",
  label: "Minified source",
  tooltip: "Load minified source files instead of the regular unminified ones."
});
```

---

Add a dropdown to the toolbar, using the `urlConfig` property. This assumes there's other code on the page that will check the `QUnit.config.jquery` property to react to the selection, loading the appropiate jQuery Core version.

```js
QUnit.config.urlConfig.push({
  id: "jquery",
  label: "jQuery version",
  value: [ "1.7.2", "1.8.3", "1.9.1" ],
  tooltip: "What jQuery Core version to test against"
});
```

---

Preconfiguring QUnit

If you want to configure QUnit before it is loaded, you can introduce the global variable `QUnit` with the property `config` specified. All other properties of the QUnit object will be ignored. In the config properties you may specify any of the allowed QUnit.config values.

```js
// QUnit is not yet loaded here
window.QUnit = {
  config: {
    autoStart: false,
    noGlobals: true,
  }
};
```
