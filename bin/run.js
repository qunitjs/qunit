"use strict";

const path = require( "path" );
const TapReporter = require( "js-reporters" ).TapReporter;

// During development, QUnit is built into "dist/", but when published to npm
// we move it to "qunit/". This IIFE handles both cases.
const QUnit = ( function requireQUnit() {
	try {
		return require( "../qunit/qunit" );
	} catch ( e ) {
		if ( e.code === "MODULE_NOT_FOUND" ) {
			return require( "../dist/qunit" );
		}

		throw e;
	}
}() );

module.exports = function run( files, options ) {
	if ( options.filter ) {
		QUnit.config.filter = options.filter;
	}

	const seed = options.seed;
	if ( seed ) {
		if ( seed === true ) {
			QUnit.config.seed = Math.random().toString( 36 ).slice( 2 );
		} else {
			QUnit.config.seed = seed;
		}

		console.log( `Running tests with seed: ${QUnit.config.seed}` );
	}

	// TODO: Enable mode where QUnit is not auto-injected, but other setup is
	// still done automatically.
	global.QUnit = QUnit;

	// TODO: Reporter should be customizable
	TapReporter.init( QUnit );

	for ( let i = 0; i < files.length; i++ ) {
		const filePath = path.resolve( process.cwd(), files[ i ] );
		require( filePath );
	}

	QUnit.start();

	QUnit.on( "runEnd", function setExitCode( data ) {
		if ( data.testCounts.failed ) {
			process.exitCode = 1;
		}
	} );
};
