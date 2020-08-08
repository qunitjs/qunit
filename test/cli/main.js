"use strict";

const expectedOutput = require( "./fixtures/expected/tap-outputs" );
const execute = require( "./helpers/execute" );
const semver = require( "semver" );

QUnit.module( "CLI Main", function() {
	QUnit.test( "defaults to running tests in 'test' directory", async function( assert ) {
		const command = "qunit";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	QUnit.test( "errors if no test files are found to run", async function( assert ) {
		try {
			await execute( "qunit does-not-exist.js" );
		} catch ( e ) {
			assert.equal( e.stderr.indexOf( "No files were found matching" ), 0 );
		}
	} );

	QUnit.test( "accepts globs for test files to run", async function( assert ) {
		const command = "qunit 'glob/**/*-test.js'";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	QUnit.test( "runs a single JS file", async function( assert ) {
		const command = "qunit single.js";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	QUnit.test( "runs multiple JS files", async function( assert ) {
		const command = "qunit single.js double.js";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	QUnit.test( "runs all JS files in a directory matching an arg", async function( assert ) {
		const command = "qunit test";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	QUnit.test( "runs multiple types of file paths", async function( assert ) {
		const command = "qunit test single.js 'glob/**/*-test.js'";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	QUnit.test( "logs test files that fail to load properly", async function( assert ) {
		try {
			await execute( "qunit syntax-error/test.js" );
		} catch ( e ) {
			assert.notEqual( e.stdout.indexOf( "not ok 1 syntax-error/test.js > Failed to load the test file with error:" ), -1 );
			assert.notEqual( e.stdout.indexOf( "ReferenceError: varIsNotDefined is not defined" ), -1 );
			assert.equal( e.code, 1 );
		}
	} );

	QUnit.test( "report assert.throws() failures properly", async function( assert ) {
		const command = "qunit fail/throws-match.js";
		try {
			await execute( command );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, "" );
			const re = new RegExp( expectedOutput[ command ] );
			assert.equal( re.test( e.stdout ), true );
		}
	} );

	QUnit.test( "exit code is 1 when failing tests are present", async function( assert ) {
		try {
			await execute( "qunit fail/failure.js" );
		} catch ( e ) {
			assert.equal( e.code, 1 );
		}
	} );

	QUnit.test( "exit code is 1 when no tests are run", async function( assert ) {
		const command = "qunit no-tests";
		try {
			await execute( command );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, "" );
			const re = new RegExp( expectedOutput[ command ] );
			assert.equal( re.test( e.stdout ), true );
		}
	} );

	QUnit.test( "exit code is 1 when no tests exit before done", async function( assert ) {
		const command = "qunit hanging-test";
		try {
			await execute( command );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, expectedOutput[ command ] );
		}
	} );

	QUnit.test( "unhandled rejections fail tests", async function( assert ) {
		const command = "qunit unhandled-rejection.js";

		try {
			const result = await execute( command );
			assert.pushResult( {
				result: false,
				actual: result.stdout
			} );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, "" );
			assert.equal( e.stdout, expectedOutput[ command ] );
		}
	} );

	QUnit.test( "timeouts correctly recover", async function( assert ) {
		const command = "qunit timeout";
		try {
			await execute( command );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, "" );
			const re = new RegExp( expectedOutput[ command ] );
			assert.equal( re.test( e.stdout ), true );
		}
	} );

	QUnit.test( "allows running zero-assertion tests", async function( assert ) {
		const command = "qunit zero-assertions.js";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	// https://nodejs.org/docs/v14.0.0/api/v8.html#v8_v8_getheapsnapshot
	// Created in Node 11.x, but starts working the way we need from Node 14.
	if ( semver.gte( process.versions.node, "14.0.0" ) ) {
		QUnit.test( "callbacks and hooks from modules are properly released for garbage collection", async function( assert ) {
			const command = "node --expose-gc ../../../bin/qunit.js memory-leak/*.js";
			const execution = await execute( command );

			assert.equal( execution.code, 0 );
			assert.equal( execution.stderr, "" );
			assert.equal( execution.stdout, expectedOutput[ command ] );
		} );
	}

	QUnit.module( "filter", function() {
		QUnit.test( "can properly filter tests", async function( assert ) {
			const command = "qunit --filter 'single' test single.js 'glob/**/*-test.js'";
			const equivalentCommand = "qunit single.js";
			const execution = await execute( command );

			assert.equal( execution.code, 0 );
			assert.equal( execution.stderr, "" );
			assert.equal( execution.stdout, expectedOutput[ equivalentCommand ] );
		} );

		QUnit.test( "exit code is 1 when no tests match filter", async function( assert ) {
			const command = "qunit qunit --filter 'no matches' test";
			try {
				await execute( command );
			} catch ( e ) {
				assert.equal( e.code, 1 );
				assert.equal( e.stderr, "" );
				const re = new RegExp( expectedOutput[ command ] );
				assert.equal( re.test( e.stdout ), true );
			}
		} );
	} );

	QUnit.module( "require", function() {
		QUnit.test( "can properly require dependencies and modules", async function( assert ) {
			const command = "qunit single.js --require require-dep --require './node_modules/require-dep/module.js'";
			const execution = await execute( command );

			assert.equal( execution.code, 0 );
			assert.equal( execution.stderr, "" );
			assert.equal( execution.stdout, expectedOutput[ command ] );
		} );

		QUnit.test( "displays helpful error when failing to require a file", async function( assert ) {
			const command = "qunit single.js --require 'does-not-exist-at-all'";
			try {
				await execute( command );
			} catch ( e ) {
				assert.equal( e.code, 1 );
				assert.true( e.stderr.includes( "Error: Cannot find module 'does-not-exist-at-all'" ) );
				assert.equal( e.stdout, "" );
			}
		} );
	} );

	QUnit.module( "seed", function() {
		QUnit.test( "can properly seed tests", async function( assert ) {
			const command = "qunit --seed 's33d' test single.js 'glob/**/*-test.js'";
			const execution = await execute( command );

			assert.equal( execution.code, 0 );
			assert.equal( execution.stderr, "" );
			assert.equal( execution.stdout, expectedOutput[ command ] );
		} );
	} );

	QUnit.module( "notrycatch", function() {
		QUnit.test( "errors if notrycatch is used and a rejection occurs", async function( assert ) {
			assert.expect( 1 );

			try {
				await execute( "qunit notrycatch/returns-rejection.js" );
			} catch ( e ) {
				assert.pushResult( {

					// only in stdout due to using `console.log` in manual `unhandledRejection` handler
					result: e.stdout.indexOf( "Unhandled Rejection: bad things happen sometimes" ) > -1,
					actual: e.stdout + "\n" + e.stderr
				} );
			}
		} );
	} );
} );
