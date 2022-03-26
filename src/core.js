import { window, document, setTimeout, performance } from "./globals";

import equiv from "./equiv";
import dump from "./dump";
import { runSuite, module } from "./module";
import Assert from "./assert";
import Logger from "./logger";
import Test, { test, pushFailure } from "./test";
import exportQUnit from "./export";
import reporters from "./reporters";

import config from "./core/config";
import { hooks } from "./core/hooks";
import { extend, objectType, is, now } from "./core/utilities";
import { registerLoggingCallbacks, runLoggingCallbacks } from "./core/logging";
import { sourceFromStacktrace } from "./core/stacktrace";
import ProcessingQueue from "./core/processing-queue";

import { on, emit } from "./events";
import onWindowError from "./core/onerror";
import onUncaughtException from "./core/on-uncaught-exception";
import WorkerFactory from "./workers/worker-factory.js";
import IframeWorker from "./workers/iframe-worker.mjs";
import WebWorker from "./workers/web-worker.mjs";

WorkerFactory.registerWorkerClass( IframeWorker );
WorkerFactory.registerWorkerClass( WebWorker );
const configFilters = [ "filter", "testId", "moduleId", "module" ];

const getFilter = ( qunitConfig ) => configFilters.reduce( function( acc, key ) {
	if ( Object.hasOwnProperty.call( qunitConfig, key ) ) {
		const value = qunitConfig[ key ];

		if ( Array.isArray( value ) && value.length ) {
			acc = acc || {};
			acc[ key ] = value;
		} else if ( typeof value === "string" && value ) {
			acc = acc || {};
			acc[ key ] = value;
		}
	}

	return acc;
}, null );

const QUnit = {};

// The "currentModule" object would ideally be defined using the createModule()
// function. Since it isn't, add the missing suiteReport property to it now that
// we have loaded all source code required to do so.
//
// TODO: Consider defining currentModule in core.js or module.js in its entirely
// rather than partly in config.js and partly here.
config.currentModule.suiteReport = runSuite;

let globalStartCalled = false;
let runStarted = false;

// Figure out if we're running the tests from a server or not
QUnit.isLocal = ( window && window.location && window.location.protocol === "file:" );

// Expose the current QUnit version
QUnit.version = "@VERSION";

const getChannelReportListener = function( startTimeMs, doneCount, completeCallback ) {
	const done = {};
	const runEnd = {};
	const counts = {};

	return function( e ) {
		const { type, key } = e.data;
		let { details } = e.data;

		counts[ type ] = counts[ type ] || {};
		counts[ type ][ key ] = counts[ type ][ key ] || 0;
		counts[ type ][ key ]++;

		// only use the first being/runStart
		if ( ( key === "begin" || key === "runStart" ) && counts[ type ][ key ] >= 2 ) {
			return;
		}

		if ( key === "done" || key === "runEnd" ) {
			if ( key === "done" ) {
				Object.keys( details ).forEach( function( k ) {
					done[ k ] = done[ k ] || 0;
					done[ k ] += details[ k ];
				} );

				details = done;
			} else {
				const stats = e.data.stats;

				Object.keys( stats ).forEach( function( key ) {
					QUnit.config.stats[ key ] += stats[ key ];
				} );

				if ( Object.keys( runEnd ).length === 0 ) {
					Object.keys( details ).forEach( function( k ) {
						runEnd[ k ] = details[ k ];
					} );

					runEnd.childSuites = new Array( details.childSuites.length );
					runEnd.testCounts = {};
				}
				runEnd.runtime = performance.now() - startTimeMs;

				Object.keys( details.testCounts ).forEach( function( k ) {
					runEnd.testCounts[ k ] = runEnd.testCounts[ k ] || 0;
					runEnd.testCounts[ k ] += details.testCounts[ k ];
				} );

				if ( details.status !== "passed" ) {
					runEnd.status = details.status;
				}

				details.childSuites.forEach( ( suite, i ) => {
					if ( !isNaN( suite.runtime ) ) {
						runEnd.childSuites[ i ] = suite;
					}
				} );

				details = runEnd;
			}

			// wait for the last done and runEnd
			if ( counts[ type ][ key ] !== doneCount ) {
				return;
			}
		}

		if ( type === "qunit-event" ) {
			runLoggingCallbacks( key, details );
		} else {
			emit( key, details );
		}

		if ( key === "done" ) {
			completeCallback();
		}
	};
};

const startWorkers = function( maxThreads, className, files ) {
	const startTimeMs = performance.now();
	const factory = new WorkerFactory( {
		maxThreads,
		className,
		files
	} );

	factory.createWorker().then( function(worker) {
		return worker.task( {
			type: "get-info",
			filter: getFilter( QUnit.config )
		} );
	} ).then( ( {testIds, modules} ) => {
		QUnit.config.modules = modules;

		const maxWorkersToCreate = maxThreads;
		// we already created one worker for getting testIds
		// so subtract that.
		const workersToCreate = (testIds.length > maxWorkersToCreate ?
			maxWorkersToCreate : testIds.length) - 1;

		if (workersToCreate > 0) {
			return factory.createWorkers(workersToCreate)
				.then(() => Promise.resolve(testIds));
		} else {
			return Promise.resolve(testIds);
		}

	}).then((testIds) => new Promise( (resolve /* reject */ ) => {

		for ( let i = 0; i < testIds.length; i++ ) {
			const testId = testIds[ i ];
			const wIndex = i % factory.workers.length;

			factory.workers[ wIndex ].send( { type: "testId", testId } );
		}

		if ( !testIds.length ) {
			// will cause failOnZeroTests if option is set.
			ProcessingQueue.advance();
			resolve();
		} else {
			const channelReportListener = getChannelReportListener(
				startTimeMs,
				factory.workers.length,
				resolve
			);

			for ( let i = 0; i < factory.workers.length; i++ ) {
				factory.workers[ i ].listen( channelReportListener );
				factory.workers[ i ].send( { type: "start" } );
			}
		}
	} ) ).then( function() {
		factory.dispose();
	} );
};

