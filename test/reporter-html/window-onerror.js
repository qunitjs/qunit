QUnit.module( "window.onerror (no preexisting handler)", function( hooks ) {
	var originalQUnitOnError;

	hooks.beforeEach( function() {
		originalQUnitOnError = QUnit.onError;
	} );

	hooks.afterEach( function() {
		QUnit.onError = originalQUnitOnError;
	} );

	QUnit.test( "Should call QUnit.onError", function( assert ) {
		assert.expect( 1 );

		QUnit.onError = function() {
			assert.ok( true, "QUnit.onError was called" );
		};

		window.onerror( "An error message", "filename.js", 1 );
	} );

	QUnit.test( "Should extract stacktrace if it is available", function( assert ) {
		assert.expect( 1 );

		const errorObj = {
			stack: "dummy.js:1 top()\ndummy.js:2 middle()\ndummy.js:3 bottom()"
		};

		QUnit.onError = function( error ) {
			assert.equal( error.stacktrace, errorObj.stack, "QUnit.onError was called" );
		};

		window.onerror( "An error message", "filename.js", 1, 1, errorObj );
	} );


	QUnit.test( "Should return QUnit.error return value if it is called", function( assert ) {
		assert.expect( 1 );

		var expected = {};

		QUnit.onError = function() {
			return expected;
		};

		var result = window.onerror( "An error message", "filename.js", 1 );

		assert.strictEqual( result, expected, "QUnit.onError return value was returned" );
	} );
} );
