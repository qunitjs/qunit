window.sessionStorage.setItem( "qunit-test-Reorder-Second", 1 );

var lastTest = "";

QUnit.module( "Reorder" );

QUnit.test( "First", function( assert ) {
	assert.strictEqual( lastTest, "Second" );
	lastTest = "First";
} );

QUnit.test( "Second", function( assert ) {
	assert.strictEqual( lastTest, "" );
	lastTest = "Second";
} );
