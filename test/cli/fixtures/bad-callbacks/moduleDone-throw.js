QUnit.moduleDone( details => {
	throw new Error( "No dice for " + details.name );
} );

QUnit.module( "module1", () => {
	QUnit.test( "test1", assert => {
		assert.true( true );
	} );
} );

QUnit.module( "module2", () => {
	QUnit.test( "test2", assert => {
		assert.true( true );
	} );
} );
