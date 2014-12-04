/*global ok: false, equal: false */
(function( window ) {

QUnit.module( "globals" );

function checkExported( assert, methods, isAssertion ) {
	var i, l, method;

	for ( i = 0, l = methods.length; i < l; i++ ) {
		method = methods[ i ];

		assert.strictEqual( typeof( window[ method ] ), "function", "global " + method );

		assert.strictEqual(
			window[ method ],
			QUnit[ method ],
			"QUnit exports QUnit." + method + " to the global scope"
		);

		if ( isAssertion ) {
			assert.strictEqual(
				window[ method ],
				assert[ method ],
				"Global " + method + " is the same of assert." + method
			);
		}
	}
}

QUnit.test( "QUnit exported methods", function( assert ) {
	var globals = [
			"test", "asyncTest", "module",
			"start", "stop"
		];

	// 2 assertions per item on checkExported
	assert.expect( globals.length * 2 );

	checkExported( assert, globals );
});

// Test deprecated exported Assert methods
QUnit.test( "Exported assertions", function() {
	QUnit.expect( 6 );

	QUnit.ok( true );
	QUnit.equal( 2, 2 );

	ok( true );
	equal( 2, 2 );

	QUnit.assert.ok( true );
	QUnit.assert.equal( 2, 2 );
});

// Get a reference to the global object, like window in browsers
}( (function() {
	return this;
}.call()) ));
