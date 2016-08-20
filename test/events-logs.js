var testAutorun = true;
var runStart = 0,
	suiteStart = 0,
	testStart = 0,
	testEnd = 0,
	suiteEnd = 0,
	runEnd = 0;

QUnit.on( "runStart", function() {
	runStart++;
} );

QUnit.on( "suiteStart", function() {
	suiteStart++;
} );

QUnit.on( "testStart", function() {
	testStart++;
} );

QUnit.on( "testEnd", function() {
	testEnd++;
} );

QUnit.on( "suiteEnd", function() {
	suiteEnd++;
} );

QUnit.on( "runEnd", function() {
	if ( !testAutorun ) {
		return;
	}

	testAutorun = false;

	runEnd++;

	setTimeout( function() {
		QUnit.test( "test5", function( assert ) {
			assert.equal( runStart, 1, "runStart should be emitted only once" );
			assert.equal( suiteStart, 4, "emitted suiteStart events" );
			assert.equal( testStart, 5, "emitted testStart events" );
			assert.equal( testEnd, 4, "emitted testEnd events" );
			assert.equal( suiteEnd, 4, "emitted suiteEnd events" );
			assert.equal( runEnd, 1, "runEnd should have been emitted" );
		} );

		QUnit.test( "test6", function( assert ) {
			assert.equal( runStart, 1, "runStart should be emitted only once" );
			assert.equal( suiteStart, 4, "emitted suiteStart events" );
			assert.equal( testStart, 6, "emitted testStart events" );
			assert.equal( testEnd, 5, "emitted testEnd events" );
			assert.equal( suiteEnd, 4, "emitted suiteEnd events" );
			assert.equal( runEnd, 1, "runEnd should have been emitted" );
		} );
	}, 5000 );
} );

QUnit.module( "module1", function() {
	QUnit.test( "test1", function( assert ) {
		assert.equal( runStart, 1, "runStart should have been emitted" );
		assert.equal( suiteStart, 1, "emitted suiteStart events" );
		assert.equal( testStart, 1, "emitted testStart events" );
		assert.equal( testEnd, 0, "emitted testEnd events" );
		assert.equal( suiteEnd, 0, "emitted suiteEnd events" );
		assert.equal( runEnd, 0, "runEnd should have been not emitted" );
	} );
} );

QUnit.module( "module2", function() {
	QUnit.test( "test2", function( assert ) {
		assert.equal( runStart, 1, "runStart should be emitted only once" );
		assert.equal( suiteStart, 2, "emitted suiteStart events" );
		assert.equal( testStart, 2, "emitted testStart events" );
		assert.equal( testEnd, 1, "emitted testEnd events" );
		assert.equal( suiteEnd, 1, "emitted suiteEnd events" );
		assert.equal( runEnd, 0, "runEnd should have been not emitted" );
	} );
} );

QUnit.module( "parent module", function() {
	QUnit.module( "child module", function() {
		QUnit.test( "test3", function( assert ) {
			assert.equal( runStart, 1, "runStart should be emitted only once" );
			assert.equal( suiteStart, 4, "emitted suiteStart events" );
			assert.equal( testStart, 3, "emitted testStart events" );
			assert.equal( testEnd, 2, "emitted testEnd events" );
			assert.equal( suiteEnd, 2, "emitted suiteEnd events" );
			assert.equal( runEnd, 0, "runEnd should have been not emitted" );
		} );
	} );

	QUnit.test( "test4", function( assert ) {
		assert.equal( runStart, 1, "runStart should be emitted only once" );
		assert.equal( suiteStart, 4, "emitted suiteStart events" );
		assert.equal( testStart, 4, "emitted testStart events" );
		assert.equal( testEnd, 3, "emitted testEnd events" );
		assert.equal( suiteEnd, 3, "emitted suiteEnd events" );
		assert.equal( runEnd, 0, "runEnd should have been not emitted" );
	} );
} );
