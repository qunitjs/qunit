/*globals QUnit:true*/
/*jshint node:true*/
var QUnit = require( "../dist/QUnit" );

// Options: { output: "minimal" || "verbose" }
QUnit.reporter();

// Load QUnit tests
require( "./logs" );
require( "./test" );
require( "./assert" );
require( "./async" );
require( "./promise" );
require( "./modules" );
require( "./deepEqual" );
require( "./globals" );
require( "./globals-node" );

module.exports = QUnit.done;

QUnit.load();
