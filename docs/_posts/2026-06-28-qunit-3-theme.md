---
layout: post
title: "QUnit 3: Theme: A Refined Look"
image: /resources/2026-theme-qunit-3-compared.png
author: krinkle
excerpt: Accessibility, speed, and a refined color palette.
tags:
- feature
---

A deep dive into the faster and more accessible theme for QUnit 3.

<figure><img src="/resources/2026-theme-qunit-3-compared.png" width="603" height="335" alt="QUnit 2.25 and 3.0 side-by-side running a passing test. Differences include: Higher contrast in colors with a more vibrant green and deeper black, less clutter, more space for test results, and an edge-to-edge design instead of white padding around the page."><figcaption markdown="span">[Try it here: **Demo**](/resources/q4000.html){: target="_blank"}</figcaption></figure>

<figure><video src="/resources/2026-theme-qunit-3-vid-before.mp4" width="380" height="215" loop muted autoplay playsinline disablepictureinpicture controlslist="nodownload" preload="auto" style="vertical-align: top;"></video><video src="/resources/2026-theme-qunit-3-vid-after.mp4" width="380" height="241" loop muted autoplay playsinline disablepictureinpicture controlslist="nodownload" preload="auto" style="vertical-align: top;"></video></figure>

## Accessibility & Legibility

The updated theme favors deeper and more vibrant colors, with higher contrast against respective backgrounds. We've also removed any text shadows and adopted the system-ui font. This makes text clearer and easier to read.

