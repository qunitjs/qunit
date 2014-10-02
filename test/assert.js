QUnit.module( "assert" );

QUnit.test( "propEqual", function( assert ) {
	assert.expect( 5 );
	var objectCreate = Object.create || function( origin ) {
		function O() {}
		O.prototype = origin;
		var r = new O();
		return r;
	};

	function Foo( x, y, z ) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	Foo.prototype.doA = function() {};
	Foo.prototype.doB = function() {};
	Foo.prototype.bar = "prototype";

	function Bar() {
	}
	Bar.prototype = objectCreate( Foo.prototype );
	Bar.prototype.constructor = Bar;

	assert.propEqual(
		new Foo( 1, "2", [] ),
		{
			x: 1,
			y: "2",
			z: []
		}
	);

	assert.notPropEqual(
		new Foo( "1", 2, 3 ),
		{
			x: 1,
			y: "2",
			z: 3
		},
		"Primitive values are strictly compared"
	);

	assert.notPropEqual(
		new Foo( 1, "2", [] ),
		{
			x: 1,
			y: "2",
			z: {}
		},
		"Array type is preserved"
	);

	assert.notPropEqual(
		new Foo( 1, "2", {} ),
		{
			x: 1,
			y: "2",
			z: []
		},
		"Empty array is not the same as empty object"
	);

	assert.propEqual(
		new Foo( 1, "2", new Foo( [ 3 ], new Bar(), null ) ),
		{
			x: 1,
			y: "2",
			z: {
				x: [ 3 ],
				y: {},
				z: null
			}
		},
		"Complex nesting of different types, inheritance and constructors"
	);
});

QUnit.test( "throws", function( assert ) {
	assert.expect( 16 );
	function CustomError( message ) {
		this.message = message;
	}

	CustomError.prototype.toString = function() {
		return this.message;
	};

	assert.throws(
		function() {
			throw "my error";
		}
	);

	assert.throws(
		function() {
			throw "my error";
		},
		"simple string throw, no 'expected' value given"
	);

	// This test is for IE 7 and prior which does not properly
	// implement Error.prototype.toString
	assert.throws(
		function() {
			throw new Error( "error message" );
		},
		/error message/,
		"use regexp against instance of Error"
	);

	assert.throws(
		function() {
			throw new TypeError();
		},
		Error,
		"thrown TypeError without a message is an instance of Error"
	);

	assert.throws(
		function() {
			throw new TypeError();
		},
		TypeError,
		"thrown TypeError without a message is an instance of TypeError"
	);

	assert.throws(
		function() {
			throw new TypeError( "error message" );
		},
		Error,
		"thrown TypeError with a message is an instance of Error"
	);

	// This test is for IE 8 and prior which goes against the standards
	// by considering that the native Error constructors, such TypeError,
	// are also instances of the Error constructor. As such, the assertion
	// sometimes went down the wrong path.
	assert.throws(
		function() {
			throw new TypeError( "error message" );
		},
		TypeError,
		"thrown TypeError with a message is an instance of TypeError"
	);

	assert.throws(
		function() {
			throw new CustomError( "some error description" );
		},
		CustomError,
		"thrown error is an instance of CustomError"
	);

	assert.throws(
		function() {
			throw new Error( "some error description" );
		},
		/description/,
		"use a regex to match against the stringified error"
	);

	assert.throws(
		function() {
			throw new Error( "foo" );
		},
		new Error( "foo" ),
		"thrown error object is similar to the expected Error object"
	);

	assert.throws(
		function() {
			throw new CustomError( "some error description" );
		},
		new CustomError( "some error description" ),
		"thrown error object is similar to the expected CustomError object"
	);

	assert.throws(
		function() {
			throw {
				name: "SomeName",
				message: "some message"
			};
		},
		{ name: "SomeName", message: "some message" },
		"thrown error object is similar to the expected plain object"
	);

	assert.throws(
		function() {
			throw new CustomError( "some error description" );
		},
		function( err ) {
			return err instanceof CustomError && /description/.test( err );
		},
		"custom validation function"
	);

	assert.throws(
		function() {

			/*jshint ignore:start */
			( window.execScript || function( data ) {
				window.eval.call( window, data );
			})( "throw 'error';" );

			/*jshint ignore:end */
		},
		"globally-executed errors caught"
	);

	this.CustomError = CustomError;

	assert.throws(
		function() {
			throw new this.CustomError( "some error description" );
		},
		/description/,
		"throw error from property of 'this' context"
	);

	assert.throws(
		function() {
			throw "some error description";
		},
		"some error description",
		"handle string typed thrown errors"
	);
});

QUnit.test( "raises, alias for throws", function( assert ) {
	assert.expect( 1 );
	assert.raises(function() {
		throw "my error";
	});
});
