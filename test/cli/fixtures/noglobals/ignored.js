QUnit.config.noglobals = true;

QUnit.test( "adds global var", assert => {
	globalThis[ "qunit-test-output-dummy" ] = "hello"; // eslint-disable-line no-undef
	assert.true( true );
} );
