QUnit.test( "undefined hooks", function( assert ) {
	const done = assert.async();
	assert.ok( 1 == "1", "Passed!" ); // eslint-disable-line eqeqeq
	setTimeout( done, 10 );
	return Promise.reject();
} );
