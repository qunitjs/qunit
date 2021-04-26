QUnit.config.noglobals = true;

QUnit.test( "adds global var", assert => {
	global[ "qunit-test-output-dummy" ] = "hello"; // eslint-disable-line no-undef
	assert.true( true );
} );
