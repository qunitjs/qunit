(function( window ) {

QUnit.module( "globals" );

function checkExported( assert, methods ) {
	var i, l, method;

	for ( i = 0, l = methods.length; i < l; i++ ) {
		method = methods[ i ];

		assert.strictEqual( typeof( window[ method ] ), "function", "global " + method );

		assert.strictEqual(
			window[ method ],
			QUnit.constructor.prototype[ method ],
			"QUnit exports QUnit." + method + " to the global scope"
		);
	}
}

QUnit.test( "QUnit object", function( assert ) {
	assert.ok( QUnit instanceof QUnit.constructor, "Global QUnit built from it's own constructor" );
});

QUnit.test( "QUnit exported methods", function( assert ) {
	var globals = [
			"test", "asyncTest", "module",
			"start", "stop"
		];

	// 2 assertions per item on checkExported
	assert.expect( globals.length * 2 );

	checkExported( assert, globals );
});

// Get a reference to the global object, like window in browsers
}( (function() {
	return this;
}.call()) ));