#!/usr/bin/env node

"use strict";

const program = require( "commander" );
const run = require( "../src/cli/run" );
const { displayAvailableReporters } = require( "../src/cli/find-reporter" );
const pkg = require( "../package.json" );

const description = `Runs tests using the QUnit framework.

  Files should be a space-separated list of file/directory paths and/or glob
  expressions. Defaults to 'test/**/*.js'.

  For more info on working with QUnit, check out https://qunitjs.com.`;

function collect( val, collection ) {
	collection.push( val );
	return collection;
}

program._name = "qunit";
program
	.version( pkg.version )
	.usage( "[options] [files]" )
	.description( description )
	.option( "-f, --filter <filter>", "filter which tests run" )
	.option( "-r, --reporter [name]", "specify the reporter to use; " +
		"if no match is found or no name is provided, a list of available " +
		"reporters will be displayed" )
	.option( "--require <module>", "specify a module or script to include before running " +
		"any tests.", collect, [] )
	.option( "--seed [value]", "specify a seed to order your tests; " +
		"if option is specified without a value, one will be generated" )
	.option( "-w, --watch", "watch files for changes and re-run the test suite" )
	.parse( process.argv );

const opts = program.opts();

if ( opts.reporter === true ) {
	const requireQUnit = require( "../src/cli/require-qunit" );
	displayAvailableReporters( requireQUnit().reporters );
}

const options = {
	filter: opts.filter,
	reporter: opts.reporter,
	requires: opts.require,
	seed: opts.seed
};

if ( opts.watch ) {
	run.watch( program.args, options );
} else {
	run( program.args, options );
}
