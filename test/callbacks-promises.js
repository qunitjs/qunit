var done = false;
var invokedHooks = [];

function timeoutPromiseCallback( callback, timeout ) {
	return new Promise( function( resolve ) {
		setTimeout( function() {
			callback();
			resolve();
		}, timeout );
	} );
}

QUnit.begin( function() {
	return timeoutPromiseCallback( function() {
		invokedHooks.push( "begin" );
	}, 100 );
} );
QUnit.begin( function() {
	return timeoutPromiseCallback( function() {

		// This is the second begin callback, which should
		// be executed only after the first one
		if ( invokedHooks.indexOf( "begin" ) !== 0 ) {
			return;
		}
		invokedHooks.push( "begin2" );
	}, 10 );
} );
QUnit.moduleStart( function() {
	return timeoutPromiseCallback( function() {
		invokedHooks.push( "moduleStart" );
	}, 100 );
} );
QUnit.testStart( function( cb ) {
	return timeoutPromiseCallback( function() {
		invokedHooks.push( "testStart - " + cb.name );
	}, 100 );
} );

QUnit.testDone( function( cb ) {
	return timeoutPromiseCallback( function() {
		invokedHooks.push( "testDone - " + cb.name );
	}, 100 );
} );
QUnit.moduleDone( function( cb ) {
	return timeoutPromiseCallback( function() {
		invokedHooks.push( "moduleDone - " + cb.name );
	}, 100 );
} );
QUnit.done( function() {
	return timeoutPromiseCallback( function() {
		invokedHooks.push( "done" );
	}, 100 );
} );

QUnit.done( function() {
	if ( done ) {
		return;
	}

	done = true;

	QUnit.test( "verify callback order", function( assert ) {
		assert.deepEqual( invokedHooks, [
			"begin",
			"begin2",
			"moduleStart",
			"moduleStart",
			"testStart - test1",
			"testDone - test1",
			"moduleDone - module1 > nestedModule1",
			"testStart - test2",
			"testDone - test2",
			"moduleStart",
			"testStart - test3",
			"testDone - test3",
			"moduleDone - module1 > nestedModule2",
			"moduleDone - module1",
			"done",
			"moduleStart",
			"testStart - verify callback order"
		] );
	} );
} );

QUnit.module( "module1", function() {
	QUnit.module( "nestedModule1", function() {
		QUnit.test( "test1", function( assert ) {
			assert.deepEqual( invokedHooks, [
				"begin",
				"begin2",
				"moduleStart",
				"moduleStart",
				"testStart - test1"
			] );
		} );
	} );

	QUnit.test( "test2", function( assert ) {
		assert.deepEqual( invokedHooks, [
			"begin",
			"begin2",
			"moduleStart",
			"moduleStart",
			"testStart - test1",
			"testDone - test1",
			"moduleDone - module1 > nestedModule1",
			"testStart - test2"
		] );
	} );

	QUnit.module( "nestedModule2", function() {
		QUnit.test( "test3", function( assert ) {
			assert.deepEqual( invokedHooks, [
				"begin",
				"begin2",
				"moduleStart",
				"moduleStart",
				"testStart - test1",
				"testDone - test1",
				"moduleDone - module1 > nestedModule1",
				"testStart - test2",
				"testDone - test2",
				"moduleStart",
				"testStart - test3"
			] );
		} );
	} );
} );
