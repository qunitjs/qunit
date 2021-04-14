QUnit.test( "tries to 'restart' the test", assert => {
	assert.test.semaphore = -1;
	return Promise.resolve();
} );
