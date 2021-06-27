"use strict";

QUnit.module( "Unhandled Rejections", function() {
	QUnit.test( "test passes just fine, but has a rejected promise", function( assert ) {
		assert.true( true );

		const done = assert.async();

		Promise.resolve().then( function() {
			throw new Error( "Error thrown in non-returned promise!" );
		} );

		// prevent test from exiting before unhandled rejection fires
		setTimeout( done, 10 );
	} );

	Promise.reject( new Error( "outside of a test context" ) );
} );
