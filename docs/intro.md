---
layout: page
title: Getting Started
amethyst:
  toc: true
redirect_from:
  - "/guides/"
---

## In Node.js

[Getting Started in Node.js](./cli.md)

## In the browser

[Getting Started in the browser](./browser.md)

## Guides

Check these QUnit tutorials and examples, to make the most of your unit tests!

1. [QUnit.module](./api/QUnit/module.md#organizing-your-tests): How to group related tests.
1. [QUnit.test](./api/QUnit/test.md#examples): Define tests, How to wait for async code.
1. [Fixture feature](./browser.md#fixture): Keeping your DOM tests atomic.
1. [Step API](./api/assert/verifySteps.md): Testing asynchronous callbacks or event listeners.
1. [Assertions](./api/assert/index.md): Partial object comparison, expected exceptions, and much more.
1. [Browser](./browser.md): Productivity tricks, Browser automation, What can the toolbar do?
1. [CLI](./cli.md): Productivity tricks, Code coverage.
1. [Reporter API](./api/callbacks/QUnit.on.md#reporter-api): Event emitter, Create your own reporter.
1. [Theme API](./browser.md#theme-api): Create your own theme.

## Compatibility

QUnit supports the following browsers and runtime environments:

<table>
<thead>
<tr><td></td><th>QUnit 1</th><th>QUnit&nbsp;2</th><th>QUnit&nbsp;3</th><th>QUnit 3 (ESM)</th></tr>
</thead>
<tbody>
<tr><th>Internet Explorer</th><td>IE 6-11</td><td colspan=2>IE 9-11</td><td>&mdash;</td></tr>
<tr><th>Edge</th><td>1+</td><td colspan=2>15+<sup><abbr title="both legacy MSEdge and Chromium-based Edge">[?]</abbr></sup></td><td>16+</td></tr>
<tr><th>Firefox</th><td>3.6+</td><td colspan=2>45+</td><td>60+</td></tr>
<tr><th>Safari</th><td>4.0+</td><td colspan=2>9.1+</td><td>10.1+</td></tr>
<tr><th>Chrome</th><td>1+</td><td colspan=2>58+</td><td>61+</td></tr>
<tr><th>Chrome Mobile</th><td>&mdash;</td><td colspan=2>49+ (Android 4.4+)</td><td>61+ (Android 7+)</td></tr>
<tr><th>Opera</th><td>11+</td><td colspan=2>36+</td><td>48+</td></tr>
<tr><th>Android Browser</th><td>2.3 - 5.0</td><td colspan=2>4.3 - 5.0</td><td>&mdash;</td></tr>
<tr><th>iOS (Mobile Safari)</th><td>4.0+</td><td colspan=2>7.0+</td><td>10.3+</td></tr>
<tr><th>PhantomJS</th><td colspan=2>1.x</td><td colspan=2>&mdash;</td></tr>
<tr><th>Node.js</th><td>&mdash;</td><td>10+</td><td colspan=2>18+</td></tr>
<tr><th>SpiderMonkey</th><td>&mdash;</td><td colspan=3>68+<sup><abbr title="since QUnit 2.14">[?]</abbr></sup></td></tr>
</tbody>
</table>

You can download QUnit 1.x and QUnit 2.x from the [release archives](https://releases.jquery.com/qunit/).

## Support

To report a bug, request a new feature, or ask a question [open an issue](https://github.com/qunitjs/qunit/issues) on GitHub.

You can also find support on StackOverflow. Use the ["qunit" hashtag on StackOverflow](https://stackoverflow.com/questions/tagged/qunit) to search existing questions or ask your own question.

## Chat

If you need help, or want to participate in sharing and discussing ideas, join us in the chat room on Matrix at `#qunitjs_qunit:gitter.im`:

* **[Gitter web client](https://app.gitter.im/#/room/#qunitjs_qunit:gitter.im)**, browse the room as guest.
* [Element web client](https://app.element.io/#/room/#qunitjs_qunit:gitter.im), join and log in (with GitHub, GitLab, Google, or Apple ID), or sign up.
* [matrix.to link](https://matrix.to/#/#qunitjs_qunit:gitter.im?web-instance[element.io]=app.gitter.im), join with the Element native app or other Matrix client.

## Social media

Follow us:
* [Mastodon: @qunit@fosstodon.org](https://fosstodon.org/@qunit)
* [Bluesky: @qunitjs.com](https://bsky.app/profile/qunitjs.com)

Hashtags:
* [Mastodon: #qunit](https://mastodon.social/tags/qunit)
* [Bluesky: #qunit](https://bsky.app/hashtag/qunit)
* [Threads: #qunit](https://www.threads.net/search?q=%23qunit&serp_type=default)

---

## Linting

The [eslint-plugin-qunit](https://github.com/platinumazure/eslint-plugin-qunit) package has a variety of rules available for enforcing best testing practices as well as detecting broken tests.

---

<span id="release-channels"></span>

## Download

These are the official release channels for QUnit releases:

* Download:

  You can save the [`qunit-2.24.3.js`](https://code.jquery.com/qunit/qunit-2.24.3.js) and [`qunit-2.24.3.css`](https://code.jquery.com/qunit/qunit-2.24.3.css) files directly from the jQuery CDN.
  For older versions, browse the [release archives](https://releases.jquery.com/qunit/).

  Or download them via the terminal, and save them in your Git repository.

  ```bash
  curl -o qunit.css 'https://code.jquery.com/qunit/qunit-2.24.3.css'
  curl -o qunit.js 'https://code.jquery.com/qunit/qunit-2.24.3.js'
  ```

* npm Registry:

  If your development workflow uses [Node.js](https://nodejs.org/en/), you can install the [qunit](https://www.npmjs.com/package/qunit) package from the npm Registry, using the `npm` CLI:

  ```bash
  npm install --save-dev qunit
  ```

  Or, if using Yarn:
  ```bash
  yarn add --dev qunit
  ```

  You can then reference these in your HTML:
  ```html
  <link rel="stylesheet" href="./node_modules/qunit/qunit/qunit.css">
  <script src="./node_modules/qunit/qunit/qunit.js"></script>
  ```

  If your project uses an npm alternative that locates packages elsewhere, you may need to generate the HTML dynamically and use [`require.resolve()`](https://nodejs.org/api/modules.html#modules_require_resolve_request_options) to locate `qunit/qunit/qunit.js` and `qunit/qunit/qunit.css`. Alternatively, use one of the [Integrations](./browser.md#integrations) such as karma-qunit which can do this for you.

* Bower:

  QUnit 1.x and QUnit 2.x releases were published to [Bower](https://bower.io/), and remain available there  under the `qunit` package.

  For QUnit 3.0 and later, either download and commit the JS and CSS file directly in your project (e.g. using the curl command above), or install the `qunit` package from npm as a dev dependency.

---

## Further reading

* [Read QUnit documentation offline](https://devdocs.io/qunit/), via DevDocs.
* [Introduction to JavaScript Unit Testing](https://coding.smashingmagazine.com/2012/06/introduction-to-javascript-unit-testing/), Jörn Zaefferer (2012).
