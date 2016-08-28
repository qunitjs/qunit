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

	runEnd++;

	testAutorun = false;

	setTimeout( function() {
		QUnit.test( "last test", function( assert ) {
			assert.equal( runStart, 1, "runStart should be emitted only once" );
			assert.equal( suiteStart, 0, "emitted suiteStart events" );
			assert.equal( testStart, 2, "emitted testStart events" );
			assert.equal( testEnd, 1, "emitted testEnd events" );
			assert.equal( suiteEnd, 0, "emitted suiteEnd events" );
			assert.equal( runEnd, 1, "runEnd should have been emitted" );
		} );
	}, 5000 );
} );

QUnit.test( "global test", function( assert ) {
	assert.equal( runStart, 1, "runStart should have been emitted" );
	assert.equal( suiteStart, 0, "suiteStart should not be emitted" );
	assert.equal( testStart, 1, "testStart should be emitted" );
	assert.equal( testEnd, 0, "testEnd should have been not emitted" );
	assert.equal( suiteEnd, 0, "suiteEnd should not be emitted" );
	assert.equal( runEnd, 0, "runEnd should have been not emitted" );
} );
