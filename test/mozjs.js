/* eslint-env es6 */
/* eslint-disable lines-around-comment */
/* global loadRelativeToScript */

loadRelativeToScript( "../qunit/qunit.js" );

QUnit.on( "runStart", () => {
	print( "Running tests..." );
} );
QUnit.on( "testEnd", ( testEnd ) => {
	if ( testEnd.status === "todo" ) {
		return;
	}
	testEnd.errors.forEach( ( assertion ) => {
		print( `\ntest: ${testEnd.name}\n` +
			`module: ${testEnd.suiteName}\n` +
			`message: ${assertion.message}\n${assertion.stack || ""}` );
	} );
} );
QUnit.on( "runEnd", ( suiteEnd ) => {
	const stats = suiteEnd.testCounts;
	if ( suiteEnd.status === "failed" ) {
		print( `${stats.total} tests in ${suiteEnd.runtime}ms` +
			`, ${stats.passed} passed` +
			`, ${stats.failed} failed` +
			`, ${stats.skipped} skipped` +
			`, ${stats.todo} todo` +
			"."
		);

		// There is no built-in function for sending a non-zero exit code,
		// so throw an uncaught error to make this happen.
		throw new Error( "Test run has failures." );
	} else {
		print( `${stats.total} tests in ${suiteEnd.runtime}ms, all passed.` );
	}
} );

loadRelativeToScript( "../test/main/test.js" );
loadRelativeToScript( "../test/main/assert.js" );
loadRelativeToScript( "../test/main/assert/step.js" );
// Requires setTimeout, loadRelativeToScript( "../test/main/assert/timeout.js" );
// Requires setTimeout, loadRelativeToScript( "../test/main/async.js" );
// Requires setTimeout, loadRelativeToScript( "../test/main/promise.js" );
loadRelativeToScript( "../test/main/dump.js" );
// Requires setTimeout, loadRelativeToScript( "../test/main/modules.js" );
loadRelativeToScript( "../test/main/deepEqual.js" );
loadRelativeToScript( "../test/main/stack.js" );
loadRelativeToScript( "../test/main/utilities.js" );

QUnit.start();
