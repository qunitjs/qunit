QUnit.module( "Zero assertions", function() {
	QUnit.test( "has a test", function( assert ) {
		assert.expect( 0 );

		// A test may expect zero assertions if its main purpose
		// is to ensure there are no no run-time exceptions.
	} );
} );
