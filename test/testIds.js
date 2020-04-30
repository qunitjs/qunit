QUnit.module( "QUnit.config.testIds" );

QUnit.test( "testIds should return all testIds", function( assert ) {
	assert.deepEqual( QUnit.config.testIds, [ "01e80961", "3b1922df" ], "this is the test with id 01e80961" );
} );

// This test is to prove identical test name is being hashed differently
QUnit.test( "testIds should return all testIds", function( assert ) {
	assert.deepEqual( QUnit.config.testIds, [ "01e80961", "3b1922df" ], "this is the test with id 3b1922df" );
} );
