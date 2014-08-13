QUnit.console = function( verbose ) {
/*globals console, process */

var reporter = {
		log: function( text, newLine ) {
			if ( typeof process !== "undefined" && process.stdout && !newLine ) {
				process.stdout.write( text );
			} else {
				console.log( text );
			}
		},
		error: function( text ) {
			console.error( text );
		}
	},
	assertionCount = 0,
	failed = [];

// Prevent loading if console is not present
if ( !console || typeof console.log !== "function" ) {
	return;
}

// Prevent reloading
if ( QUnit.config.console ) {
	return;
}
QUnit.config.console = false;

QUnit.testStart(function( details ) {
	var message = "# ";

	if ( !verbose ) {
		return;
	}

	message += details.module ? details.module + " - " : "";
	reporter.log( message + details.name + " " );
});

QUnit.log(function( details ) {
	var expected, actual,
		message = "  - " + ( details.message ? details.message : "(annonymous assertion)" );

	assertionCount++;

	if ( !details.result ) {

		// Logs the test name when fails in non verbose method
		if ( !verbose ) {
			message =
				"\nFailed at \n" +
				( details.module ? "Module: " + details.module + "\n" : "" ) +
				"Test: " + details.name +
				message;
		}

		if ( details.hasOwnProperty( "expected" ) ) {
			expected = QUnit.dump.parse( details.expected );
			actual = QUnit.dump.parse( details.actual );

			// Weird, but this fixes dumped objects into reporter indentation
			expected = expected.replace( /\r|\n/g, "\n              " );
			actual = actual.replace( /\r|\n/g, "\n              " );

			message += [
					"",
					"    expected: " + expected,
					"    actual  : " + actual
				].join( "\n" );
		}

		reporter.error( message );
		failed.push( assertionCount );
	} else {
		reporter.log( "." );
	}
});

function getPerc( details ) {
	var perc = ( details.passed * 100 ) / details.total;

	perc = perc.toFixed( 2 ).replace( /\.00$/, "" );
	perc = isNaN( perc ) ? "100" : perc;

	return perc + "%";
}

QUnit.testDone(function( details ) {
	var perc, message;

	if ( verbose ) {
		perc = getPerc( details );

		message = "\n  " +
			details.passed + " from " + details.total +
			" assertions passed (" + perc + ") in " + details.runtime + "ms";

		reporter.log( message, true);
	}
});

QUnit.done(function( details ) {
	var message,
		perc = getPerc( details ) + " okay";

	if ( details.failed ) {
		reporter.error(
			"\nFAILED " + details.failed + " from " + details.total +
			" assertions (" + perc + ") in " + details.runtime + "ms" );
	} else {
		if ( !verbose ) {
			reporter.log( "OK", true );
		}
		message = "\n" + details.total +
			" assertions passed (" + perc + ") in " + details.runtime + "ms";
		reporter.log( message, true );
	}
});

// Expose log methods so they can be hacked like using log colors
return reporter;

};
