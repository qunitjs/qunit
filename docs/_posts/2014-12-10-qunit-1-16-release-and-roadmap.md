---
layout: post
title: "QUnit 1.16 Release and Roadmap"
author: jzaefferer
tags:
- feature
---

We've just released QUnit 1.16, an important milestone for the project. This release introduces several new APIs that will become the default in QUnit 2.0. To help migrate to these APIs, you can start using them today in 1.16. Our 2.x upgrade guide provides all the details you need to change your existing test suite to the new APIs.

Here's a quick overview of the new APIs:

```js
QUnit.test('assert.async() test', function (assert) {
  var done = assert.async();
  var input = $('#test-input').focus();
  setTimeout(function () {
    assert.equal(document.activeElement, input[0], 'Input was focused');
    done();
  });
});
```

You still define tests by calling QUnit.test and passing a name and a callback. The callback receives a `assert` argument that contains all assertion methods. The [`assert.async()`](https://api.qunitjs.com/async/) method is brand new, replacing the old `stop()` method. The returned callback, here named `done` is later called when the test is finished, replacing the old `start()` method.

In addition, QUnit 1.16 contains several improvements and new features:

* [Promise support](https://api.qunitjs.com/QUnit.test/): As an enhancement for the async control, test blocks are now Promise aware, meaning QUnit will wait for the test to resolve with the pass or fail statement.
* QUnit asynchronous tests can also now be defined using the new `var done = assert.async()` method instead of the old `stop()`/`start()`, making them specific to the test block.
* [QUnit.skip](https://api.qunitjs.com/QUnit.skip/): This method can be used to define tests that aren't executed, as placeholders or to temporarily disable an existing test (instead of commenting it out). The skipped test is still displayed in the HTML reporter, marked prominently as "SKIPPED".
* `testId` URL parameter: When clicking the "Rerun" link for a single test, a hash of the test name is now used to reference the test, called `testId`, instead of the previous `testNumber`. Using a hash makes sure that the order of tests can change, and QUnit will still rerun the same test you've selected before.
* [CommonJS exports](https://github.com/jquery/qunit/blob/1.16.0/test/rhino-test.js): QUnit now also looks for a `exports` object and uses that to export itself, making QUnit usable on Rhino with the `-require` option.
* There are a few more minor changes. For a full list, [check out the changelog]({% post_url 2014-12-03-qunit-1-16-0 %}).

## Roadmap

For future releases, we have several improvements planned as well:

### Standardized reporter interface

Currently integration of any unit testing library into other tools like PhantomJS or browserstack-runner or Karma requires custom integration code, a combination of library and tools. We've started an effort to create a standard reporter interface that all testing libraries could implement, called [js-reporters](https://github.com/js-reporters/js-reporters/), to be consumed by those tools. Coordinating between the various projects and getting them to agree on and implement a common API takes time, but will yield better testing infrastructure for everyone.

### Better diff output

When writing unit tests that compare objects with deep structures or many properties, like Ember models or Moment instances, the current diff output is slow and inefficient. There are also comparisons where the diff is hard to read. Replacing the diff library and implementing custom optimizations, like only showing diffs for leafs in big objects, will make QUnit's HTML reporter even more developer friendly. We have [a list of all diff-related issues](https://github.com/jquery/qunit/labels/diff).

### Better support for writing custom assertions

Custom assertions are a powerful method of abstraction in test suites. They are currently underused. We want to [investigate better APIs](https://github.com/jquery/qunit/issues/533) for writing custom assertions, along with better documentation of existing and new APIs.

### Support for nested modules

Nesting modules, like Jasmine and Mocha support it, gives more flexibility in structuring test suites. There is [existing discussion and prototypes](https://github.com/jquery/qunit/pull/670), but no consensus on the API, yet.

For any breaking changes, we'll apply the same migration model that we're currently using. All backwards compatible changes will make it into the next minor release, any incompatible changes will be introduced with a migration layer in a minor release, removing the migration layer in the next major release.

## The QUnit Team

The QUnit team also would like to use this opportunity to introduce itself:

<figure>
	<a href="https://blog.jquery.com/wp-content/uploads/2014/12/DSC_10583.jpg"><img src="https://blog.jquery.com/wp-content/uploads/2014/12/DSC_10583-1024x507.jpg" alt="" width="584" height="289" /></a>
	<figcaption>At the jQuery Conference in Chicago, September 2014, from left to right: Jörn Zaefferer, Timo "Krinkle" Tijhof, James M. Greene, and Leonardo Balter.</figcaption>
</figure>

-----

_Originally published on [blog.jquery.com](https://blog.jquery.com/2014/12/10/qunit-1-16-release-and-roadmap/)._
