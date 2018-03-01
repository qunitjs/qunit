window.sessionStorage.setItem( "qunit-test-Reorder-Second", 1 );
window.sessionStorage.setItem( "qunit-test-Reorder-Third", 1 );

var lastTest = "";

QUnit.module( "Reorder" );

QUnit.test( "First", function( assert ) {
	assert.strictEqual( lastTest, "Third" );
	lastTest = "First";
} );

QUnit.test( "Second", function( assert ) {
	assert.strictEqual( lastTest, "" );
	lastTest = "Second";

	// This test is "high priority" so it should execute before test "First"
	// even though it is added to the queue late
	QUnit.config.reorder = true; // For some reason PhantomJS mutates config.reorder
	QUnit.test( "Third", function( assert ) {
		assert.strictEqual( lastTest, "Second" );
		lastTest = "Third";
	} );
} );
