if ( !location.search ) {
	location.replace( "?moduleId=4dea3fbe&moduleId=9bf7d15c" );
}

QUnit.test( "global test", function( assert ) {
	assert.true( false );
} );

QUnit.module( "module A scoped", function() {
	QUnit.test( "test A1", function( assert ) {
		assert.true( false );
	} );

	QUnit.module( "module B nested", function() {
		QUnit.test( "test B1", function( assert ) {
			assert.true( true, "run module B" );
		} );
	} );
} );

QUnit.module( "module D flat" );
QUnit.test( "test D1", function( assert ) {
	assert.true( false );
} );

QUnit.module( "module E flat" );
QUnit.test( "test E1", function( assert ) {
	assert.true( true, "run module E" );
	assert.deepEqual(
		QUnit.config.moduleId,
		[ "4dea3fbe", "9bf7d15c" ],
		"parsed config"
	);
} );
