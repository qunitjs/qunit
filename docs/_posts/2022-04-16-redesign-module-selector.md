---
layout: post
title: "Redesign module selector - Fast & Fuzzy"
image: https://user-images.githubusercontent.com/156867/162635924-ddaacfc5-4817-46ea-81a8-024048954668.gif
author: krinkle
tags:
- feature

---

The typeahead field for the module dropdown menu is now faster, fuzzier, and fully keyboard accessible!

## Faster startup

Matthew Beale [noticed](https://github.com/qunitjs/qunit/issues/1664) that on test suites with 800 modules, test startup was sometimes delayed by ~5 seconds in Chrome 95.

In previous QUnit versions, we eagerly rendered the dropdown menu with options for all module names. (The menu is only shown on focus.) The JavaScript code for this only takes about 5-10ms (0.005 seconds), even on very large projects. But, every so often there is an unexplained slow task right after this function. This performance issue did not affect Firefox and Safari.

Whatever the cause may be, we've cut this cost by lazily rendering the menu when the module field is first focussed.

<figure>
<img alt="Chrome DevTools shows 3ms spent in native parseHTML, as part of the moduleListHtml() function. The next task is an unexplained grey box, 5 seconds wide. Its type is unknown, and has no children or parent associations." src="https://user-images.githubusercontent.com/8752/140397773-5780d375-c731-4111-b703-bb76815c63ea.png">
<figcaption>After a few milliseconds in our moduleListHtml function, Chrome spends 5 seconds in an unknown task.</figcaption>
</figure>

* [q4000 Benchmark on QUnit 2.18.1](https://codepen.io/Krinkle/full/MYgqNpQ)
* [q4000 Benchmark on QUnit 2.18.2](https://codepen.io/Krinkle/full/gbYdVRr)

## Instant typeahead

<div class="figure-row">
<figure>
<figcaption>Before (QUnit 2.18.1)</figcaption>
<img alt="Before: While typing a word, the module list remains unchanged. One beat after you stop typing, the results appear at once. (GIF animation)" src="https://user-images.githubusercontent.com/156867/162635920-a167c006-0130-4a42-a903-0a6d70e464d9.gif">
</figure>
<figure>
<figcaption>After (QUnit 2.18.2)</figcaption>
<img alt="After: While typing a word, the module list updates in real-time on each keystroke. (GIF animation)" src="https://user-images.githubusercontent.com/156867/162635924-ddaacfc5-4817-46ea-81a8-024048954668.gif">
</figure>
</div>

We previously applied a 200 ms input debounce on filtering the dropdown menu. It seems a lot people type _just_ fast enough for the menu to sit idle until you stop typing. This provides a subpar user experience, because you won't know if what you typed will find what you're looking for, until you stop typing.

The module selector in QUnit is powered by the super fast [fuzzysort.js](https://github.com/farzher/fuzzysort) library. Fuzzysearch actually takes only ~1ms, so it should be able to keep up in real-time, even for projects with hundreds of QUnit modules defined. I considered removing this debounce entirely, but that risks causing a different kind of lag instead.

The new design lowers the debounce to a delay of 0 ms.[^1] The module selector now feels smooth as butter, with an instant response on every key stroke.

[Try it here: **q4000 Benchmark**](/resources/q4000.html){: target="_blank"}

### What's the difference between a 0 ms debounce, and no debounce?

Consider what happens if you type faster than the browser rendering can keep up with. For example, rendering may take longer in some cases. The event handler will be running and, meanwhile, another character is typed.

Without a debounce, these keyboard events will pile up. Each one will be honoured and diligently played back-to-back and in order. Each event callback will _begin_ its rendering long after other keystrokes were already sent. It will feel akin to acting on a remote server over bad WiFi, with an ever-growing backlog of unprocessed input events.

With 0 ms debounce, we queue up at most 1 render callback, and that "next" render will always be for the then-current value of the input field. Another way to look at it: It is as if, whenever we finish a rendering, we will cancel all-except-the-last pending callbacks.

For the common case where rendering is quick enough to keep up with keystrokes, both ways improve what we had before. Both ways will render results immediately on every keystroke, with no delay. Check [Debounce demo on CodePen](https://codepen.io/Krinkle/pen/wvpXxwM?editors=0010) to experience the difference.

## Accessibility

The redesign includes various usability and accessibility improvements for the module dropdown menu.

Highlights:

* Currently selected choices are now hoisted to the top and always visible, even if not matched by the current filter.
* There is no longer a "dead" tab target between the action buttons and the first menu option (see below animation).
* The focus ring for the "Apply" button is no longer clipped on two sides by overflow (see below animation).
* More breathable design for options and buttons. Toolbar buttons have a solid outline and no longer lost in a sea of greyness.

<div class="figure-row">
<figure>
<img alt="" width="530" src="https://user-images.githubusercontent.com/156867/163740098-26e9bfde-cdac-4035-99b9-19146b2d63e4.gif">
<figcaption>Keyboard navigation (before)</figcaption>
</figure>
<figure>
<img alt="" width="530" src="https://user-images.githubusercontent.com/156867/163740122-e1af8c35-35c8-4596-a367-1f7d2f904e75.gif">
<figcaption>Keyboard navigation (after)</figcaption>
</figure>

<figure>
<img alt="" width="748" src="https://user-images.githubusercontent.com/156867/163740197-abcf8f9a-f440-4a02-ac3e-d345b38268c3.png">
<figcaption>Button and list design (before)</figcaption>
</figure>
<figure>
<img alt="" width="748" src="https://user-images.githubusercontent.com/156867/163740193-df44e637-dab4-4915-aec4-dd02905914ec.png">
<figcaption>Button and list design (after)</figcaption>
</figure>

<figure>
<img alt="" width="455" src="https://user-images.githubusercontent.com/156867/163740288-d0e45308-d714-43a9-bf9c-1c198b5e55ba.png">
<figcaption>Selection and cursor (before)</figcaption>
</figure>
<figure>
<img alt="" width="458" src="https://user-images.githubusercontent.com/156867/163740299-9fb2b8ee-02ab-4dc3-993b-0d70daca8005.png">
<figcaption>Selection and cursor (after)</figcaption>
</figure>

<figure>
<img alt="" width="467" src="https://user-images.githubusercontent.com/156867/163740326-4254ef7b-0ced-424a-a2ae-2f209a65f0b8.png">
<figcaption>Placeholder (before)</figcaption>
</figure>
<figure>
<img alt="" width="467" src="https://user-images.githubusercontent.com/156867/163740324-dd5f9b8c-913f-493c-be0d-a58b9a9641f2.png">
<figcaption>Placeholder (after)</figcaption>
</figure>
</div>

## Love The Fuzz

In [fuzzysort.js](https://github.com/farzher/fuzzysort), each result is internally ranked on a range from several thousands points below zero (worst) upto 1.0 (perfect match).

One of the Fuzzysort features is the "threshold" option, which omits results below a certain score. We previously had this to `-1000`, which sounds like it should let most results through.

<div class="figure-row">
<figure>
<figcaption>Before</figcaption>
<img alt="Before: No results for 'support for pomise'" src="https://user-images.githubusercontent.com/156867/162635139-3f3bd458-e322-4479-b5a2-cab8cff22751.png" width="479">
</figure>
<figure>
<figcaption>After</figcaption>
<img alt="After: Various results even for 'suortprose eachwhit'" src="https://user-images.githubusercontent.com/156867/162635233-70105acc-114e-4e9b-a9b3-d7d7ffcf68e0.png" width="470">
</figure>
</div>

In practice, it corresponded to tolerating a few missing letters in the first word. For example, `suort for promise` did find `support for promise`. But, `support for pomise` already yielded zero results, despite only missing one letter!

This is counter-intuitive and contrary to how fuzzy search works in text editors. For example, in Sublime Text, all files of which you have typed a subset of the name, are included. It is only when you type a character that isn't in an entry's name, that it is removed from the options.

In this redesign, I've disabled the "threshold", which achieves the desired effect.

## See also

* [HTML Reporter: Faster startup and improved usability of module filter · Issue #1664](https://github.com/qunitjs/qunit/issues/1664)
* [HTML Reporter: Faster and fuzzier module dropdown · Pull Request #1685](https://github.com/qunitjs/qunit/pull/1685)
* [QUnit 2.18.2 Release]({% post_url 2022-04-17-qunit-2-18-2 %})
* [Blog: Introduce mult-select module picker]({% post_url 2016-04-21-introduce-multi-select-module-picker %}), April 2016.

-------

Footnotes:

[^1]: Note that timers from [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout) have a minimum delay of 4ms in practice, which is close enough to zero.
