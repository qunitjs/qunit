/* global onerrorReturnValue: true, onerrorCallingContext: true */
/* exported onerrorReturnValue */

QUnit.module( "window.onerror (with preexisting handler)", function( hooks ) {
	var originalQUnitOnError;

	hooks.beforeEach( function() {
		onerrorReturnValue = null;
		onerrorCallingContext = null;

		originalQUnitOnError = QUnit.onError;
	} );

	hooks.afterEach( function() {
		QUnit.onError = originalQUnitOnError;
	} );

	QUnit.test( "call QUnit.onError if handler returns false", function( assert ) {
		assert.expect( 1 );

		onerrorReturnValue = false;

		QUnit.onError = function() {
			assert.true( true, "QUnit.onError was called" );
		};

		window.onerror( "An error message", "filename.js", 1 );
	} );

	QUnit.test( "call QUnit.onError if handler returns void 0", function( assert ) {
		assert.expect( 1 );

		onerrorReturnValue = void 0;

		QUnit.onError = function() {
			assert.true( true, "QUnit.onError was called" );
		};

		window.onerror( "An error message", "filename.js", 1 );
	} );

	QUnit.test( "call QUnit.onError if handler returns truthy", function( assert ) {
		assert.expect( 1 );

		onerrorReturnValue = "truthy value";

		QUnit.onError = function() {
			assert.true( true, "QUnit.onError was called" );
		};

		window.onerror( "An error message", "filename.js", 1 );
	} );

	QUnit.test( "ignore error if other handler returns true", function( assert ) {
		assert.expect( 1 );

		onerrorReturnValue = true;

		QUnit.onError = function() {
			assert.true( false, "QUnit.onError should not have been called" );
		};

		var result = window.onerror( "An error message", "filename.js", 1 );

		assert.strictEqual( result, true, "Our error handler should have returned true" );
	} );

	QUnit.test( "window.onerror handler is called on window", function( assert ) {
		assert.expect( 1 );

		QUnit.onError = function() {};

		window.onerror( "An error message", "filename.js", 1 );

		assert.strictEqual( onerrorCallingContext, window, "Handler called with correct context" );
	} );

	QUnit.test( "forward return value of QUnit.error", function( assert ) {
		assert.expect( 1 );

		var expected = {};

		QUnit.onError = function() {
			return expected;
		};

		var result = window.onerror( "An error message", "filename.js", 1 );

		assert.strictEqual( result, expected, "QUnit.onError return value was returned" );
	} );
} );
