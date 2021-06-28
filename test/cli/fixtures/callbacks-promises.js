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
		console.warn( "CALLBACK: begin" );
	}, 100 );
} );
QUnit.begin( function() {
	return timeoutPromiseCallback( function() {
		console.warn( "CALLBACK: begin2" );
	}, 10 );
} );
QUnit.moduleStart( function() {
	return timeoutPromiseCallback( function() {
		console.warn( "CALLBACK: moduleStart" );
	}, 100 );
} );
QUnit.testStart( function( cb ) {
	return timeoutPromiseCallback( function() {
		console.warn( "CALLBACK: testStart - " + cb.name );
	}, 100 );
} );

QUnit.testDone( function( cb ) {
	return timeoutPromiseCallback( function() {
		console.warn( "CALLBACK: testDone - " + cb.name );
	}, 100 );
} );
QUnit.moduleDone( function( cb ) {
	return timeoutPromiseCallback( function() {
		console.warn( "CALLBACK: moduleDone - " + cb.name );
	}, 100 );
} );
QUnit.done( function() {
	return timeoutPromiseCallback( function() {
		console.warn( "CALLBACK: done" );
	}, 100 );
} );

QUnit.module( "module1", function() {
	QUnit.module( "nestedModule1", function() {
		QUnit.test( "test1", function( assert ) {
			assert.true( true );
		} );
	} );

	QUnit.test( "test2", function( assert ) {
		assert.true( true );
	} );

	QUnit.module( "nestedModule2", function() {
		QUnit.test( "test3", function( assert ) {
			assert.true( true );
		} );
	} );
} );
