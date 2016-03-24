(function() {

function reporter( rep ) {
	if ( rep === "tap" ) {
		tapReporter();
	}
};

reporter.print = function( val ) {
	console.log( val );
};

QUnit.reporter = reporter;

function tapReporter() {
	var testCount = 0;
	var failed = 0;

	QUnit.begin( function() {
		QUnit.reporter.print( "TAP version 13" );
	} );

	QUnit.done( function( details ) {
		var output = [
			"",
			"1.." + testCount,
			"# tests " + testCount,
			"# pass " + ( testCount - failed )
		];

		QUnit.reporter.print( output.join( "\n" ) );
	} );

	QUnit.moduleStart( function( details ) {
		QUnit.reporter.print( "# module: " + details.name );
	} );

	QUnit.testDone( function( details ) {
		var assertion;
		var failedMessage;
		var output;
		var i = 0;

		testCount++;

		output = "ok " + testCount + " - ";

		if ( details.skipped ) {
			output += "# SKIP " + details.name;
		} else if ( details.failed == 0 ) {
			output += details.name;
		} else {
			failed++;
			output = "not " + output + details.name;

			for ( i = 0; i < details.assertions.length; i++ ) {
				assertion = details.assertions[ i ];
				if ( assertion.result ) {
					continue;
				}
				failedMessage = [
					"",
					"  ---",
					"  message: '" + assertion.message + "'",
					"  severity: fail",
					"  ..."
				];

				output += failedMessage.join( "\n" );
			}
		}

		QUnit.reporter.print( output );
	} );
};

})();
