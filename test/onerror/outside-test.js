QUnit.module( "Should create a test and call pushFailure when outside a test", function( hooks ) {
	var originalPushResult;

	hooks.beforeEach( function() {

		// Duck-punch pushResult so we can check test name and assert args.
		originalPushResult = QUnit.assert.pushResult;

		QUnit.assert.pushResult = function( resultInfo ) {

			// Restore pushResult for this assert object, to allow following assertions.
			this.pushResult = originalPushResult;

			this.strictEqual( this.test.testName, "global failure", "Test is appropriately named" );

			this.deepEqual( resultInfo, {
				message: "Error message",
				source: "filePath.js:1",
				result: false,
				actual: "actual",
				expected: null
			}, "Expected assert.pushResult to be called with correct args" );
		};

	} );

	hooks.afterEach( function() {
		QUnit.assert.pushResult = originalPushResult;
	} );

	// Actual test (outside QUnit.test context).
	QUnit.onError( "Error message", "filePath.js", 1, "actual" );
} );
