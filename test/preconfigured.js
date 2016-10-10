window.addEventListener( "load", function() {

	// make sure QUnit has started if autostart would be true
	setTimeout( function() {
		QUnit.module( "QUnit.preconfigured.asyncTests" );
		QUnit.test( "QUnit.config should have an expected default", function( assert ) {
			assert.ok( QUnit.config.scrolltop, "The scrolltop default is true" );
		} );

		QUnit.test( "Qunit.config.reorder default was overwritten", function( assert ) {
			assert.notOk( QUnit.config.reorder, "reorder was overwritten" );
		} );

		QUnit.start();
	}, 100 );
} );

QUnit.module( "QUnit.preconfigured" );
QUnit.test( "Autostart is false", function( assert ) {
	assert.notOk( QUnit.config.autostart, "The global autostart setting is applied" );
} );
