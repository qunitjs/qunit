QUnit.module( "module manually returning a promise", function() {
	QUnit.test( "has a test", function( assert ) {
		assert.true( true );
	} );
	return Promise.resolve( 1 );
} );
