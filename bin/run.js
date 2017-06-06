"use strict";

const path = require( "path" );

const requireQUnit = require( "./require-qunit" );
const utils = require( "./utils" );

const IGNORED_GLOBS = [
	"**/node_modules/**"
];

let QUnit;

function run( args, options ) {
	let running = true;

	// Default to non-zero exit code to avoid false positives
	process.exitCode = 1;

	process.on( "exit", function() {
		if ( running ) {
			console.error( "Error: Process exited before tests finished running" );

			const currentTest = QUnit.config.current;
			if ( currentTest && currentTest.semaphore ) {
				const name = currentTest.testName;
				console.error( "Last test to run (" + name + ") has an async hold. " +
					"Ensure all assert.async() callbacks are invoked and Promises resolve. " +
					"You should also set a standard timeout via QUnit.config.testTimeout." );
			}
		}
	} );

	const files = utils.getFilesFromArgs( args );

	QUnit = requireQUnit();

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
		running = false;

		if ( data.testCounts.failed ) {
			process.exitCode = 1;
		} else if ( data.testCounts.total === 0 ) {
			console.error( "Error: No tests were run" );
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
