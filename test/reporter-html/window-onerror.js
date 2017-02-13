QUnit.module( "window.onerror (no preexisting handler)", function( ) {
	QUnit.test( "Should call QUnit.onError and emit assertion failure", function( assert ) {
		assert.expect( 3 );

		var originalPushResult = assert.pushResult;

		// Duck-punch assert.pushResult so we can do some custom assertions
		assert.pushResult = function( resultInfo ) {

			// Restore assert.pushResult so the next assertions work
			assert.pushResult = originalPushResult;

			assert.strictEqual( resultInfo.message, "An error message" );
			assert.strictEqual( resultInfo.source, "filename.js:1" );
		};

		var result = window.onerror( "An error message", "filename.js", 1 );

		assert.strictEqual( result, false, "QUnit.onError should return false" );
	} );

	QUnit.test( "Should not assert if ignoreGlobalErrors is configured", function( assert ) {
		assert.expect( 1 );

		var originalPushResult = assert.pushResult;

		QUnit.config.current.ignoreGlobalErrors = true;

		// Duck-punch assert.pushResult so we can do some custom assertions
		assert.pushResult = function( ) {

			// Restore assert.pushResult so the next assertions work
			assert.pushResult = originalPushResult;

			assert.ok( false, "Should not call pushResult if ignoreGlobalErrors is true" );
		};

		var result = window.onerror( "An error message", "filename.js", 1 );

		// Restore assert.pushResult so the next assertions work
		assert.pushResult = originalPushResult;

		assert.strictEqual( result, true, "QUnit.onError should return true" );
	} );
} );
