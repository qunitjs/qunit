---
layout: post
title: "QUnit 1.11 - A Look Back (and Forth)"
author: jzaefferer
tags:
- feature
---
		
Earlier this week, we released a new version of [QUnit](http://qunitjs.com/), jQuery's solution for unit testing JavaScript. Along with some details on the new release, I wanted to take this opportunity to tell you a bit more about QUnit, where it came from and where it is going. [I'm also looking for your input](https://docs.google.com/spreadsheet/viewform?formkey=dDBzQl9TWmQzbDdXS08wMTBuLTlObXc6MQ#gid=0), to help us shape the future of JavaScript testing.

## New in 1.11

The most visible change (aside from our new purple logo) is a runtime display for individual tests. Before, QUnit would show you how long it took to run a full test suite. Now it'll also show individual times for each test, making it easy to spot slow tests in your test suite. Since it's useful to have unit tests finish within seconds, tuning tests now becomes a bit easier.

Other changes are mostly bug fixes to built-in features, and various improvements to&nbsp;[add-ons](http://qunitjs.com/addons/). There's&nbsp;[a new theme](http://jquery.github.com/qunit/addons/themes/ninja.html), a overhaul of the&nbsp;[PhantomJS add-on](https://github.com/jquery/qunit/tree/master/addons/phantomjs) to use its [callback system](https://github.com/ariya/phantomjs/wiki/API-Reference#wiki-webpage-onCallback) and more. Check out the [changelog](https://github.com/jquery/qunit/blob/v1.11.0/History.md) for a full list of changes.

## QUnit's Evolution

Unlike jQuery UI and jQuery Mobile, QUnit doesn't have a code dependency on jQuery, it just happens to be developed as a jQuery Foundation project. How did that happen? It all started a long time ago, but in a galaxy pretty close by. Back in 2006, this guy named John was working on jQuery and wrote his own little unit test runner, since there wasn't much to start with. Two years later, John and I figured that this test runner would be useful as a standalone tool, and it got the name QUnit, as a mashup of jQuery and [JUnit](http://junit.org/). It lived in the same SVN repository as jQuery itself, along with a few pages on the jQuery wiki.

In 2009, we moved it to [its own GitHub repository](https://github.com/jquery/qunit) and rewrote QUnit to get rid of the dependency on jQuery. Until October 2011, QUnit was just updated in master, without versioned releases, which kind of worked, but also caused maintenance and dependency headaches. I finally tagged 1.0.0, along with regular releases since then. Recently, QUnit got its own [website](http://qunitjs.com/) and [API reference](http://api.qunitjs.com/).

## Moving Forward

Today QUnit is used not only to test jQuery Core, jQuery UI and jQuery Mobile, but many other other projects as well. One notable example is [Ember.js](http://emberjs.com/). Those guys don't get tired of telling me how great QUnit is, putting emphasis on the reliability. We'd like to find out more about how developers are using QUnit, so if you're using QUnit (or planning to), please take a few minutes to [complete this brief survey](https://docs.google.com/spreadsheet/viewform?formkey=dDBzQl9TWmQzbDdXS08wMTBuLTlObXc6MQ#gid=0).

From the ~50 answers we've received so far, it's clear that people use QUnit since it's so easy to get started with, and we certainly intend to keep it that way. It's also clear that a lot of people are looking for tools and guides on integrating QUnit in [CI](http://en.wikipedia.org/wiki/Continuous_integration) tools like [Jenkins](http://jenkins-ci.org/), which is also something we're planning to work on. Along with that comes a heavy refactoring of the QUnit codebase, which currently lives in a single JS file (and a sister CSS file). We're [going to split the codebase](https://github.com/jquery/qunit/issues/378) into a few modules, which should help future maintenance and make it easier to integrate other libraries. This will allow us to improve our diff implementation, for instance.

If you're interested in following future QUnit updates, [follow @qunitjs on Twitter](https://twitter.com/qunitjs) and watch the [project on GitHub](https://github.com/jquery/qunit).

-----

_Originally published on [blog.jquery.com](https://blog.jquery.com/2013/01/24/qunit-1-11-release-a-look-back-and-forth/)._
