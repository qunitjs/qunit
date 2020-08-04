QUnit.module( "Failure", function() {
	QUnit.test( "bad", function( assert ) {
		assert.true( false );
	} );

	QUnit.test( "bad again", function( assert ) {
		assert.true( false );
	} );
} );
