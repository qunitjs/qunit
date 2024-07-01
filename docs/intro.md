---
layout: page
title: Getting Started
amethyst:
  toc: true
redirect_from:
  - "/guides/"
---

<p class="lead" markdown="1">

Up-and-running with QUnit [in Node.js](./cli.md) or [in the browser](./browser.md).

</p>

## In Node.js

[Getting Started in Node.js](./cli.md)

## In the browser

[Getting Started in the browser](./browser.md)

---

## Linting

The [eslint-plugin-qunit](https://github.com/platinumazure/eslint-plugin-qunit) package has a variety of rules available for enforcing best testing practices as well as detecting broken tests.

---

## Download

These are the official release channels for QUnit releases:

* Download:

  You can save the [`qunit-2.21.0.js`](https://code.jquery.com/qunit/qunit-2.21.0.js) and [`qunit-2.21.0.css`](https://code.jquery.com/qunit/qunit-2.21.0.css) files directly from the jQuery CDN.
  For older versions, browse the [release archives](https://releases.jquery.com/qunit/).

  Or download them via the terminal, and save them in your Git repository.

  ```bash
  curl -o qunit.css 'https://code.jquery.com/qunit/qunit-2.21.0.css'
  curl -o qunit.js 'https://code.jquery.com/qunit/qunit-2.21.0.js'
  ```

* npm Registry:

  If your development workflow uses [Node.js](https://nodejs.org/en/), you can install the [qunit](https://www.npmjs.com/package/qunit) package the npm Registry, using the `npm` CLI:

  ```bash
  npm install --save-dev qunit
  ```

  Or, if using Yarn:
  ```bash
  yarn add --dev qunit
  ```

  You can then reference `node_modules/qunit/qunit/qunit.css` and `node_modules/qunit/qunit/qunit.js` in your HTML.

  If your project uses a custom npm frontend that locates packages elsewhere, you may need to generate the HTML dynamically and use [`require.resolve()`](https://nodejs.org/api/modules.html#modules_require_resolve_request_options) to locate `qunit/qunit/qunit.js` and `qunit/qunit/qunit.css`. Alternatively, use one of the [Integrations](./browser.md#integrations) such as karma-qunit which can do this for you.

* Bower:

  QUnit 1.x and QUnit 2.x releases were published to [Bower](https://bower.io/), and remain available there  under the `qunit` package.

  For QUnit 3.0 and later, either download and commit the JS and CSS file directly in your project (e.g. using the curl command above), or install the `qunit` package from npm as a dev dependency.

---

## Further reading

* [Introdution to JavaScript Unit Testing](https://coding.smashingmagazine.com/2012/06/introduction-to-javascript-unit-testing/), Jörn Zaefferer (2012).
