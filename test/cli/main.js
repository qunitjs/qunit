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
			assert.true( e.stdout.includes( "not ok 1 syntax-error/test.js > Failed to load the test file with error:" ) );
			assert.true( e.stdout.includes( "ReferenceError: varIsNotDefined is not defined" ) );
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

	QUnit.test( "exit code is 0 when no tests are run and failOnZeroTests is `false`", async assert => {
		const command = "qunit assert-expect/no-tests.js";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
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

	QUnit.test( "hard errors in test using `assert.async` are caught and reported", async assert => {
		const command = "qunit hard-error-in-test-with-no-async-handler.js";

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

	QUnit.test( "callbacks", async assert => {
		const expected = `CALLBACK: begin1
CALLBACK: begin2
CALLBACK: moduleStart1
CALLBACK: moduleStart2
CALLBACK: testStart1
CALLBACK: testStart2
CALLBACK: module1 > before
CALLBACK: module1 > beforeEach
TEST: module1 > test1
CALLBACK: log1
CALLBACK: log2
CALLBACK: module1 > afterEach
CALLBACK: testDone1
CALLBACK: testDone2
CALLBACK: moduleStart1
CALLBACK: moduleStart2
CALLBACK: testStart1
CALLBACK: testStart2
CALLBACK: module2 > before
CALLBACK: module1 > beforeEach
CALLBACK: module2 > beforeEach
TEST: module2 > test1
CALLBACK: log1
CALLBACK: log2
CALLBACK: module2 > afterEach
CALLBACK: module1 > afterEach
CALLBACK: module2 > after
CALLBACK: testDone1
CALLBACK: testDone2
CALLBACK: moduleDone1
CALLBACK: moduleDone2
CALLBACK: moduleStart1
CALLBACK: moduleStart2
CALLBACK: testStart1
CALLBACK: testStart2
CALLBACK: module3 > before
CALLBACK: module1 > beforeEach
CALLBACK: module3 > beforeEach
TEST: module3 > test1
CALLBACK: log1
CALLBACK: log2
CALLBACK: module3 > afterEach
CALLBACK: module1 > afterEach
CALLBACK: module3 > after
CALLBACK: testDone1
CALLBACK: testDone2
CALLBACK: moduleDone1
CALLBACK: moduleDone2
CALLBACK: testStart1
CALLBACK: testStart2
CALLBACK: module1 > beforeEach
TEST: module1 > test2
CALLBACK: log1
CALLBACK: log2
CALLBACK: module1 > afterEach
CALLBACK: testDone1
CALLBACK: testDone2
CALLBACK: moduleStart1
CALLBACK: moduleStart2
CALLBACK: testStart1
CALLBACK: testStart2
CALLBACK: module4 > before
CALLBACK: module1 > beforeEach
CALLBACK: module4 > beforeEach
TEST: module4 > test1
CALLBACK: log1
CALLBACK: log2
CALLBACK: module4 > afterEach
CALLBACK: module1 > afterEach
CALLBACK: module4 > after
CALLBACK: module1 > after
CALLBACK: testDone1
CALLBACK: testDone2
CALLBACK: moduleDone1
CALLBACK: moduleDone2
CALLBACK: moduleDone1
CALLBACK: moduleDone2
CALLBACK: done1
CALLBACK: done2`;

		const command = "qunit callbacks.js";
		const execution = await execute( command );

		assert.equal( execution.stderr, expected );
		assert.equal( execution.code, 0 );
	} );

	QUnit.test( "callbacks with promises", async assert => {
		const expected = `CALLBACK: begin
CALLBACK: begin2
CALLBACK: moduleStart
CALLBACK: moduleStart
CALLBACK: testStart - test1
CALLBACK: testDone - test1
CALLBACK: moduleDone - module1 > nestedModule1
CALLBACK: testStart - test2
CALLBACK: testDone - test2
CALLBACK: moduleStart
CALLBACK: testStart - test3
CALLBACK: testDone - test3
CALLBACK: moduleDone - module1 > nestedModule2
CALLBACK: moduleDone - module1
CALLBACK: done`;

		const command = "qunit callbacks-promises.js";
		const execution = await execute( command );

		assert.equal( execution.stderr, expected );
		assert.equal( execution.code, 0 );
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

		// skip if running in code coverage mode - that leads to conflicting maps-on-maps that invalidate this test
		QUnit[ process.env.NYC_PROCESS_ID ? "skip" : "test" ](
			"mapped trace with native source map", async function( assert ) {
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

		QUnit.test( "forgive qunit DOM global variables", async assert => {
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
					result: e.stdout.includes( "message: Invalid value on test.semaphore" ),
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

	QUnit.module( "assert.async", () => {

		QUnit.test( "assert.async callback after tests timeout", async assert => {
			const command = "qunit done-after-timeout.js";
			try {
				await execute( command );
			} catch ( e ) {
				assert.equal( e.stdout, expectedOutput[ command ] );

				// These are both undesirable, but at least confirm what the current state is.
				// TDD should break these and update when possible.
				assert.true( e.stderr.includes( "TypeError: Cannot read property 'length' of undefined" ), e.stderr );

				// e.code should be 1, but is sometimes 0, 1, or 7 in different envs
			}
		} );

		QUnit.test( "drooling calls across tests to assert.async callback", async assert => {
			const command = "qunit drooling-done.js";
			try {
				await execute( command );
			} catch ( e ) {
				assert.equal( e.code, 1 );
				assert.equal( e.stderr, "" );

				// code coverage and various Node versions can alter the stacks,
				// so we can't compare exact strings, but we can spot-check
				assert.true( e.stdout.includes(
					"not ok 2 Test B\n" +
					"  ---\n" +
					"  message: \"`assert.async` callback from test \\\"Test A\\\" was called during this test.\"" ), e.stdout );
			}
		} );

		QUnit.test( "too many calls to assert.async callback", async assert => {
			const command = "qunit too-many-done-calls.js";
			try {
				await execute( command );
			} catch ( e ) {
				assert.equal( e.code, 1 );
				assert.equal( e.stderr, "" );

				// code coverage and various Node versions can alter the stacks,
				// so we can't compare exact strings, but we can spot-check
				assert.true( e.stdout.includes(
					"not ok 1 Test A\n" +
					"  ---\n" +
					"  message: Too many calls to the `assert.async` callback" ), e.stdout );
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

	QUnit.test( "warns about unsupported async module callback", async assert => {
		const command = "qunit async-module-warning/test.js";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "Returning a promise from a module callback is not supported. Instead, use hooks for async behavior. This will become an error in QUnit 3.0.", "The warning shows" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	QUnit.test( "warns about unsupported promise return value from module", async assert => {
		const command = "qunit async-module-warning/promise-test.js";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "Returning a promise from a module callback is not supported. Instead, use hooks for async behavior. This will become an error in QUnit 3.0.", "The warning shows" );
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

				// can't match exactly due to stack frames including internal line numbers
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
				assert.equal( e.code, 1 );
				assert.equal( e.stderr, "" );

				// can't match exactly due to stack frames including internal line numbers
				assert.notEqual( e.stdout.indexOf( "Expected at least one assertion, but none were run - call expect(0) to accept zero assertions." ), -1, e.stdout );
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
