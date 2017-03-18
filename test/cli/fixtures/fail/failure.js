QUnit.module( "Failure", function() {
	QUnit.test( "bad", function( assert ) {
		assert.ok( false );
	} );

	QUnit.test( "bad again", function( assert ) {
		assert.ok( false );
	} );
} );
