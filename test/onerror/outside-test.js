QUnit.module( "pushFailure outside a test", function( hooks ) {
	var originalPushResult;
	var pushedName = null;
	var pushedResult = null;

	hooks.before( function( assert ) {

		// Duck-punch pushResult to capture the first test assertion.
		originalPushResult = assert.pushResult;
		assert.pushResult = function( resultInfo ) {
			pushedName = assert.test.testName;
			pushedResult = resultInfo;

			// Restore pushResult to not affect our hooks.after() assertion and dummy test.
			assert.pushResult = originalPushResult;

			// Replace with dummy to avoid "zero assertions" error.
			originalPushResult( { result: true, message: "dummy" } );
		};
	} );

	hooks.after( function( assert ) {
		assert.strictEqual(
			pushedName,
			"global failure",
			"new test implicitly created and appropriately named"
		);
		assert.propEqual( pushedResult, {
			result: false,
			message: "Error: Error message",
			source: "filePath.js:1"
		}, "pushed result" );
	} );

	// This should generate a new test, since we're outside a QUnit.test context.
	QUnit.onError( {
		message: "Error message",
		fileName: "filePath.js",
		lineNumber: 1
	} );

	// This dummy test ensures hooks.after() will run even if QUnit.onError()
	// failed to create the expected (failing) test.
	QUnit.test( "dummy", function( assert ) {
		assert.true( true );
	} );
} );
