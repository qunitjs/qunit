QUnit.config.filter = "!foo|bar";

var totalTests, totalTestsToRun;

QUnit.begin( function( data ) {
	totalTests = data.totalTests;
	totalTestsToRun = data.totalTestsToRun;
} );

QUnit.module( "QUnit.config.filter" );

QUnit.test( "ensure totalTests and totalTestsToRun are correct", function( assert ) {
	assert.equal( totalTests, 4, "totalTests should have been 4" );
	assert.equal( totalTestsToRun, 3, "totalTestsToRun should have been 3" );
} );

QUnit.test( "foo test should be run", function( assert ) {
	assert.ok( true, "foo test should be run" );
} );

QUnit.test( "bar test should be run", function( assert ) {
	assert.ok( true, "bar test should be run" );
} );

QUnit.test( "foo|bar test should not be run", function( assert ) {
	assert.ok( false, "baz test should not be run" );
} );
