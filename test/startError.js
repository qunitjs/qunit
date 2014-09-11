/*global autostartStartError, tooManyStartsError */

QUnit.module( "global start unrecoverable errors" );

QUnit.test( "Calling start() when QUnit.config.autostart is true should throw Error", function( assert ) {
	assert.expect( 1 );
	assert.equal( autostartStartError.message, "Called start() outside of a test context when QUnit.config.autostart was true" );
});

QUnit.test( "Too many calls to start() outside of test context should throw Error", function( assert ) {
	assert.expect( 1 );
	assert.equal( tooManyStartsError.message, "Called start() outside of a test context too many times" );
});
