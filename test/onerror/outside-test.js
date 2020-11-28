QUnit.module( "pushFailure outside a test", function( hooks ) {
	var originalPushResult;

	hooks.beforeEach( function() {

		// Duck-punch pushResult so we can check test name and assert args.
		originalPushResult = QUnit.config.current.pushResult;

		QUnit.config.current.pushResult = function( resultInfo ) {

			// Restore pushResult for this assert object, to allow following assertions.
			this.pushResult = originalPushResult;

			this.assert.strictEqual(
				this.testName,
				"global failure", "new test implicitly created and appropriately named"
			);

			this.assert.deepEqual( resultInfo, {
				message: "Error message",
				source: "filePath.js:1",
				result: false,
				actual: "actual"
			}, "assert.pushResult arguments" );
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
