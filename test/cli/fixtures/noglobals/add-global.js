QUnit.config.noglobals = true;

QUnit.test( "adds global var", assert => {
	globalThis.dummyGlobal = "hello"; // eslint-disable-line no-undef
	assert.true( true );
} );
