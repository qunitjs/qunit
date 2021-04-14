"use strict";

const expectedOutput = require( "./fixtures/expected/tap-outputs" );
const execute = require( "./helpers/execute" );
const semver = require( "semver" );

QUnit.module( "CLI Main", () => {
	QUnit.test( "defaults to running tests in 'test' directory", async assert => {
		const command = "qunit";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	QUnit.test( "errors if no test files are found to run", async assert => {
		try {
			await execute( "qunit does-not-exist.js" );
		} catch ( e ) {
			assert.equal( e.stderr.indexOf( "No files were found matching" ), 0 );
		}
	} );

	QUnit.test( "accepts globs for test files to run", async assert => {
		const command = "qunit 'glob/**/*-test.js'";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	QUnit.test( "runs a single JS file", async assert => {
		const command = "qunit single.js";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	QUnit.test( "runs multiple JS files", async assert => {
		const command = "qunit single.js double.js";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	QUnit.test( "runs all JS files in a directory matching an arg", async assert => {
		const command = "qunit test";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	QUnit.test( "runs multiple types of file paths", async assert => {
		const command = "qunit test single.js 'glob/**/*-test.js'";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	QUnit.test( "logs test files that fail to load properly", async assert => {
		try {
			await execute( "qunit syntax-error/test.js" );
		} catch ( e ) {
			assert.notEqual( e.stdout.indexOf( "not ok 1 syntax-error/test.js > Failed to load the test file with error:" ), -1 );
			assert.notEqual( e.stdout.indexOf( "ReferenceError: varIsNotDefined is not defined" ), -1 );
			assert.equal( e.code, 1 );
		}
	} );

	QUnit.test( "report assert.throws() failures properly", async assert => {
		const command = "qunit fail/throws-match.js";
		try {
			await execute( command );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, "" );
			assert.equal( e.stdout, expectedOutput[ command ] );
		}
	} );

	QUnit.test( "exit code is 1 when failing tests are present", async assert => {
		try {
			await execute( "qunit fail/failure.js" );
		} catch ( e ) {
			assert.equal( e.code, 1 );
		}
	} );

	QUnit.test( "exit code is 1 when no tests are run", async assert => {
		const command = "qunit no-tests";
		try {
			await execute( command );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, "" );
			assert.equal( e.stdout, expectedOutput[ command ] );
		}
	} );

	QUnit.test( "exit code is 1 when no tests exit before done", async assert => {
		const command = "qunit hanging-test";
		try {
			await execute( command );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, expectedOutput[ command ] );
		}
	} );

	QUnit.test( "unhandled rejections fail tests", async assert => {
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

	QUnit.test( "hard errors in test are caught and reported", async assert => {
		const command = "qunit hard-error-in-test.js";

		try {
			const result = await execute( command );
			assert.pushResult( {
				result: false,
				actual: result.stdout
			} );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, "" );
			assert.notEqual( e.stdout.indexOf( "Died on test #2     at " ), -1 );
			assert.notEqual( e.stdout.indexOf( "Error: expected error thrown in test" ), -1 );
		}
	} );

	QUnit.test( "hard errors in hook are caught and reported", async assert => {
		const command = "qunit hard-error-in-hook.js";

		try {
			const result = await execute( command );
			assert.pushResult( {
				result: false,
				actual: result.stdout
			} );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, "" );
			assert.notEqual( e.stdout.indexOf( "message: before failed on contains a hard error: expected error thrown in hook" ), -1 );
			assert.notEqual( e.stdout.indexOf( "Error: expected error thrown in hook" ), -1 );
		}
	} );

	if ( semver.gte( process.versions.node, "12.0.0" ) ) {
		QUnit.test( "run ESM test suite with import statement", async assert => {
			const command = "qunit ../../es2018/esm.mjs";
			const execution = await execute( command );

			assert.equal( execution.code, 0 );

			// Node 12 enabled ESM by default, without experimental flag,
			// but left the warning in stderr. The warning was removed in Node 14.
			// Don't bother checking stderr
			const stderr = semver.gte( process.versions.node, "14.0.0" ) ? execution.stderr : "";
			assert.equal( stderr, "" );

			assert.equal( execution.stdout, expectedOutput[ command ] );
		} );
	}

	// https://nodejs.org/dist/v12.12.0/docs/api/cli.html#cli_enable_source_maps
	if ( semver.gte( process.versions.node, "14.0.0" ) ) {

		QUnit.test( "normal trace with native source map", async assert => {
			const command = "qunit sourcemap/source.js";
			try {
				await execute( command );
			} catch ( e ) {
				assert.equal( e.code, 1 );
				assert.equal( e.stderr, "" );
				assert.equal( e.stdout, expectedOutput[ command ] );
			}
		} );

		QUnit.test( "mapped trace with native source map", async assert => {
			const command = "NODE_OPTIONS='--enable-source-maps' qunit sourcemap/source.min.js";
			try {
				await execute( command );
			} catch ( e ) {
				assert.equal( e.code, 1 );
				assert.equal( e.stderr, "" );
				assert.equal( e.stdout, expectedOutput[ command ] );
			}
		} );
	}

	QUnit.test( "timeouts correctly recover", async assert => {
		const command = "qunit timeout";
		try {
			await execute( command );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, "" );
			assert.equal( e.stdout, expectedOutput[ command ] );
		}
	} );

	QUnit.test( "allows running zero-assertion tests", async assert => {
		const command = "qunit zero-assertions.js";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	// https://nodejs.org/docs/v14.0.0/api/v8.html#v8_v8_getheapsnapshot
	// Created in Node 11.x, but starts working the way we need from Node 14.
	if ( semver.gte( process.versions.node, "14.0.0" ) ) {
		QUnit.test( "callbacks and hooks from modules are properly released for garbage collection", async assert => {
			const command = "node --expose-gc ../../../bin/qunit.js memory-leak/*.js";
			const execution = await execute( command );

			assert.equal( execution.code, 0 );
			assert.equal( execution.stderr, "" );
			assert.equal( execution.stdout, expectedOutput[ command ] );
		} );
	}

	QUnit.module( "filter", () => {
		QUnit.test( "can properly filter tests", async assert => {
			const command = "qunit --filter 'single' test single.js 'glob/**/*-test.js'";
			const equivalentCommand = "qunit single.js";
			const execution = await execute( command );

			assert.equal( execution.code, 0 );
			assert.equal( execution.stderr, "" );
			assert.equal( execution.stdout, expectedOutput[ equivalentCommand ] );
		} );

		QUnit.test( "exit code is 1 when no tests match filter", async assert => {
			const command = "qunit qunit --filter 'no matches' test";
			try {
				await execute( command );
			} catch ( e ) {
				assert.equal( e.code, 1 );
				assert.equal( e.stderr, "" );
				assert.equal( e.stdout, expectedOutput[ command ] );
			}
		} );
	} );

	QUnit.module( "require", () => {
		QUnit.test( "can properly require dependencies and modules", async assert => {
			const command = "qunit single.js --require require-dep --require './node_modules/require-dep/module.js'";
			const execution = await execute( command );

			assert.equal( execution.code, 0 );
			assert.equal( execution.stderr, "" );
			assert.equal( execution.stdout, expectedOutput[ command ] );
		} );

		QUnit.test( "displays helpful error when failing to require a file", async assert => {
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

	QUnit.module( "seed", () => {
		QUnit.test( "can properly seed tests", async assert => {
			const command = "qunit --seed 's33d' test single.js 'glob/**/*-test.js'";
			const execution = await execute( command );

			assert.equal( execution.code, 0 );
			assert.equal( execution.stderr, "" );
			assert.equal( execution.stdout, expectedOutput[ command ] );
		} );
	} );

	QUnit.module( "notrycatch", () => {
		QUnit.test( "errors if notrycatch is used and a rejection occurs", async assert => {
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

		QUnit.test( "errors if notrycatch is used and a rejection occurs in a hook", async assert => {
			try {
				await execute( "qunit notrycatch/returns-rejection-in-hook.js" );
			} catch ( e ) {
				assert.pushResult( {

					// only in stdout due to using `console.log` in manual `unhandledRejection` handler
					result: e.stdout.indexOf( "Unhandled Rejection: bad things happen sometimes" ) > -1,
					actual: e.stdout + "\n" + e.stderr
				} );
			}
		} );
	} );

	QUnit.test( "config.module", async assert => {
		const command = "qunit config-module.js";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	QUnit.test( "config.testTimeout", async assert => {
		const command = "qunit config-testTimeout.js";

		try {
			await execute( command );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, "" );
			assert.equal( e.stdout, expectedOutput[ command ] );
		}
	} );

	QUnit.module( "noglobals", () => {
		QUnit.test( "add global variable", async assert => {
			try {
				await execute( "qunit noglobals/add-global.js" );
			} catch ( e ) {
				assert.pushResult( {
					result: e.stdout.indexOf( "message: Introduced global variable(s): dummyGlobal" ) > -1,
					actual: e.stdout + "\n" + e.stderr
				} );
			}
		} );

		QUnit.test( "remove global variable", async assert => {
			try {
				await execute( "qunit noglobals/remove-global.js" );
			} catch ( e ) {
				assert.pushResult( {
					result: e.stdout.indexOf( "message: Deleted global variable(s): dummyGlobal" ) > -1,
					actual: e.stdout + "\n" + e.stderr
				} );
			}
		} );

		QUnit.test( "forgive global variable", async assert => {
			const execution = await execute( "qunit noglobals/ignored.js" );
			assert.equal( execution.code, 0 );
			assert.equal( execution.stderr, "" );
		} );
	} );

	QUnit.module( "semaphore", () => {
		QUnit.test( "invalid value", async assert => {
			try {
				await execute( "qunit semaphore/nan.js" );
			} catch ( e ) {
				assert.pushResult( {
					result: e.stdout.indexOf( "message: Invalid value on test.semaphore" ) > -1,
					actual: e.stdout + "\n" + e.stderr
				} );
			}
		} );

		QUnit.test( "try to restart ", async assert => {
			try {
				await execute( "qunit semaphore/restart.js" );
			} catch ( e ) {
				assert.pushResult( {
					result: e.stdout.indexOf( "message: \"Tried to restart test while already started (test's semaphore was 0 already)" ) > -1,
					actual: e.stdout + "\n" + e.stderr
				} );
			}
		} );
	} );

	QUnit.module( "only", () => {
		QUnit.test( "test", async assert => {

			const command = "qunit only/test.js";
			const execution = await execute( command );

			assert.equal( execution.code, 0 );
			assert.equal( execution.stderr, "" );
			assert.equal( execution.stdout, expectedOutput[ command ] );
		} );

		QUnit.test( "nested modules", async assert => {

			const command = "qunit only/module.js";
			const execution = await execute( command );

			assert.equal( execution.code, 0 );
			assert.equal( execution.stderr, "" );
			assert.equal( execution.stdout, expectedOutput[ command ] );
		} );

		QUnit.test( "flat modules", async assert => {

			const command = "qunit only/module-flat.js";
			const execution = await execute( command );

			assert.equal( execution.code, 0 );
			assert.equal( execution.stderr, "" );
			assert.equal( execution.stdout, expectedOutput[ command ] );
		} );
	} );

	QUnit.test( "warns about incorrect hook usage", async assert => {
		const command = "qunit incorrect-hooks-warning/test.js";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "The `beforeEach` hook was called inside the wrong module. Instead, use hooks provided by the callback to the containing module. This will become an error in QUnit 3.0.", "The warning shows" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	QUnit.module( "assert.expect failing conditions", () => {
		QUnit.test( "mismatched expected assertions", async assert => {
			const command = "qunit assert-expect/failing-expect.js";
			try {
				const result = await execute( command );
				assert.pushResult( {
					result: false,
					actual: result.stdout
				} );
			} catch ( e ) {
				assert.equal( e.code, 1 );
				assert.equal( e.stderr, "" );
				assert.notEqual( e.stdout.indexOf( "message: Expected 2 assertions, but 1 were run" ), -1, e.stdout );
			}
		} );

		QUnit.test( "no assertions run - use expect(0)", async assert => {
			const command = "qunit assert-expect/no-assertions.js";
			try {
				const result = await execute( command );
				assert.pushResult( {
					result: true,
					actual: result.stdout
				} );
			} catch ( e ) {
				assert.pushResult( {

					// This isn't the *exact* the error message we want to see - it's been transformed
					// by the execution to standardize on formatting. Should be improved.
					result: e.stdout.indexOf( "Expected at least one assertion, but none were run - call expect(0) to accept zero assertions." ) > -1,
					actual: e.stdout + "\n" + e.stderr
				} );
			}
		} );

		QUnit.test( "requireExpects", async assert => {
			const command = "qunit assert-expect/require-expects.js";
			try {
				const result = await execute( command );
				assert.pushResult( {
					result: false,
					actual: result.stdout
				} );
			} catch ( e ) {
				assert.equal( e.code, 1 );
				assert.equal( e.stderr, "" );
				assert.notEqual( e.stdout.indexOf( "message: Expected number of assertions to be defined, but expect() was not called." ), -1, e.stdout );
			}
		} );
	} );
} );
