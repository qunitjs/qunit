QUnit.test( "assertion after errored/rejected tests does not cause further errors", function( assert ) {
	setTimeout( () => assert.ok( true ), 10 );
	return Promise.reject();
} );
