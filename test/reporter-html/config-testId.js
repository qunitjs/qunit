QUnit.config.testId = [ "2e48c6fa", "9ccf6855" ];

QUnit.test( "Check for changed header after running filtered test", function( assert ) {
	var html = document.getElementById( "qunit-filteredTest" ).innerHTML;
	var result = /Rerunning selected tests: 2e48c6fa, 9ccf6855/.test( html );
	assert.true( result );
} );

QUnit.test( "Check for link to clear filter", function( assert ) {
	var html = document.getElementById( "qunit-clearFilter" ).innerHTML;
	assert.strictEqual( html, "Run all tests" );
} );
