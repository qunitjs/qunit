import { window, setTimeout } from "./globals";

import equiv from "./equiv";
import dump from "./dump";
import module from "./module";
import Assert from "./assert";
import Test, { test, skip, only, todo, pushFailure } from "./test";
import exportQUnit from "./export";

import config from "./core/config";
import { defined, extend, objectType, is, now } from "./core/utilities";
import { registerLoggingCallbacks, runLoggingCallbacks } from "./core/logging";
import { sourceFromStacktrace } from "./core/stacktrace";
import ProcessingQueue from "./core/processing-queue";

import SuiteReport from "./reports/suite";

import { on, emit } from "./events";
import onError from "./core/onerror";
import onUnhandledRejection from "./core/on-unhandled-rejection";

const QUnit = {};
export const globalSuite = new SuiteReport();

// The initial "currentModule" represents the global (or top-level) module that
// is not explicitly defined by the user, therefore we add the "globalSuite" to
// it since each module has a suiteReport associated with it.
config.currentModule.suiteReport = globalSuite;

var globalStartCalled = false;
var runStarted = false;

// Figure out if we're running the tests from a server or not
QUnit.isLocal = !( defined.document && window.location.protocol !== "file:" );

// Expose the current QUnit version
QUnit.version = "@VERSION";

extend( QUnit, {
	on,

	module,

	test: test,

	todo: todo,

	skip: skip,

	only: only,

	start: function( count ) {
		var globalStartAlreadyCalled = globalStartCalled;

		if ( !config.current ) {
			globalStartCalled = true;

			if ( runStarted ) {
				throw new Error( "Called start() while test already started running" );
			} else if ( globalStartAlreadyCalled || count > 1 ) {
				throw new Error( "Called start() outside of a test context too many times" );
			} else if ( config.autostart ) {
				throw new Error( "Called start() outside of a test context when " +
					"QUnit.config.autostart was true" );
			} else if ( !config.pageLoaded ) {

				// The page isn't completely loaded yet, so we set autostart and then
				// load if we're in Node or wait for the browser's load event.
				config.autostart = true;

				// Starts from Node even if .load was not previously called. We still return
				// early otherwise we'll wind up "beginning" twice.
				if ( !defined.document ) {
					QUnit.load();
				}

				return;
			}
		} else {
			throw new Error( "QUnit.start cannot be called inside a test context." );
		}

		scheduleBegin();
	},

	config: config,

	is: is,

	objectType: objectType,

	extend: extend,

	load: function() {
		config.pageLoaded = true;

		// Initialize the configuration options
		extend( config, {
			stats: { all: 0, bad: 0 },
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
	},

	onError,

	onUnhandledRejection
} );

QUnit.pushFailure = pushFailure;
QUnit.assert = Assert.prototype;
QUnit.equiv = equiv;
QUnit.dump = dump;

registerLoggingCallbacks( QUnit );

function scheduleBegin() {

	runStarted = true;

	// Add a slight delay to allow definition of more modules and tests.
	if ( defined.setTimeout ) {
		setTimeout( function() {
			begin();
		} );
	} else {
		begin();
	}
}

export function begin() {
	var i, l,
		modulesLog = [];

	// If the test run hasn't officially begun yet
	if ( !config.started ) {

		// Record the time of the test run's beginning
		config.started = now();

		// Delete the loose unnamed module if unused.
		if ( config.modules[ 0 ].name === "" && config.modules[ 0 ].tests.length === 0 ) {
			config.modules.shift();
		}

		// Avoid unnecessary information by not logging modules' test environments
		for ( i = 0, l = config.modules.length; i < l; i++ ) {
			modulesLog.push( {
				name: config.modules[ i ].name,
				tests: config.modules[ i ].tests
			} );
		}

		// The test run is officially beginning now
		emit( "runStart", globalSuite.start( true ) );
		runLoggingCallbacks( "begin", {
			totalTests: Test.count,
			modules: modulesLog
		} );
	}

	config.blocking = false;
	ProcessingQueue.advance();
}

exportQUnit( QUnit );

export default QUnit;
