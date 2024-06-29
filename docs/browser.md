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

### Filter

Enter a search phrase to re-run only tests that match the phrase. It performs a case-insensitive substring match by default, on both the module name and test name. You can use regular expressions, and/or invert the match to exclude tests instead.

Read [filter](./api/config/filter.md) for examples.

### Module selector

To quickly re-run one or more modules of tests, select them from the module selector and press "Apply".

You can use the input field to quickly find a module, even if you have many modules. The input field performs [fuzzy matching](https://github.com/farzher/fuzzysort), so don't worry about getting it exactly right! `baor game` and `boar dame` finds "board game". This is similar to how "Quick Open" works in modern text editors.

When selecting a parent module, which contains [nested modules](./api/QUnit/module.md), the nested modules and their tests will also be run.

### Test results

Each result is displayed in a numbered list. After the name of the test, in parentheses, are the number of failed, passed, and total assertions. Click the entry to show the results of each assertion, with details about expected and actual results (for failed asssertions).

The "Rerun" link at the end will run that test on its own.

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
