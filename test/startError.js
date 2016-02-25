/*global autostartStartError, tooManyStartsError */

QUnit.module( "global start unrecoverable errors" );

QUnit.test( "start() throws when QUnit.config.autostart === true", function( assert ) {
	assert.expect( 1 );
	assert.equal( autostartStartError.message,
		"Called start() outside of a test context when QUnit.config.autostart was true" );
} );

QUnit.test( "Throws after calling start() too many times outside of a test context",
		function( assert ) {
	assert.expect( 1 );
	assert.equal( tooManyStartsError.message,
		"Called start() outside of a test context too many times" );
} );
