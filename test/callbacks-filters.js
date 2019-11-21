var invokedHooks = [];
var done = false;

function callback( name ) {
	return function() {
		if ( done ) {
			return;
		}

		invokedHooks.push( name );
	};
}

QUnit.begin( callback( "begin" ) );
QUnit.moduleStart( callback( "moduleStart" ) );
QUnit.testStart( callback( "testStart" ) );
QUnit.testDone( callback( "testDone" ) );
QUnit.moduleDone( callback( "moduleDone" ) );
QUnit.done( callback( "done" ) );

QUnit.done( function() {
	if ( done ) {
		return;
	}

	done = true;

	QUnit.test( "verify callback order", function( assert ) {
		assert.deepEqual( invokedHooks, [
			"begin",
			"moduleStart",
			"testStart",
			"testDone",
			"testStart",
			"testDone",
			"moduleDone",
			"moduleStart",
			"testStart",
			"testDone",
			"moduleDone",
			"moduleStart",
			"testStart",
			"testDone",
			"moduleDone",
			"moduleStart",
			"testStart",
			"testDone",
			"moduleStart",
			"testStart",
			"testDone",
			"moduleDone",
			"moduleDone",
			"moduleStart",
			"testStart",
			"testDone",
			"moduleStart",
			"testStart",
			"testDone",
			"testStart",
			"after",
			"testDone",
			"moduleDone",
			"testStart",
			"after",
			"testDone",
			"moduleDone",
			"done"
		] );
	} );
} );

QUnit.config.moduleId = [ "1cf055b9" ];

// match for module Id
QUnit.module( "module1", function() {
	QUnit.test( "test should run 1.1", function( assert ) {
		assert.ok( true );
	} );

	QUnit.test( "test should run 1.2", function( assert ) {
		assert.ok( true );
	} );
} );

// no match module Id
QUnit.module( "module2", function() {
	QUnit.test( "test should NOT run 2.1", function( assert ) {
		assert.ok( false );
	} );

	QUnit.test( "test should NOT run 2.2", function( assert ) {
		assert.ok( false );
	} );
} );

QUnit.config.moduleId = [];
QUnit.config.testId = [ "3b3c4e75" ];

QUnit.module( "module3", function() {

	// match test Id
	QUnit.test( "ABCtest should run 3.1", function( assert ) {
		assert.ok( true );
	} );

	QUnit.test( "test should NOT run 3.2", function( assert ) {
		assert.ok( false );
	} );
} );

QUnit.config.testId = [];
QUnit.config.filter = "!.2";

QUnit.module( "module4", function() {

	// match string filter
	QUnit.test( "test should run 4.1", function( assert ) {
		assert.ok( true );
	} );

	QUnit.test( "test should NOT run 4.2", function( assert ) {
		assert.ok( false );
	} );
} );

// Make sure nested module scenarios are correct
QUnit.module( "module5", function() {
	QUnit.test( "test should run 5", function( assert ) {
		assert.ok( true );
	} );

	QUnit.module( "nestedModule5A", function() {
		QUnit.test( "test should run 5.A.1", function( assert ) {
			assert.ok( true );
		} );
	} );
} );

QUnit.module( "module6", {
	after: function( ) {
		invokedHooks.push( "after" );
	}
}, function() {
	QUnit.test( "test should run 6.1", function( assert ) {
		assert.ok( true );
	} );

	QUnit.test( "test should NOT run 6.2", function( assert ) {
		assert.ok( true );
	} );

	QUnit.module( "nestedModule6A", {
		after: function( ) {
			invokedHooks.push( "after" );
		}
	}, function() {
		QUnit.test( "test should run 6.A.1", function( assert ) {
			assert.ok( true );
		} );
		QUnit.test( "test should run 6.A.2", function( assert ) {
			assert.ok( true );
		} );
		QUnit.test( "test should run 6.A.3", function( assert ) {
			assert.ok( true );
		} );
	} );

	QUnit.test( "test should run 6.3", function( assert ) {
		assert.ok( true );
	} );
} );
