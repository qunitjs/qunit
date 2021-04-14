QUnit.test( "contains a hard error", assert => {
	assert.async(); // and ensure it can recover
	assert.true( true );
	throw new Error( "expected error thrown in test" );
} );
