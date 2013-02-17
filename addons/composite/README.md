Composite - A QUnit addon for running multiple test files
================================

Composite is a QUnit addon that, when handed an array of files, will
open each of those files inside of an iframe, run the tests, and
display the results as a single suite of QUnit tests.

The "Rerun" link next to each suite allows you to quickly rerun that suite,
outside the composite runner.

If you want to see what assertion failed in a long list of assertions,
just use the regular "Hide passed tests" checkbox.

### Usage ###

Load QUnit itself as usual _plus_ `qunit-composite.css` and `qunit-composite.js`,
then specify the test suites to load using `QUnit.testSuites`:

```js
QUnit.testSuites([
    "example-test-1.html",
    "example-test-2.html",
    // optionally provide a name and path
    { name: "Example Test 3", path: "example-test-3.html" }
]);
```

Optionally, give the composed module a name (defaults to "Composition #1"):

```
QUnit.testSuites( "Example tests", [
    "example-test-1.html",
    "example-test-2.html"
]);
```

### Notes ###
 - Although it is possible to do so, we do not recommend mixing QUnit Composite suites (`QUnit.testSuites`) on the same page
   as regular tests and modules (`QUnit.test`/`test`, `QUnit.module`/`module`).
 - The QUnit Composite addon cannot be used for testing suites on the "file://" protocol **if** any of the referenced suites
   are outside of the test page's directory (e.g. `../test.html`) due to web security restrictions. You can work around this
   restriction by running them in Google Chrome or [PhantomJS](http://phantomjs.org), _with web security disabled_ &mdash; or,
   of course, by not referencing suites outside of the current test page's directory.
