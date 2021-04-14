QUnit.module( "contains a hard error in hook", hooks => {
	hooks.before( () => {
		throw new Error( "expected error thrown in hook" );
	} );
	QUnit.test( "contains a hard error", assert => {
		assert.true( true );
	} );
} );
