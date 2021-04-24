QUnit.test( "times out before scheduled done is called", assert => {
	assert.timeout( 10 );
	const done = assert.async();
	assert.true( true );
	setTimeout( done, 20 );
} );
