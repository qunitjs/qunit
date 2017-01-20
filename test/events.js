/**
 * This test file verifies the execution order and contents of events emitted
 * by QUnit. They are expected to adhere to the js-reporters standard.
 */

var invokedHooks = [],
	invokedHookDetails = {},
	done = false;

function callback( name ) {
	invokedHookDetails[ name ] = [];

	return function( details ) {
		if ( done ) {
			return;
		}

		invokedHooks.push( name );
		invokedHookDetails[ name ].push( details );
	};
}

QUnit.on( "assertion", callback( "assertion1" ) );
QUnit.on( "assertion", callback( "assertion2" ) );

// After all the tests run, we verify the events were fired in the correct order
// with the correct data
QUnit.done( function() {
	if ( done ) {
		return;
	}

	done = true;

	QUnit.module( "Events" );
	QUnit.test( "verify callback order and data", function( assert ) {
		assert.deepEqual( invokedHooks, [
			"assertion1",
			"assertion2"
		], "event callbacks are called in correct order" );

		assert.deepEqual( invokedHookDetails.assertion1[ 0 ], {
			passed: true,
			actual: true,
			expected: true,
			message: "passing assertion",
			stack: undefined
		}, "assertion callback data is correct" );
	} );
} );

QUnit.module( "Events", function() {
	QUnit.test( "test1", function( assert ) {
		assert.ok( true, "passing assertion" );
	} );
} );
