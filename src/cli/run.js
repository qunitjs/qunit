"use strict";

const path = require( "path" );

const requireFromCWD = require( "./require-from-cwd" );
const requireQUnit = require( "./require-qunit" );
const utils = require( "./utils" );

const IGNORED_GLOBS = [
	".git",
	"node_modules"
].concat( utils.getIgnoreList( process.cwd() ) );

const RESTART_DEBOUNCE_LENGTH = 200;

let QUnit;

function run( args, options ) {

	// Default to non-zero exit code to avoid false positives
	process.exitCode = 1;

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

	options.requires.forEach( requireFromCWD );

	options.reporter.init( QUnit );

	for ( let i = 0; i < files.length; i++ ) {
		const filePath = path.resolve( process.cwd(), files[ i ] );
		delete require.cache[ filePath ];

		try {
			require( filePath );
		} catch ( e ) {

			// eslint-disable-next-line no-loop-func
			QUnit.module( files[ i ], function() {
				const loadFailureMessage = `Failed to load the test file with error:\n${e.stack}`;
				QUnit.test( loadFailureMessage, function( assert ) {
					assert.ok( false, "should be able to load file" );
				} );
			} );
		}
	}

	let running = true;

	// Listen for unhandled rejections, and call QUnit.onUnhandledRejection
	process.on( "unhandledRejection", function( reason ) {
		QUnit.onUnhandledRejection( reason );
	} );

	process.on( "uncaughtException", function( error ) {
		QUnit.onError( error );
	} );

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

	QUnit.start();

	QUnit.on( "runEnd", function setExitCode( data ) {
		running = false;

		if ( data.testCounts.failed ) {
			process.exitCode = 1;
		} else {
			process.exitCode = 0;
		}
	} );
}

run.restart = function( args ) {
	clearTimeout( this._restartDebounceTimer );

	this._restartDebounceTimer = setTimeout( () => {

		const watchedFiles = utils.findFiles( process.cwd(), {
			match: [ "**/*.js" ],
			ignore: IGNORED_GLOBS
		} );

		watchedFiles.forEach( file => delete require.cache[ path.resolve( file ) ] );

		if ( QUnit.config.queue.length ) {
			console.log( "Finishing current test and restarting..." );
		} else {
			console.log( "Restarting..." );
		}

		run.abort( () => run.apply( null, args ) );
	}, RESTART_DEBOUNCE_LENGTH );
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

run.watch = function watch() {
	const watch = require( "node-watch" );
	const args = Array.prototype.slice.call( arguments );
	const baseDir = process.cwd();

	const watcher = watch( baseDir, {
		persistent: true,
		recursive: true,
		delay: 0,
		filter: ( fullpath ) => {
			return !/\/node_modules\//.test( fullpath ) &&
				/\.js$/.test( fullpath );
		}
	}, ( event, fullpath ) => {
		console.log( `File ${event}: ${path.relative( baseDir, fullpath )}` );
		run.restart( args );
	} );

	watcher.on( "ready", () => {
		run.apply( null, args );
	} );

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
