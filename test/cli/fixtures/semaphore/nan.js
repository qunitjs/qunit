QUnit.test( "semaphore is set to NaN", assert => {
	assert.test.semaphore = "not a number";
	assert.async();
	return Promise.resolve();
} );
