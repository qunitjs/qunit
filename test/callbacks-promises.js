var done = false;
var callbackCalled = {};

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
		callbackCalled.begin = true;
	}, 100 );
} );
QUnit.moduleStart( function() {
	return timeoutPromiseCallback( function() {
		callbackCalled.moduleStart = true;
	}, 100 );
} );
QUnit.testStart( function() {
	return timeoutPromiseCallback( function() {
		callbackCalled.testStart = true;
	}, 100 );
} );

QUnit.testDone( function() {
	return timeoutPromiseCallback( function() {
		callbackCalled.testStart = false;
		callbackCalled.testDone = true;
	}, 100 );
} );
QUnit.moduleDone( function() {
	return timeoutPromiseCallback( function() {
		callbackCalled.moduleStart = false;
		callbackCalled.moduleDone = true;
	}, 100 );
} );
QUnit.done( function() {
	return timeoutPromiseCallback( function() {
		callbackCalled.done = true;
	}, 100 );
} );

QUnit.done( function() {
	if ( done ) {
		return;
	}

	done = true;

	QUnit.test( "verify callback order", function( assert ) {
		assert.ok( callbackCalled.begin );
		assert.notOk( callbackCalled.moduleStart );
		assert.notOk( callbackCalled.testStart );
		assert.ok( callbackCalled.testDone );
		assert.ok( callbackCalled.moduleDone );
		assert.ok( callbackCalled.done );
	} );
} );

QUnit.module( "module1", function() {
	QUnit.test( "test1", function( assert ) {
		assert.ok( callbackCalled.begin );
		assert.ok( callbackCalled.moduleStart );
		assert.ok( callbackCalled.testStart );
	} );
} );
