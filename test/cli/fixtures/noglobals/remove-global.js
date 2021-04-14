QUnit.config.noglobals = true;

globalThis.dummyGlobal = "hello"; // eslint-disable-line no-undef

QUnit.test( "deletes global var", assert => {
	delete global.dummyGlobal;
	assert.true( true );
} );
