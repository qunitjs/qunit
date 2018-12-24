QUnit.module( "Error with mocked console", function( hooks ) {
	var orgLog, orgError;

	// Stub
	hooks.before( function() {
		orgLog = console.log;
		orgError = console.error;
		console.log = console.error = function() {};
	} );

	// Restore
	hooks.after( function() {
		console.log = orgLog;
		console.error = orgError;
	} );

	QUnit.test( "bad", function( assert ) {
		assert.ok( this.aint() );
	} );

	QUnit.test( "good", function( assert ) {
		assert.ok( 1 );
	} );
} );
