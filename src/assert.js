// `assert` initialized at top of scope
// Assert helpers
// All of these must either call QUnit.push() or manually do:
// - runLoggingCallbacks( "log", .. );
// - config.current.assertions.push({ .. });
assert = QUnit.assert = {

	// Specify the number of expected assertions to guarantee that failed test (no assertions are run at all) don't slip through.
	expect: function( asserts ) {
		if ( arguments.length === 1 ) {
			config.current.expected = asserts;
		} else {
			return config.current.expected;
		}
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
			QUnit.push( true, result, true, message );
		} else {
			QUnit.pushFailure( message, null, result );
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
		QUnit.push( expected == actual, actual, expected, message );
	},

	/**
	 * @name notEqual
	 * @function
	 */
	notEqual: function( actual, expected, message ) {
		/*jshint eqeqeq:false */
		QUnit.push( expected != actual, actual, expected, message );
	},

	/**
	 * @name propEqual
	 * @function
	 */
	propEqual: function( actual, expected, message ) {
		actual = objectValues( actual );
		expected = objectValues( expected );
		QUnit.push( QUnit.equiv( actual, expected ), actual, expected, message );
	},

	/**
	 * @name notPropEqual
	 * @function
	 */
	notPropEqual: function( actual, expected, message ) {
		actual = objectValues( actual );
		expected = objectValues( expected );
		QUnit.push( !QUnit.equiv( actual, expected ), actual, expected, message );
	},

	/**
	 * @name deepEqual
	 * @function
	 */
	deepEqual: function( actual, expected, message ) {
		QUnit.push( QUnit.equiv( actual, expected ), actual, expected, message );
	},

	/**
	 * @name notDeepEqual
	 * @function
	 */
	notDeepEqual: function( actual, expected, message ) {
		QUnit.push( !QUnit.equiv( actual, expected ), actual, expected, message );
	},

	/**
	 * @name strictEqual
	 * @function
	 */
	strictEqual: function( actual, expected, message ) {
		QUnit.push( expected === actual, actual, expected, message );
	},

	/**
	 * @name notStrictEqual
	 * @function
	 */
	notStrictEqual: function( actual, expected, message ) {
		QUnit.push( expected !== actual, actual, expected, message );
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

		config.current.ignoreGlobalErrors = true;
		try {
			block.call( config.current.testEnvironment );
		} catch (e) {
			actual = e;
		}
		config.current.ignoreGlobalErrors = false;

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

			QUnit.push( ok, actual, expectedOutput, message );
		} else {
			QUnit.pushFailure( message, null, "No exception was thrown." );
		}
	}
};

/**
 * @deprecated since 1.8.0
 * Kept assertion helpers in root for backwards compatibility.
 */
extend( QUnit.constructor.prototype, assert );
