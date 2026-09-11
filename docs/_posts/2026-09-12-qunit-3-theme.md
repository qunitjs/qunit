---
layout: post
title: "First Look at the QUnit 3 Theme"
image: /resources/2026-theme-qunit-3-compared.png
author: krinkle
excerpt: Accessibility, a refined color palette, and various usability improvements.
tags:
- feature
---

A deep dive into the accessibility and usability improvements to the default theme in QUnit 3.

<figure><img src="/resources/2026-theme-qunit-3-compared.png" width="603" height="335" alt="QUnit 2.25 and 3.0 side-by-side running a passing test. Differences include: Higher contrast in colors with a more vibrant green and deeper black, less clutter, more space for test results, and an edge-to-edge design instead of white padding around the page."><figcaption markdown="span">[Try it here: **Demo**](/resources/q4000.html){: target="_blank"}</figcaption></figure>

<figure><video src="/resources/2026-theme-qunit-3-vid-before.mp4" width="380" height="215" loop muted autoplay playsinline disablepictureinpicture controlslist="nodownload" preload="auto" style="vertical-align: top; cursor: pointer;" onclick="this.requestFullscreen();"></video><video src="/resources/2026-theme-qunit-3-vid-after.mp4" width="380" height="241" loop muted autoplay playsinline disablepictureinpicture controlslist="nodownload" preload="auto" style="vertical-align: top; cursor: pointer;" onclick="this.requestFullscreen();"></video></figure>

## Accessibility & Legibility

The updated theme favors deeper and more vibrant colors, with higher contrast against respective backgrounds. We've also removed any text shadows and adopted the system-ui font. This makes text clearer and easier to read.

