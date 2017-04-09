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

QUnit.begin( callback( "begin1" ) );
QUnit.begin( callback( "begin2" ) );
QUnit.moduleStart( callback( "moduleStart1" ) );
QUnit.moduleStart( callback( "moduleStart2" ) );
QUnit.testStart( callback( "testStart1" ) );
QUnit.testStart( callback( "testStart2" ) );

QUnit.log( callback( "log1" ) );
QUnit.log( callback( "log2" ) );

QUnit.testDone( callback( "testDone1" ) );
QUnit.testDone( callback( "testDone2" ) );
QUnit.moduleDone( callback( "moduleDone1" ) );
QUnit.moduleDone( callback( "moduleDone2" ) );
QUnit.done( callback( "done1" ) );
QUnit.done( callback( "done2" ) );

QUnit.done( function() {
	if ( done ) {
		return;
	}

	done = true;

	QUnit.test( "verify callback order", function( assert ) {
		assert.deepEqual( invokedHooks, [
			"begin1",
			"begin2",
			"moduleStart1",
			"moduleStart2",
			"testStart1",
			"testStart2",
			"module1 > before",
			"module1 > beforeEach",
			"module1 > test1",
			"log1",
			"log2",
			"module1 > afterEach",
			"testDone1",
			"testDone2",
			"moduleStart1",
			"moduleStart2",
			"testStart1",
			"testStart2",
			"module2 > before",
			"module1 > beforeEach",
			"module2 > beforeEach",
			"module2 > test1",
			"log1",
			"log2",
			"module2 > afterEach",
			"module1 > afterEach",
			"module2 > after",
			"testDone1",
			"testDone2",
			"moduleDone1",
			"moduleDone2",
			"moduleStart1",
			"moduleStart2",
			"testStart1",
			"testStart2",
			"module3 > before",
			"module1 > beforeEach",
			"module3 > beforeEach",
			"module3 > test1",
			"log1",
			"log2",
			"module3 > afterEach",
			"module1 > afterEach",
			"module3 > after",
			"testDone1",
			"testDone2",
			"moduleDone1",
			"moduleDone2",
			"testStart1",
			"testStart2",
			"module1 > beforeEach",
			"module1 > test2",
			"log1",
			"log2",
			"module1 > afterEach",
			"testDone1",
			"testDone2",
			"moduleStart1",
			"moduleStart2",
			"testStart1",
			"testStart2",
			"module4 > before",
			"module1 > beforeEach",
			"module4 > beforeEach",
			"module4 > test1",
			"log1",
			"log2",
			"module4 > afterEach",
			"module1 > afterEach",
			"module4 > after",
			"module1 > after",
			"testDone1",
			"testDone2",
			"moduleDone1",
			"moduleDone2",
			"moduleDone1",
			"moduleDone2",
			"done1",
			"done2"
		] );
	} );
} );

QUnit.module( "module1", {
	before: callback( "module1 > before" ),
	beforeEach: callback( "module1 > beforeEach" ),
	afterEach: callback( "module1 > afterEach" ),
	after: callback( "module1 > after" )
}, function() {
	QUnit.test( "test1", function( assert ) {
		invokedHooks.push( "module1 > test1" );
		assert.ok( true );
	} );

	QUnit.module( "module2", {
		before: callback( "module2 > before" ),
		beforeEach: callback( "module2 > beforeEach" ),
		afterEach: callback( "module2 > afterEach" ),
		after: callback( "module2 > after" )
	}, function() {
		QUnit.test( "test1", function( assert ) {
			invokedHooks.push( "module2 > test1" );
			assert.ok( true );
		} );
	} );

	QUnit.module( "module3", {
		before: callback( "module3 > before" ),
		beforeEach: callback( "module3 > beforeEach" ),
		afterEach: callback( "module3 > afterEach" ),
		after: callback( "module3 > after" )
	}, function() {
		QUnit.test( "test1", function( assert ) {
			invokedHooks.push( "module3 > test1" );
			assert.ok( true );
		} );
	} );

	QUnit.test( "test2", function( assert ) {
		invokedHooks.push( "module1 > test2" );
		assert.ok( true );
	} );

	QUnit.module( "module4", {
		before: callback( "module4 > before" ),
		beforeEach: callback( "module4 > beforeEach" ),
		afterEach: callback( "module4 > afterEach" ),
		after: callback( "module4 > after" )
	}, function() {
		QUnit.test( "test1", function( assert ) {
			invokedHooks.push( "module4 > test1" );
			assert.ok( true );
		} );
	} );
} );
