function callback( name ) {
	return function() {
		console.warn( "CALLBACK: " + name );
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

QUnit.module( "module1", {
	before: callback( "module1 > before" ),
	beforeEach: callback( "module1 > beforeEach" ),
	afterEach: callback( "module1 > afterEach" ),
	after: callback( "module1 > after" )
}, function() {
	QUnit.test( "test1", function( assert ) {
		console.warn( "TEST: module1 > test1" );
		assert.true( true );
	} );

	QUnit.module( "module2", {
		before: callback( "module2 > before" ),
		beforeEach: callback( "module2 > beforeEach" ),
		afterEach: callback( "module2 > afterEach" ),
		after: callback( "module2 > after" )
	}, function() {
		QUnit.test( "test1", function( assert ) {
			console.warn( "TEST: module2 > test1" );
			assert.true( true );
		} );
	} );

	QUnit.module( "module3", {
		before: callback( "module3 > before" ),
		beforeEach: callback( "module3 > beforeEach" ),
		afterEach: callback( "module3 > afterEach" ),
		after: callback( "module3 > after" )
	}, function() {
		QUnit.test( "test1", function( assert ) {
			console.warn( "TEST: module3 > test1" );
			assert.true( true );
		} );
	} );

	QUnit.test( "test2", function( assert ) {
		console.warn( "TEST: module1 > test2" );
		assert.true( true );
	} );

	QUnit.module( "module4", {
		before: callback( "module4 > before" ),
		beforeEach: callback( "module4 > beforeEach" ),
		afterEach: callback( "module4 > afterEach" ),
		after: callback( "module4 > after" )
	}, function() {
		QUnit.test( "test1", function( assert ) {
			console.warn( "TEST: module4 > test1" );
			assert.true( true );
		} );
	} );
} );
