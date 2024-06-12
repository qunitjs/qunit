---
layout: page
title: Getting Started
amethyst:
  toc: true
redirect_from:
  - "/guides/"
---

<p class="lead" markdown="1">

This tutorial gets you up-and-running with QUnit in Node.js or [in the browser](./browser.md).

</p>

QUnit has no dependencies and supports Node.js, SpiderMonkey, and all [major browsers](./browser.md#browser-support).

## In Node.js

Getting started with QUnit for Node.js projects is quick and easy. First, install the [qunit](https://www.npmjs.com/package/qunit) package using `npm`:

```bash
npm install --save-dev qunit

# Or, if using Yarn:
yarn add --dev qunit
```

Let's create an example program that we can test! We'll start with a function that adds two numbers. Create a file `add.js` with the following contents:

```js
function add (a, b) {
  return a + b;
}

module.exports = add;
```

Now, let's start writing tests! Create a file in a test directory, for example `test/add.js`, and write the following:

```js
const add = require('../add.js');

QUnit.module('add');

QUnit.test('two numbers', (assert) => {
  assert.equal(add(1, 2), 3);
});
```

This defines a test suite for the "add" feature, with a single test case that verifies the result of adding two numbers together. Refer to the [`QUnit.test()` page](./api/QUnit/test.md) in our API Documentation for how to organise tests and make other assertions.

You can now run your first test through the [QUnit CLI](./cli.md). It is recommended that you run the `qunit` command via an npm script, which will automatically find the `qunit` program in your local `node_modules` folder, which is where npm keeps the dependencies you download. In your `package.json` file, specify it like so:

```json
{
  "scripts": {
    "test": "qunit"
  }
}
```

Then run:

```bash
npm test
```

Congrats! You just wrote and executed your first QUnit test!

```bash
TAP version 13
ok 1 add > two numbers
1..1
# pass 1
# skip 0
# todo 0
# fail 0
```

Check out the [API documentation](./api/index.md) to learn more about the QUnit APIs for organising tests and making assertions. See [Command-line Interface](./cli.md) for what the `qunit` command can do.

### Support policy

QUnit follows the <a href="https://github.com/nodejs/LTS" target="_blank">Node.js Long-term Support (LTS) schedule</a> and provides support for Current, Active LTS, and Maintenance LTS releases.

### Package name prior to 2.4.1

Prior to QUnit 2.4.1, the npm package was published under the name "qunit**js**" instead of "qunit". To install earlier versions of QUnit for Node, check out [qunitjs](https://www.npmjs.com/package/qunitjs).

The 0.x and 1.x versions of the "qunit" package on npm holds an alternative CLI that is now published as [node-qunit](https://github.com/qunitjs/node-qunit).

---

## Linting

The [eslint-plugin-qunit](https://github.com/platinumazure/eslint-plugin-qunit) package has a variety of rules available for enforcing best testing practices as well as detecting broken tests.

---

## Download

These are the official release channels for QUnit releases:

* Download:

  QUnit has no runtime dependencies for browser use. You can save the [`qunit-2.21.0.js`](https://code.jquery.com/qunit/qunit-2.21.0.js) and [`qunit-2.21.0.css`](https://code.jquery.com/qunit/qunit-2.21.0.css) files directly from the [jQuery CDN](https://code.jquery.com/qunit/).

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

  QUnit 1.x and QUnit 2.x releases were published to [Bower](https://bower.io/), and remain available there.

  For QUnit 3.0 and later, either download and check-in the JS and CSS file directly (e.g. using the curl command above), or install the `qunit` package from npm as a dev dependency.

---

## Further reading

* [Introdution to JavaScript Unit Testing](https://coding.smashingmagazine.com/2012/06/introduction-to-javascript-unit-testing/), Jörn Zaefferer (2012).
