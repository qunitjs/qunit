QUnit.config.reorder = false;

let done;

QUnit.test( "Test A", assert => {
	assert.ok( true );
	done = assert.async();
	throw new Error( "this is an intentional error" );
} );

QUnit.test( "Test B", assert => {
	assert.ok( true );

	// This bad call is silently ignored because "Test A" already failed
	// and we cancelled the async pauses.
	done();
} );
