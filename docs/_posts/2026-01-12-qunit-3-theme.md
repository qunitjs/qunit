---
layout: post
title: "New theme for QUnit 3"
author: krinkle
excerpt: Faster rendering, accessibility improvements, and a fresh color palette.
tags:
- feature
---

QUnit 3 comes with a new design for the HTML Reporter, featuring improved color contrast, and a fresh color palette.

## Accessility

Color contrast.

Change `#qunit-banner` from H2 to DIV, to fix WCAG compliance. [#1427](https://github.com/qunitjs/qunit/issues/1427)

Change `#qunit-testresult` from P to DIV, to fix HTML serialization. [#1301](https://github.com/qunitjs/qunit/issues/1301)

Fix color constrast of details in failed test results. [#1803](https://github.com/qunitjs/qunit/pull/1803)

## Instant rendering

Faster UI rendering, now instantly instead of after DOM-ready. [#1793](https://github.com/qunitjs/qunit/pull/1793).

## Edge-to-edge design

…

## Fresh color pallete

…

## Headless optimization

Faster headless execution, when [`id=qunit` element](https://qunitjs.com/browser/) does not exist. [#1711](https://github.com/qunitjs/qunit/issues/1711)

Faster "Hide passed" toggling on large test suites. [a729421411](https://github.com/qunitjs/qunit/commit/a7294214116ab5ec0e111b37c00cc7e2c16b4e1b)

## Misc

* HTML Reporter: New design with fresh color palette and improved color contrast. View demos in [#1774](https://github.com/qunitjs/qunit/pull/1774).
* Add support for displaying early errors. [#1786](https://github.com/qunitjs/qunit/pull/1786)
* Change assertion count in toolbar to test count. [#1760](https://github.com/qunitjs/qunit/pull/1760)
* Change runtime in toolbar from milliseconds to seconds. [#1760](https://github.com/qunitjs/qunit/pull/1760)
* Fix text selection to exclude "Rerun" link. [6becc199e0](https://github.com/qunitjs/qunit/commit/6becc199e0)
* Fix overflow and scrollbar issues. [#1603](https://github.com/qunitjs/qunit/issues/1603)