This new color palette is based on [qunit-theme-ember](https://blog.ignacemaes.com/how-to-use-the-new-ember-theme-for-qunit/) by Ignace Maes (available via `theme: 'ember'` in [ember-qunit v8.1](https://github.com/emberjs/ember-qunit/pull/1166)) which in turn is based on the [Ember styleguide](https://ember-styleguide.netlify.app/).

The simpler palette utilizes fewer colors overall, and the remaining colors carry a consistent meaning.

For example, the toolbar no longer re-uses green for checkbox labels, and blue backgrounds are now reserved for passing tests. Previously, the summary block shared the same shade of blue. This made sense in QUnit 1 where the page itself essentially had a blue background, and the summary was part of the page flow. See also the introduction of a fixed header in [QUnit 2.14]({% post_url 2021-01-12-qunit-2-14-0 %}).

<figure><img src="/resources/2026-theme-qunit-3-failure-compared.png" width="795" height="593" alt="Failing test example, QUnit 2.25 and 3.0 side-by-side."><figcaption markdown="span">[Try it here: **Example failure**](/resources/example-fail.html){: target="_blank"}</figcaption></figure>

### Focus

The old rounded corners and blank space around the page make way for a tighter **edge-to-edge design**, leaving more space for test results and assertion details—the stuff that matters.

Assertion indicators are now flush with the edge against a lighter background, making them stand out more. The change does not sacrifice any whitespace or line height around text.

The user agent string moves to the title bar, in a muted font. This new placement remains prominent, but no longer demands your attention, and frees some vertical space.

The summary now reports total duration in seconds, instead of milliseconds ([170acc0](https://github.com/qunitjs/qunit/commit/170acc0311d3dea4684b4ed39d1445fbbf522554)). This is a more human-scale number, especially for large projects. For those of you proud to have test suites that complete in under a second, we still preserve one digit of precision. Small numbers are happy numbers!

QUnit 2.x:

> 257 tests completed in 512 milliseconds, with 0 failed, 7 skipped, and 4 todo.<br>
> 825 assertions of 829 passed, 4 failed.

QUnit 3.0:

> 257 tests completed in 0.5 seconds.<br>
> 246 passed, 0 failed, 7 skipped, and 4 todo.

The summary no longer reports on low-level assertion counts. The assertion counts were distracting and inactionable in practice. For example, a passing ["todo" test]({% link api/QUnit/test.todo.md %}) expects failing assertions and these counted towards the internal "failed" assertion count despite not failing the run ([dbeab48](https://github.com/qunitjs/qunit/commit/dbeab48c2592e92eae12f9f157624996de5f8817), [8f25f26](https://github.com/qunitjs/qunit/commit/8f25f26264812689476298c99c586122ab3add9c)).

### Color blindness

We refined the Ember theme slightly to comply with [WCAG guidelines](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast), and to increase contrast under color blind conditions. Especially for deuteranopia, where greens and reds are hard to distinguish, we tweaked our greens be brighter and closer to yellow. Details in [Pull Request #1803](https://github.com/qunitjs/qunit/pull/1803#issuecomment-2552148092).

Shout out to Firefox Dev Tools, which made this a breeze!

<figure><a href="/resources/2026-theme-qunit-3-firefox-a11y-devtools.png"><img src="/resources/2026-theme-qunit-3-firefox-a11y-devtools.png" width="540" height="267" alt="Simulate deuteranopia (no green), protanopia (no red), and other color blindnesses in the Acessibility tab of Firefox Dev Tools."></a></figure>
<figure><a href="/resources/2026-theme-qunit-3-colorblind-before.png" title="Open in new window"><img src="/resources/2026-theme-qunit-3-colorblind-before.png" width="675" height="296" alt=""></a><figcaption>QUnit 2.25 (before) simulated with deuteranopia</figcaption></figure>
<figure><a href="/resources/2026-theme-qunit-3-colorblind-ember.png"><img src="/resources/2026-theme-qunit-3-colorblind-ember.png" width="675" height="323" alt=""></a><figcaption>Ember theme</figcaption></figure>
<figure><a href="/resources/2026-theme-qunit-3-colorblind-after.png"><img src="/resources/2026-theme-qunit-3-colorblind-after.png" width="675" height="323" alt=""></a><figcaption>QUnit 3.0 (after)</figcaption></figure>

## Usability fixes

* Fix module selector buttons to use logical order in the DOM, improving tab order for keyboard navigation and screen readers. [#1774](https://github.com/qunitjs/qunit/pull/1774)
* Fix WCAG compliance by changing `#qunit-banner` from empty `<h2>` to `<div>`. [#1427](https://github.com/qunitjs/qunit/issues/1427)
* Fix HTML serialization by changing `#qunit-testresult` wrapper from `<p>` to `<div>`. [#1301](https://github.com/qunitjs/qunit/issues/1301)
* Fix text selection to exclude "Rerun" link, reducing noise in text you copy to the clipboard. [6becc19](https://github.com/qunitjs/qunit/commit/6becc199e081b14b7b1ae72b96fee75cf3efb56f)
* Fix "todo" and "skipped" labels to include a space character in the DOM, separating them from the test name. The separation used to be only visual (with CSS margin), causing "todo" and the first word of your test name to be read as one word by screen readers, and in clipboard text. [#1774](https://github.com/qunitjs/qunit/pull/1774)
* Fix unusually wide glyphs in the assertion counts (due to `<b>` inside `<strong>`, multiplying the font-weight "bolder" rule from the user agent stylesheet). [#1774](https://github.com/qunitjs/qunit/pull/1774)
* Exclude page title from fixed header to leave more vertical space for test results. [#1774](https://github.com/qunitjs/qunit/pull/1774)
* Fix layout shift in toolbar at the end of the run. The toolbar now occupies the same height during the "running" and "completed" states. [#1774](https://github.com/qunitjs/qunit/pull/1774)
* Fix unexpected pointer cursor on "Source" label. [52bfa69](https://github.com/qunitjs/qunit/commit/52bfa69645ca1e83787eee450c4025f05d9bb249)
* Fix overflow and scrollbar issues, by re-implementing the fixed header with `position: sticky`. This creates a regular page-level scrollbar for the test results, and the page now naturally flows under the toolbar. Until now, the test results had their own scrollable area. This fixes various layout quirks with fixtures and other content you may have on the test page, which could previously get squished or pushed outside the viewport. This fixes a regression that started in QUnit 2.14. [#1603](https://github.com/qunitjs/qunit/issues/1603)
* Move "Abort" button to the left. This button previously floated somewhat randomly to the right.
* Animate test execution with a new progress bar. The `#qunit-banner` used to be blank until it turned green or red.

## See also

* [Blog: Instant render and early errors in QUnit 3]({% post_url 2026-09-11-instant-render %})
* [New design for QUnit 3 · Pull Request #1774](https://github.com/qunitjs/qunit/pull/1774)
* [Increase contrast in test results and diff colors · Pull Request #1803](https://github.com/qunitjs/qunit/pull/1803)
