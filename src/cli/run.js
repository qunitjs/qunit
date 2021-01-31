"use strict";

const path = require( "path" );

const requireFromCWD = require( "./require-from-cwd" );
const requireQUnit = require( "./require-qunit" );
const utils = require( "./utils" );

const RESTART_DEBOUNCE_LENGTH = 200;

const changedPendingPurge = [];

let QUnit;

async function run( args, options ) {

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

		// Node.js 12.0.0 has node_module_version=72
		// https://nodejs.org/en/download/releases/
		const nodeVint = process.config.variables.node_module_version;

		try {

			// QUnit supports passing ESM files to the 'qunit' command when used on
			// Node.js 12 or later. The dynamic import() keyword supports both CommonJS files
			// (.js, .cjs) and ESM files (.mjs), so we could simply use that unconditionally on
			// newer Node versions, regardless of the given file path.
			//
			// But:
			// - Node.js 12 emits a confusing "ExperimentalWarning" when using import(),
			//   even if just to load a non-ESM file. So we should try to avoid it on non-ESM.
			// - This Node.js feature is still considered experimental so to avoid unexpected
			//   breakage we should continue using require(). Consider flipping once stable and/or
			//   as part of QUnit 3.0.
			// - Plugins and CLI bootstrap scripts may be hooking into require.extensions to modify
			//   or transform code as it gets loaded. For compatibility with that, we should
			//   support that until at least QUnit 3.0.
			// - File extensions are not sufficient to differentiate between CJS and ESM.
			//   Use of ".mjs" is optional, as a package may configure Node to default to ESM
			//   and optionally use ".cjs" for CJS files.
			//
			// https://nodejs.org/docs/v12.7.0/api/modules.html#modules_addenda_the_mjs_extension
			// https://nodejs.org/docs/v12.7.0/api/esm.html#esm_code_import_code_expressions
			// https://github.com/qunitjs/qunit/issues/1465
			try {
				require( filePath );
			} catch ( e ) {
				if ( e.code === "ERR_REQUIRE_ESM" && ( !nodeVint || nodeVint >= 72 ) ) {
					await import( filePath ); // eslint-disable-line node/no-unsupported-features/es-syntax
				} else {
					throw e;
				}
			}
		} catch ( e ) {

			// eslint-disable-next-line no-loop-func
			QUnit.module( files[ i ], function() {
				const loadFailureMessage = `Failed to load the test file with error:\n${e.stack}`;
				QUnit.test( loadFailureMessage, function( assert ) {
					assert.true( false, "should be able to load file" );
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

		changedPendingPurge.forEach( file => delete require.cache[ path.resolve( file ) ] );
		changedPendingPurge.length = 0;

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
		changedPendingPurge.push( fullpath );
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
