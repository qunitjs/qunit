---
layout: post
title: "QUnit 3 Theme: A New Look"
image: /resources/2026-theme-qunit-3-compared.png
author: krinkle
excerpt: Accessibility and usability improvements, faster rendering, and a fresh color palette.
tags:
- feature
---

Today, we take a look at changes to the default theme that landed in QUnit 3.

<figure><img src="/resources/2026-theme-qunit-3-compared.png" width="603" height="335" alt="QUnit 2.25 and 3.0 side-by-side running a passing test. Differences include: Less clutter, more space for test results, edge-to-edge design instead of rounded corners with white padding around the page, higher contrast in colors with a more vibrant green and deeper black."><figcaption markdown="span">[Try it here: **Demo**](/resources/q4000.html){: target="_blank"}</figcaption></figure>

## Accessibility

### Legibility

We have a fresh color palette that favors deeper and more vibrant colors, with higher contrast against respective backgrounds. This makes text clearer and more legible.

The new palette is based on [qunit-theme-ember](https://blog.ignacemaes.com/how-to-use-the-new-ember-theme-for-qunit/) by Ignace Maes (available via `theme: 'ember'` in [ember-qunit v8.1](https://github.com/emberjs/ember-qunit/pull/1166)), which in turn is based on the [Ember styleguide](https://ember-styleguide.netlify.app/).

The new color palette features fewer unique colors, and the remaining colors more distict. This simplied palette makes for a more uniform look, where colors have a consistent purpose. For example, the toolbar no longer uses green for checkbox labels, and the blue background is now reserved for passing tests.

Previously, the summary block in the header shared this shade of blue. This made sense back when the summary was part of the page, but it feels out of place since introducing a fixed header in [QUnit 2.14]({% post_url 2021-01-12-qunit-2-14-0 %}).

<figure><img src="/resources/2026-theme-qunit-3-failure-compared.png" width="795" height="593" alt="Failing test example, QUnit 2.25 and 3.0 side-by-side."><figcaption markdown="span">[Try it here: **Example failure**](/resources/example-fail.html){: target="_blank"}</figcaption></figure>

### Usability fixes

A few examples from [Pull Request #1774](https://github.com/qunitjs/qunit/pull/1774):

* Move "Abort" button to the left. Previously this button floated somewhat-randomly somewhere on the right. The toolbar now occupies the same height during the "running" and "completed" state, avoiding a visible layout shift.
* Fix module selector buttons to use logical order in the DOM, benefiting tab order and screen readers. Previously, the order was reversed with the default theme using `float: right` to re-reverse them visually.
* Fix "todo" and "skipped" labels to include a space character in the DOM, separating it from the test name. Previously the separation was only visual (with CSS margin), thus the word "skipped" and the first word of the test title would be presented semantically as one word. This affected screen readers, but also text selection and clipboard copying.
* Fix double-bolding and tripple-bolding of the assertion counts after each test item (due to `<b>` inside `<strong>`). In browsers and fonts that support "bolder" (e.g. Firefox) this rendered text with ever-wider glyphs. 

And more:

* Fix unexpected pointer cursor on "Source:" label. [52bfa69645](https://github.com/qunitjs/qunit/commit/52bfa69645ca1e83787eee450c4025f05d9bb249)
* Fix text selection to exclude "Rerun" link. [6becc199e0](https://github.com/qunitjs/qunit/commit/6becc199e081b14b7b1ae72b96fee75cf3efb56f)
* Change `#qunit-banner` from `<h2>` to `<div>`, to fix WCAG compliance. [#1427](https://github.com/qunitjs/qunit/issues/1427)
* Change `#qunit-testresult` from `<p>` to `<div>`, to fix HTML serialization. [#1301](https://github.com/qunitjs/qunit/issues/1301)


<mark>TODO: Image of before-after running state with Abort button and progress bar.</mark>

### Floating summary

<mark>TODO: Maybe link to https://github.com/qunitjs/qunit/pull/1760</mark>

The summary now reports the total duration in seconds instead of milliseconds ([170acc0311](https://github.com/qunitjs/qunit/commit/170acc0311d3dea4684b4ed39d1445fbbf522554)). This is a more human-scale number, especially for large projects. For small numbers we round to 1 digit of precision, and thus reporting 123ms as 0.1s. For number smaller than 100ms,
    I opted for a longer format with at always 1 significant digit, so reporting
    20ms as 0.02s, instead of e.g. forcefully rounding either down to a confusing
    0.0s or a deceptively high 0.1s. It allows for a little pride/recognition of
    small numbers


The summary now only counts tests instead of also counting assertions ([dbeab48c25](https://github.com/qunitjs/qunit/commit/dbeab48c2592e92eae12f9f157624996de5f8817), [8f25f26264](https://github.com/qunitjs/qunit/commit/8f25f26264812689476298c99c586122ab3add9c)). The low-level assertion concept is not actionable, especiallly in aggregate. For example, a [todo test]({% link api/QUnit/test.todo.md %}) includes assertions that are expected to fail.

QUnit 2.x:

> 257 tests completed in 512 milliseconds, with 0 failed, 7 skipped, and 4 todo.<br>
> 825 assertions of 829 passed, 4 failed.

QUnit 3.0:

> 257 tests completed in 0.5 seconds.<br>
> 246 passed, 0 failed, 7 skipped, and 4 todo.


See also [Benefit of assert.expect revisited]({% post_url 2023-07-11-eslint-assert-expect %}) and [QUnit.done § Caveats]({% link api/callbacks/QUnit.done.md %}).

## Focus

### Edge-to-edge design

The rounded corners and blank space around the page make way for a tighter edge-to-edge design, leaving more space for test results and details, the content. (The blank space came from margin on the body element, as set by the browser's default stylesheet.)

Similar blank space was removed from assertion details. Status indicators are now flush with the edge, making them stand out more. The change does not compromise any whitespace or line-height around text.
### Relocate user agent string

When reviewing test results, you generally know which browser the results are from. Either you're in it, and ran it there locally, or (in CI) you probably got there by clicking through a matrix job for one specific browser.

The user agent and QUnit version used to feature prominently in bold, with a text shadow, on a dedicated line under the title. This is relocated to inside the title bar, using a muted font. The new placement remains prominent, but no longer demands attention and frees some vertical space.

## Layout

Other accessibility improvements:

* Fix overflow and scrollbar issues. [#1603](https://github.com/qunitjs/qunit/issues/1603)

## Instant rendering

Faster UI rendering, now instantly instead of after DOM-ready. [#1793](https://github.com/qunitjs/qunit/pull/1793).

https://qunitjs.com/blog/2022/04/16/redesign-module-selector/ 

See also:

Previously:

* [Blog: Fast & fuzzy module selector]({% post_url 2022-04-16-redesign-module-selector %})
* [QUnit 2.19.0 Released: Faster HTML startup]({% post_url 2022-04-28-qunit-2-19-0 %})
* [QUnit 2.18.2 Released: Instant module filter]({% post_url 2022-04-17-qunit-2-18-2 %})
* [QUnit 2.7.0 Released: HTML Reporter Performance]({% post_url 2018-10-10-qunit-2-7-0 %})


## 

…

## Headless optimization

Faster headless execution, when [`id=qunit` element](https://qunitjs.com/browser/) does not exist. [#1711](https://github.com/qunitjs/qunit/issues/1711)

Faster "Hide passed" toggling on large test suites. [a729421411](https://github.com/qunitjs/qunit/commit/a7294214116ab5ec0e111b37c00cc7e2c16b4e1b)


### Color blind

We used Ignace's Ember theme as basis and refined it slightly to comply with [WCAG guidelines](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast), and to increase contrast under color blind conditions.

Especially for deuteranopia (no green), where greens tend to blur with reds, we tweaked toward yellow and made it brighter. Details in [Pull Request #1803](https://github.com/qunitjs/qunit/pull/1803#issuecomment-2552148092).

<figure><a href="/resources/2026-theme-qunit-3-colorblind-before.png" target="_blank" title="Open in new window"><img src="/resources/2026-theme-qunit-3-colorblind-before.png" width="675" height="296" alt=""></a><figcaption>QUnit 2.25 (before) simulated with deuteranopia</figcaption></figure>
<figure><a href="/resources/2026-theme-qunit-3-colorblind-ember.png"><img src="/resources/2026-theme-qunit-3-colorblind-ember.png" width="675" height="323" alt=""></a><figcaption>Ember theme</figcaption></figure>
<figure><a href="/resources/2026-theme-qunit-3-colorblind-after.png"><img src="/resources/2026-theme-qunit-3-colorblind-after.png" width="675" height="323" alt=""></a><figcaption>QUnit 3.0 (after)</figcaption></figure>

## Details

Misc changes from https://github.com/qunitjs/qunit/pull/1774, such as:
* Adopt system-ui fonts, remove any text shadows.
    
* Remove 2px offset hack from checkboxes to make them vertically aligned.


* `#qunit-toolbar` now parents `#qunit-banner`, `#qunit-testresult`, and `#qunit-filteredTest`.
* `#qunit-header` now parents `H1` and `#qunit-userAgent`.
  See also: Theme API.



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

* [HTML Reporter: New design for QUnit 3 · Pull Request #1774](https://github.com/qunitjs/qunit/pull/1774).
* [Increase contrast in test results and diff colors · Pull Request #1803](https://github.com/qunitjs/qunit/pull/1803)
* Theme API: TODO Link here


The theme has been rebalanced to give more space to the details that matter most.
