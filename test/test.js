function getPreviousTests( rTestName, rModuleName ) {
	var testSpan, moduleSpan,
		matches = [],
		i = 0,
		rModule = /(^| )module-name( |$)/,
		testNames = typeof document.getElementsByClassName !== "undefined" ?
			document.getElementsByClassName( "test-name" ) :
			(function( spans ) {
				var span,
					tests = [],
					i = 0,
					rTest = /(^| )test-name( |$)/;
				for ( ; ( span = spans[ i ] ); i++ ) {
					if ( rTest.test( span.className ) ) {
						tests.push( span );
					}
				}
				return tests;
			})( document.getElementsByTagName( "span" ) );

	for ( ; ( testSpan = testNames[ i ] ); i++ ) {
		moduleSpan = testSpan;
		while ( ( moduleSpan = moduleSpan.previousSibling ) ) {
			if ( rModule.test( moduleSpan.className ) ) {
				break;
			}
		}
		if ( ( !rTestName || rTestName.test( testSpan.innerHTML ) ) &&
			( !rModuleName || moduleSpan && rModuleName.test( moduleSpan.innerHTML ) ) ) {

			while ( ( testSpan = testSpan.parentNode ) ) {
				if ( testSpan.nodeName.toLowerCase() === "li" ) {
					matches.push( testSpan );
				}
			}
		}
	}
	return matches;
}

QUnit.test( "expect query and multiple issue", function( assert ) {
	assert.expect( 2 );
	assert.ok( true );
	var expected = assert.expect();
	assert.equal( expected, 2 );
	assert.expect( expected + 1 );
	assert.ok( true );
});

// TODO: More to the html-reporter test once we have that.
if ( typeof document !== "undefined" ) {

	QUnit.module( "<script id='qunit-unescaped-module'>'module';</script>", {
		beforeEach: function() {
		},
		afterEach: function( assert ) {

			// We can't use ok(false) inside script tags since some browsers
			// don't evaluate script tags inserted through innerHTML after domready.
			// Counting them before/after doesn't cover everything either as qunit-modulefilter
			// is created before any test is ran. So use ids instead.
			if ( document.getElementById( "qunit-unescaped-module" ) ) {

				// This can either be from in #qunit-modulefilter or #qunit-testresult
				assert.ok( false, "Unescaped module name" );
			}
			if ( document.getElementById( "qunit-unescaped-test" ) ) {
				assert.ok( false, "Unescaped test name" );
			}
			if ( document.getElementById( "qunit-unescaped-assertion" ) ) {
				assert.ok( false, "Unescaped test name" );
			}
		}
	});

	QUnit.test( "<script id='qunit-unescaped-test'>'test';</script>", function( assert ) {
		assert.expect( 1 );
		assert.ok( true, "<script id='qunit-unescaped-asassertionsert'>'assertion';</script>" );
	});
}

QUnit.module( "assertions" );

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

if ( typeof document !== "undefined" ) {

QUnit.module( "fixture" );

QUnit.test( "setup", function( assert ) {
	assert.expect( 0 );
	document.getElementById( "qunit-fixture" ).innerHTML = "foobar";
});

QUnit.test( "basics", function( assert ) {
	assert.equal(
		document.getElementById( "qunit-fixture" ).innerHTML,
		"test markup",
		"automatically reset"
	);
});

QUnit.test( "running test name displayed", function( assert ) {
	assert.expect( 2 );

	var displaying = document.getElementById( "qunit-testresult" );

	assert.ok( /running test name displayed/.test( displaying.innerHTML ),
		"Expect test name to be found in displayed text"
	);
	assert.ok( /fixture/.test( displaying.innerHTML ),
		"Expect module name to be found in displayed text"
	);
});

(function() {
	var delayNextSetup;

	QUnit.module( "timing", {
		beforeEach: function( assert ) {
			var done;
			if ( delayNextSetup ) {
				delayNextSetup = false;
				done = assert.async();
				setTimeout(function() {
					done();
				}, 250 );
			}
		}
	});

	QUnit.test( "setup", function( assert ) {
		assert.expect( 0 );
		delayNextSetup = true;
	});

	QUnit.test( "basics", function( assert ) {
		assert.expect( 2 );
		var previous = getPreviousTests( /^setup$/, /^timing$/ )[ 0 ],
			runtime = previous.lastChild.previousSibling;
		assert.ok( /(^| )runtime( |$)/.test( runtime.className ), "Runtime element exists" );
		assert.ok( /^\d+ ms$/.test( runtime.innerHTML ), "Runtime reported in ms" );
	});

	QUnit.test( "values", function( assert ) {
		assert.expect( 2 );
		var basics = getPreviousTests( /^setup$/, /^timing$/ )[ 0 ],
			slow = getPreviousTests( /^basics$/, /^timing$/ )[ 0 ];
		assert.ok( parseInt( basics.lastChild.previousSibling.innerHTML, 10 ) < 100,
			"Fast runtime for trivial test"
		);
		assert.ok( parseInt( slow.lastChild.previousSibling.innerHTML, 10 ) > 250,
			"Runtime includes beforeEach"
		);
	});
})();

}

QUnit.module( "custom assertions" );

QUnit.assert.mod2 = function( value, expected, message ) {
	var actual = value % 2;
	this.push( actual === expected, actual, expected, message );
};

QUnit.test( "mod2", function( assert ) {
	assert.expect( 2 );

	assert.mod2( 2, 0, "2 % 2 == 0" );
	assert.mod2( 3, 1, "3 % 2 == 1" );
});

QUnit.module( "QUnit.skip", {
	beforeEach: function( assert ) {

		// skip test hooks for skipped tests
		assert.ok( false, "skipped function" );
		throw "Error";
	},
	afterEach: function( assert ) {
		assert.ok( false, "skipped function" );
		throw "Error";
	}
});

QUnit.skip( "test blocks are skipped", function( assert ) {

	// this test callback won't run, even with broken code
	assert.expect( 1000 );
	throw "Error";
});

QUnit.skip( "no function" );
