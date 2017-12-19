"use strict";

QUnit.module( "Unhandled Rejections", function() {
	QUnit.test( "test passes just fine, but has a rejected promise", function( assert ) {
		assert.ok( true );

		const done = assert.async();

		Promise.resolve().then( function() {

			// throwing a non-Error here because stack trace representation
			// across Node versions is not stable (they continue to get better)
			throw {
				message: "Error thrown in non-returned promise!",
				stack: `Error: Error thrown in non-returned promise!
    at /some/path/wherever/unhandled-rejection.js:13:11`
			};
		} );

		// prevent test from exiting before unhandled rejection fires
		setTimeout( done, 10 );
	} );

	// rejecting with a non-Error here because stack trace representation
	// across Node versions is not stable (they continue to get better)
	Promise.reject( {
		message: "outside of a test context",
		stack: `Error: outside of a test context
    at Object.<anonymous> (/some/path/wherever/unhandled-rejection.js:20:18)`
	} );
} );
