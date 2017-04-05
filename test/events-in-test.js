/**
 * This test file verifies the execution order and contents of events emitted
 * by QUnit during the test run. They are expected to adhere to the js-reporters
 * standard.
 */

// These tests are order-dependent
QUnit.config.reorder = false;

function removeUnstableProperties( obj ) {
	if ( typeof obj !== "object" ) {
		return obj;
	}

	delete obj.runtime;
	delete obj.stack;

	Object.keys( obj ).forEach( function( key ) {
		if ( Array.isArray( obj[ key ] ) ) {
			obj[ key ].forEach( removeUnstableProperties );
		} else if ( typeof obj[ key ] === "object" ) {
			removeUnstableProperties( obj[ key ] );
		}
	} );

	return obj;
}

var assertion1 = {
	message: "assertion1",
	passed: true,
	expected: true,
	actual: true,
	todo: false
};

QUnit.on( "assertion", function( data ) {
	if ( data.message === "assertion1" ) {
		QUnit.config.current.assert.deepEqual(
			removeUnstableProperties( data ),
			assertion1,
			"verifies assertion data contains the expected and actual values"
		);
	}
} );

QUnit.module( "Events During Test", function() {
	QUnit.test( "test1", function( assert ) {
		assert.expect( 2 );
		assert.ok( true, "assertion1" );
	} );
} );
