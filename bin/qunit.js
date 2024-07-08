#!/usr/bin/env node

'use strict';

const program = require('commander');
const run = require('../src/cli/run');
const { displayAvailableReporters } = require('../src/cli/find-reporter');
const pkg = require('../package.json');

const description = `Runs tests using the QUnit framework.

  Files should be a space-separated list of files, directories, or glob expressions.
  Defaults to 'test/**/*.{js,mjs,cjs}'.

  For more info on working with QUnit, check out https://qunitjs.com.`;

function collect (val, collection) {
  collection.push(val);
  return collection;
}

program._name = 'qunit';
program
  .version(pkg.version)
  .usage('[options] [files]')
  .description(description)
  .option('-f, --filter <filter>', 'run only matching module or test names')
  .option('-m, --module <name>', 'run only the specified module')
  .option('-r, --reporter [name]', 'specify the reporter to use; ' +
    'if no match is found or no name is provided, a list of available ' +
    'reporters will be displayed')
  .option('--require <module>', 'specify a module or script to include before running ' +
    'any tests.', collect, [])
  .option('--seed <value>', 'specify a seed to re-order your tests; ' +
    'set to "true" to generate a new seed')
  .option('-w, --watch', 'watch files for changes and re-run the test suite')
  .parse(process.argv);

const opts = program.opts();

if (opts.reporter === true) {
  displayAvailableReporters();
}

const options = {
  filter: opts.filter,
  module: opts.module,
  reporter: opts.reporter,
  requires: opts.require,
  seed: opts.seed
};

if (opts.watch) {
  run.watch(program.args, options);
} else {
  run(program.args, options);
}
