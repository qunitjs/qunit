QUnit.module( "Should create a test and call pushFailure when outside a test", function( hooks ) {
	var originalPushResult;

	hooks.beforeEach( function() {

		// Duck-punch pushResult so we can check test name and assert args.
		originalPushResult = QUnit.config.current.pushResult;

		QUnit.config.current.pushResult = function( resultInfo ) {

			// Restore pushResult for this assert object, to allow following assertions.
			this.pushResult = originalPushResult;

			this.assert.strictEqual(
				this.testName,
				"global failure", "Test is appropriately named"
			);

			this.assert.deepEqual( resultInfo, {
				message: "Error message",
				source: "filePath.js:1",
				result: false,
				actual: "actual"
			}, "Expected assert.pushResult to be called with correct args" );
		};

	} );

	hooks.afterEach( function() {
		QUnit.config.current.pushResult = originalPushResult;
	} );

	// Actual test (outside QUnit.test context).
	QUnit.onError( {
		message: "Error message",
		fileName: "filePath.js",
		lineNumber: 1
	}, "actual" );
} );
