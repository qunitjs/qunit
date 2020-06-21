QUnit.module( "Zero assertions", function() {
	QUnit.test( "has a test", function( assert ) {
		assert.expect( 0 );

		/* A zero assertion test run
		that might be written when using another assertion library other than the QUnit built-ins
		to verify tested behaviour */
	} );
} );
