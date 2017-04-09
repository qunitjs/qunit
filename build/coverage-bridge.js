/* global QUnit, window */

( function( QUnit ) {

  // Send messages to the parent PhantomJS process via alert! Good times!!
	function sendMessage() {
		var args = [].slice.call( arguments );
		window.alert( JSON.stringify( args ) );
	}

	QUnit.done( function() {

    // send coverage data if available
		if ( window.__coverage__ ) {
			sendMessage( "qunit.coverage", window.location.pathname, window.__coverage__ );
		}
	} );
}( QUnit ) );
