if ( !location.search ) {
	location.replace( "?testId=94e5e740" );
}

QUnit.test( "test 1", function( assert ) {
	assert.true( false );
} );

QUnit.test( "test 2", function( assert ) {
	assert.true( true, "run global test 2" );
	assert.deepEqual(
		QUnit.config.testId,
		[ "94e5e740" ],
		"parsed config"
	);
} );

QUnit.test( "test 3", function( assert ) {
	assert.true( false );
} );

