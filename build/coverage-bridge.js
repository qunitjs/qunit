/* global QUnit, window */

( function( QUnit ) {

	// Send messages to the Node process
	// Using sendMessage similar to 'grunt-contrib-qunit/chrome/bridge.js'
	function sendMessage() {
		window.__grunt_contrib_qunit__.apply( window, [].slice.call( arguments ) );
	}

	QUnit.done( function() {

		// send coverage data if available
		if ( window.__coverage__ ) {
			sendMessage( "qunit.coverage", window.location.pathname, window.__coverage__ );
		}
	} );
}( QUnit ) );
