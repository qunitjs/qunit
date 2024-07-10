---
layout: page
title: Browser Runner
excerpt: Test JavaScript code in a real browser.
amethyst:
  toc: true
redirect_from:
  - "/cookbook/"
---

<p class="lead" markdown="1">

Test JavaScript code in a real browser with QUnit.

</p>

## Getting started

QUnit releases are standalone and require no runtime dependencies for use in the browser. To get started, all you need is an HTML file that loads two files: `qunit.js` and `qunit.css`.


```html
<!DOCTYPE html>
<html>
<meta charset="utf-8">
<title>QUnit</title>
<link rel="stylesheet" href="https://code.jquery.com/qunit/qunit-2.21.0.css">
<body>
  <div id="qunit"></div>
  <div id="qunit-fixture"></div>
  <script src="https://code.jquery.com/qunit/qunit-2.21.0.js"></script>
  <!-- <script src="your_app.test.js"></script> -->
</body>
</html>
```

This is typically saved as `/test.html` or `/test/index.html` in your project.

The above example loads QUnit from the jQuery CDN. For improved experience during local or offline development, it is recommended to [install or download QUnit](intro.md#download) within your project. Some [integrations](#integrations), like Web Test Runner and Karma, can auto-create the HTML from a list of JS files or glob pattern.

Let's add the following script, which tests an "add" function that adds two numbers together:

```html
<script>
function add(a, b) {
  return a + b;
}

QUnit.module('add', function() {
  QUnit.test('two numbers', function(assert) {
    assert.equal(add(1, 2), 3);
  });
});
</script>
```

Open your HTML file in a browser to find a detailed report. Live example ([open in a new tab](./resources/example-add.html){:target="_blank"}):

<iframe loading="lazy" title="Example test suite running in the browser" src="/resources/example-add.html" style="height: 380px;"></iframe>

**Congrats!** You just executed your first QUnit test!

## Fixture

Don't worry about DOM changes from one test affecting other tests, because QUnit will automatically reset the markup after each test. As long as you append or insert your elements inside the fixture, you will never have to manually clean up after your tests.

This helps keep your tests them atomic!

Find examples and learn more at [`QUnit.config.fixture`](./api/config/fixture.md).

## Efficient development

As your project grows, you may reach a point where the complete test suite takes more than a second or two to run. QUnit provides several automatic and optional ways to maintain a good feedback cycle.

QUnit's [reorder feature](./api/config/reorder.md) automatically remembers failing tests, and prioritizes those when you reload the page, running them before all other tests. Together with "Hide passed tests" in the [toolbar](#html-reporter), this let's you stay focussed by running and showing only what matters most.

When building out a larger feature, you can use the [module selector](#module-selector) to re-run only the tests (and nested modules) under one or more selected module names.

## Browser support

QUnit currently supports the following browsers:

* Internet Explorer: 9+
* Edge: 15+ (both legacy MSEdge and Chromium-based)
* Firefox: 45+
* Safari: 9+
* Opera: 36+
* Chrome: 58+
* Android: 4.3+
* iOS: 7+ (Mobile Safari)

For older browsers, such as Internet Explorer 6-8, Opera 12+, or Safari 5+, please use QUnit 1.x, which you can download from the [release archives](https://releases.jquery.com/qunit/).

## Integrations

### Linting

The [eslint-plugin-qunit](https://github.com/platinumazure/eslint-plugin-qunit) package has a variety of rules available for enforcing best testing practices as well as detecting broken tests.

### Browser automation

The following integrations can be used to automate the running of browser tests with QUnit:

* [grunt-contrib-qunit](https://github.com/gruntjs/grunt-contrib-qunit) for [Grunt task runner](https://gruntjs.com/) (test Headless Chrome).
* [testem](https://github.com/testem/testem) (test any local browser, including headless)
* [wdio-qunit-service](https://webdriver.io/docs/wdio-qunit-service/) (test any local, headless, or cloud browser; via WDIO selenium driver)
* [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/) with [web-test-runner-qunit](https://github.com/brandonaaron/web-test-runner-qunit) (test any local, headless, or cloud browser)
* [Karma](https://karma-runner.github.io/latest/index.html) with [karma-qunit](https://github.com/karma-runner/karma-qunit) (test any local browser or cloud).
* [node-qunit-puppeteer](https://github.com/ameshkov/node-qunit-puppeteer) (test Headless Chrome).
* [StealJS](https://stealjs.com/) with [steal-qunit](https://stealjs.com/docs/steal-qunit.html) via [Testee](https://www.npmjs.com/package/testee) (test any local browser or cloud).
* [testcafe](https://github.com/DevExpress/testcafe) (test any local browser or cloud).

Example projects:

* [Krinkle/example-node-and-browser-qunit-ci](https://github.com/Krinkle/example-node-and-browser-qunit-ci/): Run QUnit tests locally and in CI, on Headless Firefox and Chrome (using Karma), and with Node.js.<br/>Also demonstrates code coverage, and testing of isomorphic JavaScript projects.

## URL parameters

* [hidepassed](./api/config/hidepassed.md)
* [noglobals](./api/config/noglobals.md)
* [notrycatch](./api/config/notrycatch.md)
* [filter](./api/config/filter.md)
* [module](./api/config/module.md)
* [moduleId](./api/config/moduleId.md)
* [testId](./api/config/testId.md)
* [seed](./api/config/seed.md)

## Markup

QUnit requires no HTML markup in order to run tests. The above "Getting started" example is recommended for new projects, but you can customize this as-needed.

To display test results, the only markup necessary is a `<div>` with `id="qunit"`. Without this, the tests will run with the [HTML Reporter](#html-reporter) disabled.

[Browser automations](#integrations) that run tests for you from the command-line, might enable other reporters or event listeners instead. For example, they might use a TAP reporter, or [`QUnit.on()`](./callbacks/QUnit.on.md) to automatically extract results in a machine-readable way, and use it to set the build status of a continuous integration job (CI).

## HTML Reporter

The header of the report displays:
* the page title.
* a green bar when all tests passed, or a red bar if one or more tests failed.
* the `navigator.userAgent` string, handy when comparing results captured from different browsers.

### Toolbar

[Hide passed tests](./api/config/hidepassed.md) is useful when a lot of tests ran and only a few failed. Ticking the checkbox will show only the tests that failed..

[Check for globals](./api/config/noglobals.md) detects if a test creates or removes  global variable is. QUnit keeps a list of properties found on the `window` object. If properties were added or removed, the test fails.

[No try-catch](./api/config/notrycatch.md) instructs QUnit to run your tests without a try-catch block. In this mode, if your test throws an error it will interrupt QUnit, which may ease debugging.

You can extend the toolbar via [QUnit.config.urlConfig](./api/config/urlConfig.md).

### Filter

Enter a search phrase to re-run only tests that match the phrase. It performs a case-insensitive substring match by default, on both the module name and test name. You can use regular expressions, and/or invert the match to exclude tests instead.

Find examples and learn more at [QUnit.config.filter](./api/config/filter.md).

### Module selector

To quickly re-run one or more modules of tests, select them from the module selector and press "Apply".

You can use the input field to quickly find a module, even if you have many modules. The input field performs [fuzzy matching](https://github.com/farzher/fuzzysort), so don't worry about getting it exactly right! `baor game` and `boar dame` finds "board game". This is similar to how "Quick Open" works in modern text editors.

When selecting a parent module, which contains [nested modules](./api/QUnit/module.md), the nested modules and their tests will also be run.

### Test results

Each result is displayed in a numbered list.

> **MyApp: example** (3) _Rerun_

After the name of the module and test, in parentheses, is the total number of assertions.

The "Rerun" link at the end will run that test on its own, skipping all other tests.

Click anywhere on result to expand the entry, which reveals the message of each assertion.

For failed assertions, the parenthetical reports the failed, passed, and total number of assertions. The expanded view also displays the expected and actual asserted value, with a diff to highlight the difference between the two values.

<iframe loading="lazy" title="Example failure" src="/resources/example-fail.html" style="height: 500px;"></iframe>

### Theme API

The HTML Reporter populates the `<div id="qunit">` element with the following structure:

QUnit 1.x, 2.x:

```html
<div id="qunit">
  <h1 id="qunit-header">…</h1>
  <h2 id="qunit-banner"></h2>
  <div id="qunit-testrunner-toolbar">…</div>
  <h2 id="qunit-userAgent">…</h2>
  <p id="qunit-testresult">…</p>
  <ol id="qunit-tests"></ol>
</div>
```

<details markdown="1">
<summary>As of QUnit 3.0</summary>

```html
<div id="qunit">
  <div id="qunit-header">
    <h1>…</h1>
    <div id="qunit-userAgent">…</div>
  </div>
  <div id="qunit-toolbar">
    <div id="qunit-banner"></div>
    <div id="qunit-testrunner-toolbar"></div>
    <div id="qunit-testresult"></div>
  </div>
  <ol id="qunit-tests"></ol>
</div>
```

</details>

-----

You can style these to create your own theme, or add custom styles to the default theme.

Examples: [Theme plugins](./plugins.md)

The following selectors are considered stable and supported:

| Selector | Description
|--|--
| `#qunit-header`<br><br>`#qunit-header a` | Displays the page title, with an anchor link that will reload the page and re-run all tests.
| `#qunit-banner`<br><br>`#qunit-banner.qunit-pass`<br><br>`#qunit-banner.qunit-fail` | Indicates the test run status. It carries no class while tests are in progress. Once completed, the `qunit-pass` or `qunit-fail` indicated the completed status as reported by the [runEnd event](./api/callbacks/QUnit.on.md#the-runend-event).
| `#qunit-testrunner-toolbar` | The toolbar.
| `#qunit-userAgent` | QUnit version and user agent string.
| `#qunit-modulefilter` | Module selector.
| `#qunit-modulefilter-dropdown` | Module selector, dropdown menu.
| `#qunit-modulefilter-actions`<br><br>`#qunit-modulefilter-actions button` | Module selector, top area of dropdown menu with "Reset" and "Apply" buttons.
| `#qunit-modulefilter .clickable`<br><br>`#qunit-modulefilter .clickable.checked` | Module selector, options in the dropdown menu.
{:class="table-style-api"}

### HTML API

#### Test output `id="qunit-test-output-TESTID"`

You may rely on an element with the following ID existing during test execution. This includes during [module hooks](./api/QUnit/module.md#hooks), [global hooks](./api/QUnit/hooks.md), and during the test itself and its assertions.

Seeking an element by this ID during an event, or during a different test, may work at your own risk. This is because the HTML Reporter may not have created the element yet, or may have removed it from the DOM (e.g. when [hidepassed](./api/config/hidepassed.md) is enabled).

Demos:
* [ColorFactory test page](https://krinkle.github.io/node-colorfactory/test/) ([Source code](https://github.com/Krinkle/node-colorfactory/blob/cd79287c09eb0e7118eb4a45811786c65d0640b7/test/testinit.js#L25-L43))
* [Fabric.js test page](http://fabricjs.com/test/visual/?coverage) ([Source code](https://github.com/fabricjs/fabric.js/blob/v6.0.0-rc5/test/lib/visualCallbackQunit.js#L41))

The test ID can be obtained from [QUnit.config.current](./api/config/current.md).

```js
QUnit.hooks.afterEach(function () {
  var target = '#qunit-test-output-' + QUnit.config.current.testId;
});

QUnit.assert.myplugin = function (actual, expected) {
  var target = '#qunit-test-output-' + QUnit.config.current.testId;
};
```

#### Toolbar HTML

It is recommended to extend the toolbar declaratively via [QUnit.config.urlConfig](./api/config/urlConfig.md). Modifying the toolbar elements directly may work at your own risk.
