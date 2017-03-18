"use strict";

const path = require( "path" );
const exec = require( "execa" ).shell;
const co = require( "co" );

const expectedOutput = require( "./fixtures/expected/tap-outputs" );

// Executes the provided command from within the fixtures directory
function execute( command ) {
	const cwd = process.cwd();
	process.chdir( path.join( __dirname, "fixtures" ) );

	const execution = exec( command );

	process.chdir( cwd );

	return execution;
}

QUnit.module( "CLI Main", function() {
	QUnit.test( "defaults to running tests in 'test' directory", co.wrap( function* ( assert ) {
		const command = "qunit";
		const execution = yield execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} ) );

	QUnit.test( "errors if no test files are found to run", co.wrap( function* ( assert ) {
		try {
			yield execute( "qunit does-not-exist.js" );
		} catch ( e ) {
			assert.equal( e.stderr.indexOf( "No files were found matching" ), 0 );
		}
	} ) );

	QUnit.test( "accepts globs for test files to run", co.wrap( function* ( assert ) {
		const command = "qunit 'glob/**/*-test.js'";
		const execution = yield execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} ) );

	QUnit.test( "runs a single JS file", co.wrap( function* ( assert ) {
		const command = "qunit single.js";
		const execution = yield execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} ) );

	QUnit.test( "runs multiple JS files", co.wrap( function* ( assert ) {
		const command = "qunit single.js double.js";
		const execution = yield execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} ) );

	QUnit.test( "runs all JS files in a directory matching an arg", co.wrap( function* ( assert ) {
		const command = "qunit test";
		const execution = yield execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} ) );

	QUnit.test( "runs multiple types of file paths", co.wrap( function* ( assert ) {
		const command = "qunit test single.js 'glob/**/*-test.js'";
		const execution = yield execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} ) );

	QUnit.test( "exit code is 1 when failing tests are present", co.wrap( function* ( assert ) {
		try {
			yield execute( "qunit fail/*.js" );
		} catch ( e ) {
			assert.equal( e.code, 1 );
		}
	} ) );
} );