The new color palette is based on [qunit-theme-ember](https://blog.ignacemaes.com/how-to-use-the-new-ember-theme-for-qunit/) by Ignace Maes (available via `theme: 'ember'` in [ember-qunit v8.1](https://github.com/emberjs/ember-qunit/pull/1166)), which in turn is based on the [Ember styleguide](https://ember-styleguide.netlify.app/).

The palette utilizes fewer colors overall, and the remaining colors are more distict. This simplied palette makes for a more uniform look, where colors have a consistent meaning.

For example, the toolbar no longer re-uses green for checkbox labels, and blue backgrounds are now reserved only for passing tests. Previously, the summary block in the header shared the same shade of blue. This made sense originally in QUnit 1 where the summary was part of the page flow, but since the introduction of the fixed header in [QUnit 2.14]({% post_url 2021-01-12-qunit-2-14-0 %}) it feels out of place.

<figure><img src="/resources/2026-theme-qunit-3-failure-compared.png" width="795" height="593" alt="Failing test example, QUnit 2.25 and 3.0 side-by-side."><figcaption markdown="span">[Try it here: **Example failure**](/resources/example-fail.html){: target="_blank"}</figcaption></figure>

### Focus

The old rounded corners and blank space around the page make way for a tighter **edge-to-edge design**, leaving more space for test results and assertion details—the stuff that matters.

Assertion status indicators are now flush with the edge, making them stand out more. The change does not compromise any whitespace or line height around text.

The **user agent string** has been relocated to the title bar, using a muted font. This new placement remains prominent, but no longer demands your attention and frees some vertical space.

The summary now reports total duration in seconds instead of milliseconds ([170acc0](https://github.com/qunitjs/qunit/commit/170acc0311d3dea4684b4ed39d1445fbbf522554)). This is a more human-scale number, especially for large projects. For those of you proud to have test suites that complete in under a second, we still preserve one digit of precision. Small numbers are happy numbers!

QUnit 2.x:

> 257 tests completed in 512 milliseconds, with 0 failed, 7 skipped, and 4 todo.<br>
> 825 assertions of 829 passed, 4 failed.

QUnit 3.0:

> 257 tests completed in 0.5 seconds.<br>
> 246 passed, 0 failed, 7 skipped, and 4 todo.

The summary also displays test counts now instead of assertion counts. The assertion numbers felt low-level and were inactionable. For example, assertions in a ["todo" test]({% link api/QUnit/test.todo.md %}) are expected to fail but would count towards the "failed" number despite not failing the build ([dbeab48](https://github.com/qunitjs/qunit/commit/dbeab48c2592e92eae12f9f157624996de5f8817), [8f25f26](https://github.com/qunitjs/qunit/commit/8f25f26264812689476298c99c586122ab3add9c)).

### Color blindness

We used Ignace's Ember theme as basis and refined it slightly to comply with [WCAG guidelines](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast), and to increase contrast under color blind conditions. Especially for deuteranopia, where greens and reds are hard to distinguish, we tweaked our greens be brighter and closer to yellow. Details in [Pull Request #1803](https://github.com/qunitjs/qunit/pull/1803#issuecomment-2552148092).

Shout out to Firefox Dev Tools, which made this a breeze!

<figure><a href="/resources/2026-theme-qunit-3-firefox-a11y-devtools.png"><img src="/resources/2026-theme-qunit-3-firefox-a11y-devtools.png" width="540" height="267" alt="Simulate deuteranopia (no green), protanopia (no red), and other color blindnesses in the Acessibility tab of Firefox Dev Tools."></a></figure>
<figure><a href="/resources/2026-theme-qunit-3-colorblind-before.png" title="Open in new window"><img src="/resources/2026-theme-qunit-3-colorblind-before.png" width="675" height="296" alt=""></a><figcaption>QUnit 2.25 (before) simulated with deuteranopia</figcaption></figure>
<figure><a href="/resources/2026-theme-qunit-3-colorblind-ember.png"><img src="/resources/2026-theme-qunit-3-colorblind-ember.png" width="675" height="323" alt=""></a><figcaption>Ember theme</figcaption></figure>
<figure><a href="/resources/2026-theme-qunit-3-colorblind-after.png"><img src="/resources/2026-theme-qunit-3-colorblind-after.png" width="675" height="323" alt=""></a><figcaption>QUnit 3.0 (after)</figcaption></figure>

## Usability fixes

<mark>TODO: Image of before-after running state with Abort button and progress bar.</mark>

Other highlights:

* Fix module selector buttons to use logical order in the DOM, improving tab order for keyboard navigation and screen readers. [#1774](https://github.com/qunitjs/qunit/pull/1774)
* Fix WCAG compliance by changing `#qunit-banner` from `<h2>` to `<div>`. [#1427](https://github.com/qunitjs/qunit/issues/1427)
* Fix text selection to exclude "Rerun" link, to reduce noise in text you copy to the clipboard. [6becc19](https://github.com/qunitjs/qunit/commit/6becc199e081b14b7b1ae72b96fee75cf3efb56f)
* Fix "todo" and "skipped" labels to include a space character in the DOM, separating them from the test name. Previously the separation was visual only (with CSS margin), causing "todo" and the first word of your test name to be read as one word by screen readers, and in clipboard text. [#1774](https://github.com/qunitjs/qunit/pull/1774)
* Fix unusually wide glyphs in the assertion counts (due to `<b>` inside `<strong>`, multiplying the font-weight "bolder" rule from the user agent stylesheet). [#1774](https://github.com/qunitjs/qunit/pull/1774)
* Fix unexpected pointer cursor on "Source:" label. [52bfa69](https://github.com/qunitjs/qunit/commit/52bfa69645ca1e83787eee450c4025f05d9bb249)
* Fix overflow and scrollbar issues. [#1603](https://github.com/qunitjs/qunit/issues/1603)
* Fix HTML serialization by changing `#qunit-testresult` wrapper from `<p>` to `<div>`. [#1301](https://github.com/qunitjs/qunit/issues/1301)
* Move "Abort" button to the left. Previously this button floated somewhat-randomly on the right. The toolbar now occupies the same height during the "running" and "completed" state, elininating a noticable layout shift whenever a test run finishes. [#1774](https://github.com/qunitjs/qunit/pull/1774)




## Details


```
 Notable design changes:
    
    * Progress bar.
      The qunit-banner was previously blank until it turns green/red.
      Test execution is now animated with a blue progress bar.
    
    * Sticky header reduced to toolbar.
      Re-implemented using `position: sticky`, to create a normal
      page-level scrollbar instead of a scrollable area. The rest of the
      page naturally flows under it. This fixes various layout quirks,
      with custom elements no longer squished or pushed outside the viewport.
      This is similar to how things rendered prior to QUnit 2.14.
    
      The sticky part now excludes the page title and user agent,
      making more optimal use of vertical space.

    Fixed bug:
    


```

## See also

* [Blog: Instant rendering and early errors in QUnit 3](% post_url 2026-06-29-early-errors %)
* [New design for QUnit 3 · Pull Request #1774](https://github.com/qunitjs/qunit/pull/1774).
* [Increase contrast in test results and diff colors · Pull Request #1803](https://github.com/qunitjs/qunit/pull/1803)
