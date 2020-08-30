QUnit.module( "Example", function() {
	QUnit.test( "good", function( assert ) {
		assert.true( true );
	} );

	QUnit.test( "bad", function( assert ) {
		assert.true( false );
	} );
} );
