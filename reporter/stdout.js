/*jshint node:true*/
module.exports = function( QUnit, options ) {
	var chalk = require( "chalk" );
	var testActive = false,
		runDone = false;
	var log = {
			write: function( text ) {
				process.stdout.write( text );
			},
			error: function( text ) {
				process.stderr.write( chalk.red( text ) );
			},
			ok: function( text ) {
				process.stdout.write( chalk.green( text ) );
			}
		};

	QUnit.config.autorun = false;

	options = options || {};

	QUnit.moduleStart(function( details ) {
		if ( options.output === "minimal" ) {
			return;
		}

		log.write( chalk.bold( details.name + "\n" ) );
	});

	QUnit.testStart(function( details ) {
		var message;

		testActive = true;

		if ( options.output === "minimal" ) {
			return;
		}

		message = "  " + details.name + " ";

		log.write( message );
	});

	QUnit.log(function( details ) {
		if ( !testActive ) {
			return;
		}

		if ( !details.result ) {
			log.error( chalk.bold( "\n    FAILED! " ) );

			if ( options.output === "minimal" ) {
				log.error( "\n    Module: " + details.module );
				log.error( "\n    Test: " + details.name );
				log.error( "\n    Assertion: " + details.message );
			} else {
				log.error( details.message );
			}

			log.write( chalk.bold( "\n    Actual: " ) + details.actual );
			log.write( chalk.bold( "\n    Expected: " ) + details.expected );

			if ( details.source ) {
				log.write( "\n  " + details.source );
			}

			log.write( "\n" );
		} else if ( options.output === "verbose" ) {
			log.ok( "\n    " + ( details.message || "\u2605" ) );
			log.write( " " + details.runtime + "ms" );
		} else {
			log.ok( "." );
		}
	});

	QUnit.testDone(function() {
		testActive = false;

		if ( options.output !== "minimal" ) {
			log.write( "\n" );
		}
	});

	QUnit.done(function( details ) {
		if ( runDone ) {
			return;
		}
		var succeeded = ( details.failed === 0 ),
			message = details.total + " assertions in " + details.runtime + "ms, passed: " +
				details.passed + ", failed: " + details.failed;

		log.write( "\n" );

		if ( succeeded ) {
			log.ok( message );
		} else {
			log.error( message );
		}

		log.write( "\n\n" );
	});
};
