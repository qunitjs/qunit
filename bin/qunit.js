#!/usr/bin/env node

"use strict";

const program = require( "commander" );
const run = require( "../src/cli/run" );
const FindReporter = require( "../src/cli/find-reporter" );
const pkg = require( "../package.json" );

const findReporter = FindReporter.findReporter;
const displayAvailableReporters = FindReporter.displayAvailableReporters;

const description = `Runs tests using the QUnit framework.

  Files should be a space-separated list of file/directory paths and/or glob
  expressions. Defaults to 'test/**/*.js'.

  For more info on working with QUnit, check out http://qunitjs.com.`;

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
	.option( "--require <module>", "specify a module to require prior to running " +
		"any tests.", collect, [] )
	.option( "--seed [value]", "specify a seed to order your tests; " +
		"if option is specified without a value, one will be generated" )
	.option( "-w, --watch", "Watch files for changes and re-run the test suite" )
	.parse( process.argv );

if ( program.reporter === true ) {
	displayAvailableReporters();
}

const args = program.args;
const options = {
	filter: program.filter,
	reporter: findReporter( program.reporter ),
	requires: program.require,
	seed: program.seed
};

if ( program.watch ) {
	run.watch( args, options );
} else {
	run( args, options );
}
