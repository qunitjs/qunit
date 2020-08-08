QUnit.module( "timeout", function() {
	QUnit.test( "first", function( assert ) {
		assert.timeout( 10 );

		return new Promise( resolve => setTimeout( resolve, 20 ) );
	} );

	QUnit.test( "second", function( assert ) {
		return new Promise( resolve => setTimeout( resolve, 20 ) )
			.then( () => {
				assert.true( true, "This promise resolved" );
			} );
	} );
} );
