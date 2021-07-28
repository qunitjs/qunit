QUnit.config.reorder = false;

let done;

QUnit.test( "Test A", assert => {
	assert.ok( true );
	done = assert.async();
	throw new Error( "this is an intentional error" );
} );

QUnit.test( "Test B", assert => {
	assert.ok( true );
	done(); // Silently ignored since "Test A" already failed and we killed its async pauses.
} );
