QUnit.config.noglobals = true;

global.dummyGlobal = "hello";

QUnit.test( "deletes global var", assert => {
	delete global.dummyGlobal;
	assert.true( true );
} );
