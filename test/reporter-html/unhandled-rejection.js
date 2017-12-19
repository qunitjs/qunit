// Detect if the current browser supports `onunhandledrejection` (avoiding
// errors for browsers without the capability)
var HAS_UNHANDLED_REJECTION_HANDLER = "onunhandledrejection" in window;

if ( HAS_UNHANDLED_REJECTION_HANDLER ) {
	QUnit.module( "Unhandled Rejections inside test context", function( hooks ) {
		hooks.beforeEach( function( assert ) {
			var originalPushResult = assert.pushResult;
			assert.pushResult = function( resultInfo ) {

				// Inverts the result so we can test failing assertions
				resultInfo.result = !resultInfo.result;
				originalPushResult( resultInfo );
			};
		} );

		QUnit.test( "test passes just fine, but has a rejected promise", function( assert ) {
			const done = assert.async();

			Promise.resolve().then( function() {
				throw new Error( "Error thrown in non-returned promise!" );
			} );

			// prevent test from exiting before unhandled rejection fires
			setTimeout( done, 10 );
		} );

	} );

	QUnit.module( "Unhandled Rejections outside test context", function( hooks ) {
		var originalPushResult;

		hooks.beforeEach( function( assert ) {

			// Duck-punch pushResult so we can check test name and assert args.
			originalPushResult = assert.pushResult;

			assert.pushResult = function( resultInfo ) {

				// Restore pushResult for this assert object, to allow following assertions.
				this.pushResult = originalPushResult;

				this.strictEqual( this.test.testName, "global failure", "Test is appropriately named" );

				this.deepEqual(
					resultInfo,
					{
						message: "Error message",
						source: "filePath.js:1",
						result: false,
						actual: {
							message: "Error message",
							fileName: "filePath.js",
							lineNumber: 1,
							stack: "filePath.js:1"
						}
					},
					"Expected assert.pushResult to be called with correct args"
				);
			};
		} );

		hooks.afterEach( function() {
			QUnit.config.current.pushResult = originalPushResult;
		} );

		// Actual test (outside QUnit.test context)
		QUnit.onUnhandledRejection( {
			message: "Error message",
			fileName: "filePath.js",
			lineNumber: 1,
			stack: "filePath.js:1"
		} );
	} );
}
