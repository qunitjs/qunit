---
layout: page
title: Command-line interface
redirect_from:
  - "/node/"
amethyst:
  toc: true
---

<p class="lead" markdown="1">

How to use the QUnit CLI (command-line interface), after [installing it from npm](./intro.md#in-nodejs).

</p>

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

global.MyApp = require( './index' );
```

See [QUnit.config](./api/config/index.md) for all available configuration options.

### `--seed`

This option assigns [`QUnit.config.seed`](./api/config/seed.md) for you.

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
