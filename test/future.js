QUnit.config.reorder = false;

QUnit.module( "the future" );

QUnit.assert.async = QUnit.stop;
QUnit.assert.done = QUnit.start;

function catchAll() {
	QUnit.test( "catchAll test, no assertions in here", function( assert ) {
		assert.expect( 0 );
		// replacing QUnit.stop();
		assert.async();
		setTimeout(function() {
			// replaceing QUnit.start();
			assert.done();
		}, 100 );
	});
}

// no async/done here, but any async test that executes assertions
// after calling start/done will have the same issue
QUnit.test( "#1 - ok test with one assertion", function( assert ) {
	assert.expect( 1 );
	setTimeout(function() {
		assert.ok( true, "this belongs to test #1" );
	});
});

catchAll();

QUnit.test( "#2 - bad test with one failing assertion", function( assert ) {
	assert.expect( 1 );
	setTimeout(function() {
		assert.ok( false, "this belongs to test #2" );
	});
});

catchAll();
