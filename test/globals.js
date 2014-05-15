(function( window ) {

QUnit.module( "globals" );

function checkExported( assert, methods, isAssertion ) {
	var i, l, method;

	for ( i = 0, l = methods.length; i < l; i++ ) {
		method = methods[ i ];

		assert.strictEqual( typeof( window[ method ] ), "function", "global " + method );

		assert.strictEqual(
			window[ method ],
			QUnit.constructor.prototype[ method ],
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

QUnit.test( "Assertion exported methods", function( assert ) {
	var methods = [
			"expect", "ok",
			"equal", "notEqual",
			"propEqual", "notPropEqual",
			"deepEqual", "notDeepEqual",
			"strictEqual", "notStrictEqual",
			"throws"
		];

	// 2 assertions per item on checkExported
	// +1 assertion per item on the loop
	assert.expect( methods.length * 3 );

	checkExported( assert, methods, true );
});

// Get a reference to the global object, like window in browsers
}( (function() {
	return this;
}.call()) ));