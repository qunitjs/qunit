var done = false;
var errorsThrown = [];

QUnit.onUnhandledRejection = function( e ) {
	errorsThrown.push( e.message );
};

QUnit.begin( function() {
	return new Promise( function( resolve, reject ) {
		reject( new Error( "begin" ) );
	} );
} );

QUnit.moduleStart( function() {
	return new Promise( function( resolve, reject ) {
		reject( new Error( "moduleStart" ) );
	} );
} );

QUnit.testStart( function() {
	return new Promise( function( resolve, reject ) {
		reject( new Error( "testStart" ) );
	} );
} );

// TODO: error here will give a infinite loop of global errors
// because onUnhandledRejection will add another test(), which
// will call testDone callbacks again, which throws another onUnhandledRejection
QUnit.testDone( function() {
	return new Promise( function( resolve, reject ) {
		reject( new Error( "testDone" ) );
	} );
} );

QUnit.moduleDone( function() {
	return new Promise( function( resolve, reject ) {
		reject( new Error( "moduleDone" ) );
	} );
} );

QUnit.done( function() {
	return new Promise( function( resolve, reject ) {
		reject( new Error( "done" ) );
	} );
} );

QUnit.done( function() {
	if ( done ) {
		return;
	}

	done = true;

	QUnit.test( "errorCaught should be true", function( assert ) {
		assert.deepEqual( errorsThrown, [
			"begin",
			"moduleStart",
			"testStart",
			"testDone",
			"moduleDone",
			"done",
			"moduleStart"
		] );
	} );
} );

QUnit.module( "module1", function() {
	QUnit.test( "test pass", function( assert ) {
		assert.ok( true );
	} );
} );
