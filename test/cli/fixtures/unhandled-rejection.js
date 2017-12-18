"use strict";

QUnit.module( "Unhandled Rejections", function() {
	QUnit.test( "test passes just fine, but has a rejected promise", function( assert ) {
		assert.ok( true );

		const done = assert.async();

		new Promise( function( resolve ) {
			setTimeout( resolve );
		} )
			.then( function() {
				throw new Error( "Error thrown in non-returned promise!" );
			} );

		// prevent test from exiting before unhandled rejection fires
		setTimeout( done, 10 );
	} );
} );
