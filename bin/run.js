"use strict";

const path = require( "path" );

const utils = require( "./utils" );

const IGNORED_GLOBS = [
	"**/node_modules/**"
];

let QUnit;

function run( args, options ) {
	const files = utils.getFilesFromArgs( args );

	// During development, QUnit is built into "dist/", but when published to npm
	// we move it to "qunit/". This IIFE handles both cases.
	QUnit = ( function requireQUnit() {
		try {
			delete require.cache[ require.resolve( "../qunit/qunit" ) ];
			return require( "../qunit/qunit" );
		} catch ( e ) {
			if ( e.code === "MODULE_NOT_FOUND" ) {
				delete require.cache[ require.resolve( "../dist/qunit" ) ];
				return require( "../dist/qunit" );
			}
			throw e;
		}
	}() );

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

	options.reporter.init( QUnit );

	for ( let i = 0; i < files.length; i++ ) {
		const filePath = path.resolve( process.cwd(), files[ i ] );
		delete require.cache[ filePath ];
		require( filePath );
	}

	QUnit.start();

	QUnit.on( "runEnd", function setExitCode( data ) {
		if ( data.testCounts.failed ) {
			process.exitCode = 1;
		} else {
			process.exitCode = 0;
		}
	} );
};

run.restart = function( args ) {
	if ( QUnit.config.queue.length ) {
		console.log( "Finishing current test and restarting..." );
	} else {
		console.log( "Restarting..." );
	}

	run.abort( () => run.apply( null, args ) );
};

run.abort = function( callback ) {
	function clearQUnit() {
		delete global.QUnit;
		QUnit = null;
		if ( callback ) {
			callback();
		}
	}

	if ( QUnit.config.queue.length ) {
		const nextTestIndex = QUnit.config.queue.findIndex( fn => fn.name === "runTest" );
		QUnit.config.queue.splice( nextTestIndex );
		QUnit.on( "runEnd", clearQUnit );
	} else {
		clearQUnit();
	}
};

function watcherEvent( event, args ) {
	return ( file ) => {
		console.log( `File ${event}: ${file}` );
		run.restart( args );
	};
}

run.watch = function watch() {
	const chokidar = require( "chokidar" );
	const args = Array.prototype.slice.call( arguments );

	const watcher = chokidar.watch( "**/*.js", {
		ignored: IGNORED_GLOBS,
		ignoreInitial: true
	} );

	watcher.on( "ready", () => run.apply( null, args ) );
	watcher.on( "change", watcherEvent( "changed", args ) );
	watcher.on( "add", watcherEvent( "added", args ) );
	watcher.on( "unlink", watcherEvent( "removed", args ) );

	function stop() {
		console.log( "Stopping QUnit..." );

		watcher.close();
		run.abort( () => {
			process.exit();
		} );
	}

	process.on( "SIGTERM", stop );
	process.on( "SIGINT", stop );
};

module.exports = run;
