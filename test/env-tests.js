/* jshint node:true */
/* global define:true */
;( function() {

	var root = typeof global === "object" && global || this,
		load = ( typeof require === "function" && !( root.define && define.amd ) ) ?
			require :
			( !root.document && root.java && root.load ) ||
			function() { throw Error( "Unable to load module" ); },
		log = typeof root.print === "function" && root.print || root.console.log,
		process = root.phantom || root.process,
		java = root.java,
		testActive = false,
		QUnit = load( "../dist/qunit.js" );

	QUnit = root.QUnit = ( QUnit ? QUnit.QUnit : root.QUnit );

	QUnit.testStart( function() {
		testActive = true;
	});
	QUnit.log( function( details ) {
		if ( !testActive || details.result ) {
			return;
		}
		var message = "name: " + details.name + " module: " + details.module +
			" message: " + details.message;
		log( message );
	});
	QUnit.testDone( function() {
		testActive = false;
	});
	QUnit.done( function( details ) {
		var succeeded = ( details.failed === 0 ),
			message = details.total + " assertions in (" + details.runtime + "ms), passed: " +
				details.passed + ", failed: " + details.failed;
		if ( succeeded ) {
			log( "Passed: " + message );
		} else {
			log( "Failed: " + message );
		}

		// exit out of Node.js or PhantomJS
		try {
			process.exit( succeeded ? 0 : 1 );
		} catch ( e ) { }

		// exit out of Rhino, or RingoJS
		try {
			if ( succeeded ) {
				root.quit();
			} else {
				java.lang.System.exit( 1 );
			}
		} catch ( e ) { }
	});
	QUnit.config.autorun = false;

	load( "./logs.js" );
	load( "./test.js" );
	load( "./deepEqual.js" );
	load( "./globals.js" );

	QUnit.load();

}() );
