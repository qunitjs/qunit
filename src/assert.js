function Assert( testContext ) {
	this.test = testContext;
}

// Assert helpers
QUnit.assert = Assert.prototype = {

	// Specify the number of expected assertions to guarantee that failed test (no assertions are run at all) don't slip through.
	expect: function( asserts ) {
		if ( arguments.length === 1 ) {
			this.test.expected = asserts;
		} else {
			return this.test.expected;
		}
	},

	// Exports test.push() to the user API
	push: function() {
		return this.test.push.apply( this.test, arguments );
	},

	/**
	 * Asserts rough true-ish result.
	 * @name ok
	 * @function
	 * @example ok( "asdfasdf".length > 5, "There must be at least 5 chars" );
	 */
	ok: function( result, message ) {
		message = message || ( result ? "okay" : "failed, expected argument to be truthy, was: " +
			QUnit.dump.parse( result ) );
		if ( !!result ) {
			this.push( true, result, true, message );
		} else {
			this.test.pushFailure( message, null, result );
		}
	},

	/**
	 * Assert that the first two arguments are equal, with an optional message.
	 * Prints out both actual and expected values.
	 * @name equal
	 * @function
	 * @example equal( format( "Received {0} bytes.", 2), "Received 2 bytes.", "format() replaces {0} with next argument" );
	 */
	equal: function( actual, expected, message ) {
		/*jshint eqeqeq:false */
		this.push( expected == actual, actual, expected, message );
	},

	/**
	 * @name notEqual
	 * @function
	 */
	notEqual: function( actual, expected, message ) {
		/*jshint eqeqeq:false */
		this.push( expected != actual, actual, expected, message );
	},

	/**
	 * @name propEqual
	 * @function
	 */
	propEqual: function( actual, expected, message ) {
		actual = objectValues( actual );
		expected = objectValues( expected );
		this.push( QUnit.equiv( actual, expected ), actual, expected, message );
	},

	/**
	 * @name notPropEqual
	 * @function
	 */
	notPropEqual: function( actual, expected, message ) {
		actual = objectValues( actual );
		expected = objectValues( expected );
		this.push( !QUnit.equiv( actual, expected ), actual, expected, message );
	},

	/**
	 * @name deepEqual
	 * @function
	 */
	deepEqual: function( actual, expected, message ) {
		this.push( QUnit.equiv( actual, expected ), actual, expected, message );
	},

	/**
	 * @name notDeepEqual
	 * @function
	 */
	notDeepEqual: function( actual, expected, message ) {
		this.push( !QUnit.equiv( actual, expected ), actual, expected, message );
	},

	/**
	 * @name strictEqual
	 * @function
	 */
	strictEqual: function( actual, expected, message ) {
		this.push( expected === actual, actual, expected, message );
	},

	/**
	 * @name notStrictEqual
	 * @function
	 */
	notStrictEqual: function( actual, expected, message ) {
		this.push( expected !== actual, actual, expected, message );
	},

	"throws": function( block, expected, message ) {
		var actual,
			expectedOutput = expected,
			ok = false;

		// 'expected' is optional
		if ( !message && typeof expected === "string" ) {
			message = expected;
			expected = null;
		}

		this.test.ignoreGlobalErrors = true;
		try {
			block.call( this.test.testEnvironment );
		} catch (e) {
			actual = e;
		}
		this.test.ignoreGlobalErrors = false;

		if ( actual ) {

			// we don't want to validate thrown error
			if ( !expected ) {
				ok = true;
				expectedOutput = null;

			// expected is an Error object
			} else if ( expected instanceof Error ) {
				ok = actual instanceof Error &&
					 actual.name === expected.name &&
					 actual.message === expected.message;

			// expected is a regexp
			} else if ( QUnit.objectType( expected ) === "regexp" ) {
				ok = expected.test( errorString( actual ) );

			// expected is a string
			} else if ( QUnit.objectType( expected ) === "string" ) {
				ok = expected === errorString( actual );

			// expected is a constructor
			} else if ( actual instanceof expected ) {
				ok = true;

			// expected is a validation function which returns true is validation passed
			} else if ( expected.call( {}, actual ) === true ) {
				expectedOutput = null;
				ok = true;
			}

			this.push( ok, actual, expectedOutput, message );
		} else {
			this.test.pushFailure( message, null, "No exception was thrown." );
		}
	}
};

(function( asserts ) {
	var name;

	function makeThrowFn( name, prefix ) {
		var throwFn = function() {
			throw prefix + "." + name + "() is deprecated, use the assert parameter of " +
				"the test() callback and assert." + name + "() instead";
		};

		return throwFn;
	}

	for ( name in asserts ) {
		if ( asserts.hasOwnProperty( name ) ) {
			QUnit[ name ] = makeThrowFn( name, "QUnit" );
			if ( typeof window !== "undefined" ) {
				window[ name ] = makeThrowFn( name, "window" );
			}
		}
	}

})( QUnit.assert );
