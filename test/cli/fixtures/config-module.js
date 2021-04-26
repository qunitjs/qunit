QUnit.config.module = "MODULE b";

QUnit.module( "Module A", () => {
	QUnit.test( "Test A", assert => {
		assert.true( false ); // fail if hit
	} );
} );

QUnit.module( "Module B", () => {
	QUnit.test( "Test B", assert => {
		assert.true( true );
	} );
} );

QUnit.module( "Module C", () => {
	QUnit.test( "Test C", assert => {
		assert.true( false ); // fail if hit
	} );
} );
