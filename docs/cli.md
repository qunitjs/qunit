---
layout: page
title: Command-line Interface
excerpt: Test JavaScript code in Node.js with the QUnit CLI.
redirect_from:
  - "/node/"
amethyst:
  toc: true
---

<p class="lead" markdown="1">

This tutorial gets you up-and-running with QUnit in Node.js.

</p>

_For browser automations from the command-line, refer to [Browser automation](./browser.md#integrations) instead._

## Getting started

Getting started with QUnit to test your Node.js projects is quick and easy.<br>
First, install the [qunit](https://www.npmjs.com/package/qunit) package from `npm`:

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

Now, let's start writing tests!<br>
Create a file in a test directory, for example `test/add.js`, and write the following:

```js
const add = require('../add.js');

QUnit.module('add');

QUnit.test('two numbers', (assert) => {
  assert.equal(add(1, 2), 3);
});
```

This defines a test suite for the "add" feature, with a single test case that verifies the result of adding two numbers together.

You can now run your first test. It is recommended that you run the `qunit` command via npm test, which will automatically find the `qunit` program in your local `node_modules` folder. That's where npm downloads the dependencies. In your `package.json` file, specify it like so:

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

**Congrats!** You just wrote and executed your first QUnit test!

```bash
TAP version 13
ok 1 add > two numbers
1..1
# pass 1
# skip 0
# todo 0
# fail 0
```

Check out the [API documentation](./api/index.md) to learn more. For example, use [`QUnit.module()`](./api/QUnit/module.md) to organize test, or make other kinds of comparisons via the [assertion methods](./api/assert/index.md).

## Efficient development

As your project grows, you may reach a point where the complete test suite takes more than a second to run. QUnit provides several ways to maintain a fast feedback cycle on the command-line.

* Use [`--watch`](#--watch) to automatically re-run tests after making changes to your files.
* When building out a larger feature, use [`--filter`](#--filter) or `--module` to run only a subset of tests.

## QUnit CLI options

```
Usage: qunit [options] [files]

  Files should be a space-separated list of files, directories, or glob expressions.
  Defaults to 'test/**/*.js'.

Options:
  -V, --version          output the version number
  -f, --filter <filter>  run only matching module or test names
  -m, --module <name>    run only the specified module
  -r, --reporter [name]  specify the reporter to use
  --require <module>     specify a module or script to include before running any tests
  --seed [value]         specify a seed to re-order your tests
  -w, --watch            watch files for changes and re-run the test suite
  -h, --help             display help for command
```

### `--filter`

Only run tests that match the given filter. The filter is matched against the module and test name, and may either be substring match (case insensitive), or a regular expression.

Examples: `--filter foo`, `--filter !foo`, `--filter "/foo/"`, `--filter "!/foo/"`

Check [`QUnit.config.filter`](./api/config/filter.md) for more information.

### `--module`

Only run tests that belong to the specified module. The name is matched case-insensitively, but must otherwise be complete.

Examples: `--module foo`, `--module "Foo"`

Check [`QUnit.config.module`](./api/config/module.md) for more information.

### `--reporter`

By default, the TAP reporter is used.

Run `qunit --reporter <name>` to use a different reporter, where `<name>` can be the name of a built-in reporter, or an Node module that implements the [js-reporters](https://github.com/js-reporters/js-reporters) spec. The reporter will be loaded and initialised automatically.

Built-in reporters:

* `tap`: [TAP compliant](https://testanything.org/) reporter.
* `console`: Log the JSON object for each reporter event from [`QUnit.on`](./api/callbacks/QUnit.on.md). Use this to explore or debug the reporter interface.

### `--require`

These modules or scripts will be required before any tests begin running.

This can be used to install Node.js require hooks, such as for TypeScript ([ts-node/register](https://typestrong.org/ts-node/docs/)), Babel ([@babel/register](https://babeljs.io/docs/en/babel-register/)), or CoffeeScript ([coffeescript/register](https://coffeescript.org/)).

It can also be used for your own setup scripts to bootstrap the environment, or tweak `QUnit.config`. For example:

```bash
qunit --require ./test/setup.js
```

```js
// test/setup.js
QUnit.config.noglobals = true;
QUnit.config.notrycatch = true;

global.MyApp = require('./index');
```

See [QUnit.config](./api/config/index.md) for all available configuration options.

### `--seed`

This option assigns [`QUnit.config.seed`](./api/config/seed.md) for you.

### `--watch`

Automatically re-run your tests after file changes in the current directory.

In watch mode, QUnit will run your tests once initially, and then keep watch mode open to re-run tests after files changed anywhere in or under the current directory. This includes adding or removing files.

## Node.js CLI options

The QUnit CLI uses Node.js. You can pass [Node.js CLI](https://nodejs.org/api/cli.html) options via the [`NODE_OPTIONS`](https://nodejs.org/api/cli.html#cli_node_options_options) environment variable. For example, to use `--enable-source-maps` or `--inspect`, invoke QUnit as follows:

```
NODE_OPTIONS='--enable-source-maps' qunit test/
```

## Code coverage

Generate code coverage reports with [nyc](https://istanbul.js.org/):

```json
{
  "scripts": {
    "test": "nyc qunit"
  },
  "devDependencies": {
    "nyc": "*",
    "qunit": "*"
  }
}
```

See [/test/integration/nyc/](https://github.com/qunitjs/qunit/tree/main/test/integration/nyc) in the QUnit repo for a minimal example.

For a more elaborate example showcasing a unified test coverage report for tests in both Node.js and a headless browser, see [Krinkle/example-node-and-browser-qunit](https://github.com/Krinkle/example-node-and-browser-qunit-ci/).

## Node.js support policy

QUnit follows the <a href="https://github.com/nodejs/LTS" target="_blank">Node.js Long-term Support (LTS) schedule</a> and provides support for at least the Current, Active LTS, and Maintenance LTS releases.

## npm Package name

Since QUnit 2.4.1, the official npm package is [qunit](https://www.npmjs.com/package/qunit).

Earlier versions of QUnit were published to npm under the name "qunit**js**" instead of "qunit". To download these earlier versions refer to the [qunitjs](https://www.npmjs.com/package/qunitjs) package.

The 0.x and 1.x versions of the "qunit" package held an alternative CLI, now known as [node-qunit](https://github.com/qunitjs/node-qunit).
