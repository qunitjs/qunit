"use strict";

const co = require( "co" );

const expectedOutput = require( "./fixtures/expected/tap-outputs" );
const execute = require( "./helpers/execute" );

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

	QUnit.test( "logs test files that fail to load properly", co.wrap( function* ( assert ) {
		try {
			yield execute( "qunit syntax-error/test.js" );
		} catch ( e ) {
			assert.notEqual( e.stdout.indexOf( "not ok 1 syntax-error/test.js > Failed to load the test file with error:" ), -1 );
			assert.notEqual( e.stdout.indexOf( "ReferenceError: varIsNotDefined is not defined" ), -1 );
			assert.equal( e.code, 1 );
		}
	} ) );

	QUnit.test( "exit code is 1 when failing tests are present", co.wrap( function* ( assert ) {
		try {
			yield execute( "qunit fail/*.js" );
		} catch ( e ) {
			assert.equal( e.code, 1 );
		}
	} ) );

	QUnit.test( "exit code is 1 when no tests are run", co.wrap( function* ( assert ) {
		try {
			yield execute( "qunit no-tests" );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, "Error: No tests were run\n" );
		}
	} ) );

	QUnit.test( "exit code is 1 when no tests exit before done", co.wrap( function* ( assert ) {
		const command = "qunit hanging-test";
		try {
			yield execute( command );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, expectedOutput[ command ] );
		}
	} ) );

	QUnit.module( "filter", function() {
		QUnit.test( "can properly filter tests", co.wrap( function* ( assert ) {
			const command = "qunit --filter 'single' test single.js 'glob/**/*-test.js'";
			const equivalentCommand = "qunit single.js";
			const execution = yield execute( command );

			assert.equal( execution.code, 0 );
			assert.equal( execution.stderr, "" );
			assert.equal( execution.stdout, expectedOutput[ equivalentCommand ] );
		} ) );
	} );

	QUnit.module( "seed", function() {
		QUnit.test( "can properly seed tests", co.wrap( function* ( assert ) {
			const command = "qunit --seed 's33d' test single.js 'glob/**/*-test.js'";
			const execution = yield execute( command );

			assert.equal( execution.code, 0 );
			assert.equal( execution.stderr, "" );
			assert.equal( execution.stdout, expectedOutput[ command ] );
		} ) );
	} );

	QUnit.module( "notrycatch", function() {
		QUnit.test( "errors if notrycatch is used and a rejection occurs", co.wrap( function* ( assert ) {
			assert.expect( 1 );

			try {
				yield execute( "qunit notrycatch/returns-rejection.js" );
			} catch ( e ) {
				assert.pushResult( {

					// only in stdout due to using `console.log` in manual `unhandledRejection` handler
					result: e.stdout.indexOf( "Unhandled Rejection: bad things happen sometimes" ) > -1,
					actual: e.stdout + "\n" + e.stderr
				} );
			}
		} ) );
	} );
} );
