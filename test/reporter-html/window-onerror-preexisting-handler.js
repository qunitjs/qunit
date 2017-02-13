/* global onerrorReturnValue */
/* exported onerrorReturnValue */

QUnit.module( "window.onerror (with preexisting handler)", function( ) {
	QUnit.test( "Should call QUnit.onError/assert if handler returns false", function( assert ) {
		assert.expect( 3 );

		onerrorReturnValue = false;

		var originalPushResult = assert.pushResult;

		// Duck-punch assert.pushResult so we can do some custom assertions
		assert.pushResult = function( resultInfo ) {

			// Restore assert.pushResult so the next assertions work
			assert.pushResult = originalPushResult;

			assert.strictEqual( resultInfo.message, "An error message" );
			assert.strictEqual( resultInfo.source, "filename.js:1" );
		};

		var result = window.onerror( "An error message", "filename.js", 1 );

		assert.strictEqual( result, false, "QUnit.onError should have returned false" );
	} );

	QUnit.test( "Should call QUnit.onError/assert if handler returns void 0", function( assert ) {
		assert.expect( 3 );

		onerrorReturnValue = void 0;

		var originalPushResult = assert.pushResult;

		// Duck-punch assert.pushResult so we can do some custom assertions
		assert.pushResult = function( resultInfo ) {

			// Restore assert.pushResult so the next assertions work
			assert.pushResult = originalPushResult;

			assert.strictEqual( resultInfo.message, "An error message" );
			assert.strictEqual( resultInfo.source, "filename.js:1" );
		};

		var result = window.onerror( "An error message", "filename.js", 1 );

		assert.strictEqual( result, false, "QUnit.onError should have returned false" );
	} );

	QUnit.test( "Should call QUnit.onError/assert if handler returns truthy", function( assert ) {
		assert.expect( 3 );

		onerrorReturnValue = "truthy value";

		var originalPushResult = assert.pushResult;

		// Duck-punch assert.pushResult so we can do some custom assertions
		assert.pushResult = function( resultInfo ) {

			// Restore assert.pushResult so the next assertions work
			assert.pushResult = originalPushResult;

			assert.strictEqual( resultInfo.message, "An error message" );
			assert.strictEqual( resultInfo.source, "filename.js:1" );
		};

		var result = window.onerror( "An error message", "filename.js", 1 );

		assert.strictEqual( result, false, "QUnit.onError should have returned false" );
	} );

	QUnit.test( "Should not assert if ignoreGlobalFailures config enabled", function( assert ) {
		assert.expect( 1 );

		QUnit.config.current.ignoreGlobalErrors = true;

		var originalPushResult = assert.pushResult;

		// Duck-punch assert.pushResult so we can do some custom assertions
		assert.pushResult = function( ) {

			// Restore assert.pushResult so the next assertions work
			assert.pushResult = originalPushResult;

			assert.ok( false, "Should not push an assertion" );
		};

		var result = window.onerror( "An error message", "filename.js", 1 );

		// Restore assert.pushResult so the next assertions work
		assert.pushResult = originalPushResult;

		assert.strictEqual( result, true, "QUnit.onError should have returned true" );
	} );

	QUnit.test( "Should not call QUnit.onError if other handler returns true", function( assert ) {
		assert.expect( 1 );

		onerrorReturnValue = true;

		var originalPushResult = assert.pushResult;

		// Duck-punch assert.pushResult so we can do some custom assertions
		assert.pushResult = function( ) {

			// Restore assert.pushResult so the next assertions work
			assert.pushResult = originalPushResult;

			assert.ok( false, "Should not push an assertion" );
		};

		var result = window.onerror( "An error message", "filename.js", 1 );

		// Restore assert.pushResult so the next assertions work
		assert.pushResult = originalPushResult;

		assert.strictEqual( result, true, "Handler should have returned true" );
	} );
} );
