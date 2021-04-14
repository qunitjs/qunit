QUnit.config.noglobals = true;

QUnit.test( "adds global var", assert => {
	global.dummyGlobal = "hello"; // eslint-disable-line no-undef
	assert.true( true );
} );