extend( QUnit, {
	config,
	WorkerFactory,
	dump,
	equiv,
	reporters,
	hooks,
	is,
	objectType,
	on,
	onError: onWindowError,
	onUncaughtException,
	pushFailure,

	assert: Assert.prototype,
	module,
	test,

	// alias other test flavors for easy access
	todo: test.todo,
	skip: test.skip,
	only: test.only,

	start: function( count ) {
		if ( !QUnit.config.isWorker ) {
			if ( QUnit.parseUrlParams ) {
				QUnit.parseUrlParams();
			}
			const maxThreads = QUnit.config.maxThreads ?
				parseFloat( QUnit.config.maxThreads ) :
				(window.navigator && window.navigator.hardwareConcurrency);
			const workerType = QUnit.config.workerType ?
				QUnit.config.workerType :
				WorkerFactory.workerClasses[ 0 ].name;

			if (!WorkerFactory.workerClasses.some((c) => c.name === workerType)) {
				throw new Error( "QUnit.config.workerType must be a valid worker" +
				`class name: ${WorkerFactory.workerClasses.map((c) => c.name).join(', ')}` );
			}

			if ( typeof maxThreads !== 'number' || maxThreads <= 0 ) {
				throw new Error( "QUnit.config.workerThreads must be a number " +
				"greater than or equal to zero" )
			}

			QUnit.config.queue.length = 0;
			startWorkers( maxThreads, workerType, QUnit.config.files );
			return;
		}

		if ( config.current ) {
			throw new Error( "QUnit.start cannot be called inside a test context." );
		}

		const globalStartAlreadyCalled = globalStartCalled;
		globalStartCalled = true;

		if ( runStarted ) {
			throw new Error( "Called start() while test already started running" );
		}
		if ( globalStartAlreadyCalled || count > 1 ) {
			throw new Error( "Called start() outside of a test context too many times" );
		}
		if ( config.autostart ) {
			throw new Error( "Called start() outside of a test context when " +
				"QUnit.config.autostart was true" );
		}

		if ( !config.pageLoaded ) {

			// The page isn't completely loaded yet, so we set autostart and then
			// load if we're in Node or wait for the browser's load event.
			config.autostart = true;

			// Starts from Node even if .load was not previously called. We still return
			// early otherwise we'll wind up "beginning" twice.
			if ( !document ) {
				QUnit.load();
			}

			return;
		}

		scheduleBegin();

	},

	onUnhandledRejection: function( reason ) {
		Logger.warn( "QUnit.onUnhandledRejection is deprecated and will be removed in QUnit 3.0." +
			" Please use QUnit.onUncaughtException instead." );
		onUncaughtException( reason );
	},

	extend: function( ...args ) {
		Logger.warn( "QUnit.extend is deprecated and will be removed in QUnit 3.0." +
			" Please use Object.assign instead." );

		// delegate to utility implementation, which does not warn and can be used elsewhere internally
		return extend.apply( this, args );
	},

	load: function() {
		config.pageLoaded = true;

		// Initialize the configuration options
		extend( config, {
			started: 0,
			updateRate: 1000,
			autostart: true,
			filter: ""
		}, true );

		if ( !runStarted ) {
			config.blocking = false;

			if ( config.autostart ) {
				scheduleBegin();
			}
		}
	},

	stack: function( offset ) {
		offset = ( offset || 0 ) + 2;
		return sourceFromStacktrace( offset );
	}
} );

registerLoggingCallbacks( QUnit );

function scheduleBegin() {

	runStarted = true;

	// Add a slight delay to allow definition of more modules and tests.
	if ( setTimeout ) {
		setTimeout( function() {
			begin();
		} );
	} else {
		begin();
	}
}

function unblockAndAdvanceQueue() {
	config.blocking = false;
	ProcessingQueue.advance();
}

export function begin() {

	if ( config.started ) {
		unblockAndAdvanceQueue();
		return;
	}

	// The test run hasn't officially begun yet
	// Record the time of the test run's beginning
	config.started = now();

	// Delete the loose unnamed module if unused.
	if ( config.modules[ 0 ].name === "" && config.modules[ 0 ].tests.length === 0 ) {
		config.modules.shift();
	}

	// Avoid unnecessary information by not logging modules' test environments
	const l = config.modules.length;
	const modulesLog = [];
	for ( let i = 0; i < l; i++ ) {
		modulesLog.push( {
			name: config.modules[ i ].name,
			tests: config.modules[ i ].tests
		} );
	}

	// The test run is officially beginning now
	emit( "runStart", runSuite.start( true ) );
	runLoggingCallbacks( "begin", {
		totalTests: Test.count,
		modules: modulesLog
	} ).then( unblockAndAdvanceQueue );
}

exportQUnit( QUnit );

export default QUnit;
