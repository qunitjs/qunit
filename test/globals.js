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


QUnit.test( "QUnit.assert methods not exposed on QUnit.constructor.prototype", function( assert ) {
	var i, l,
		assertions = [
			"expect",
			"ok",
			"equal",
			"notEqual",
			"propEqual",
			"notPropEqual",
			"deepEqual",
			"notDeepEqual",
			"strictEqual",
			"notStrictEqual",
			"throws"
		];

	assert.expect( 22 );

	function throwIt( name ) {
		assert.throws(
			function() {
				QUnit[ name ]();
			},
			/is deprecated/,
			"QUnit." + name + "() throws an error"
		);

		assert.throws(
			function() {
				window[ name ]();
			},
			/is deprecated/,
			"window." + name + "() throws an error"
		);
	}

	for ( i = 0, l = assertions.length; i < l; i++ ) {
		throwIt( assertions[ i ] );
	}
});

// Get a reference to the global object, like window in browsers
}( (function() {
	return this;
}.call()) ));