import global from "global";

import { begin } from "./core";
import { setTimeout, clearTimeout } from "./globals";
import { emit } from "./events";
import Assert from "./assert";

import config from "./core/config";
import {
	defined,
	diff,
	extend,
	generateHash,
	hasOwn,
	inArray,
	now,
	objectType
} from "./core/utilities";
import { runLoggingCallbacks } from "./core/logging";
import { extractStacktrace, sourceFromStacktrace } from "./core/stacktrace";
import ProcessingQueue from "./core/processing-queue";

import TestReport from "./reports/test";

let focused = false;

export default function Test( settings ) {
	var i, l;

	++Test.count;

	this.expected = null;
	this.assertions = [];
	this.semaphore = 0;
	this.module = config.currentModule;
	this.stack = sourceFromStacktrace( 3 );
	this.steps = [];
	this.timeout = undefined;

	// If a module is skipped, all its tests and the tests of the child suites
	// should be treated as skipped even if they are defined as `only` or `todo`.
	// As for `todo` module, all its tests will be treated as `todo` except for
	// tests defined as `skip` which will be left intact.
	//
	// So, if a test is defined as `todo` and is inside a skipped module, we should
	// then treat that test as if was defined as `skip`.
	if ( this.module.skip ) {
		settings.skip = true;
		settings.todo = false;

	// Skipped tests should be left intact
	} else	if ( this.module.todo  && !settings.skip ) {
		settings.todo = true;
	}

	extend( this, settings );

	this.testReport = new TestReport( settings.testName, this.module.suiteReport, {
		todo: settings.todo,
		skip: settings.skip,
		valid: this.valid()
	} );

	// Register unique strings
	for ( i = 0, l = this.module.tests; i < l.length; i++ ) {
		if ( this.module.tests[ i ].name === this.testName ) {
			this.testName += " ";
		}
	}

	this.testId = generateHash( this.module.name, this.testName );

	this.module.tests.push( {
		name: this.testName,
		testId: this.testId,
		skip: !!settings.skip
	} );

	if ( settings.skip ) {

		// Skipped tests will fully ignore any sent callback
		this.callback = function() {};
		this.async = false;
		this.expected = 0;
	} else {
		this.assert = new Assert( this );
	}
}

Test.count = 0;

function getNotStartedModules( startModule ) {
	var module = startModule,
		modules = [];

	while ( module && module.testsRun === 0 ) {
		modules.push( module );
		module = module.parentModule;
	}

	return modules;
}

Test.prototype = {
	before: function() {
		var i, startModule,
			module = this.module,
			notStartedModules = getNotStartedModules( module );

		for ( i = notStartedModules.length - 1; i >= 0; i-- ) {
			startModule = notStartedModules[ i ];
			startModule.stats = { all: 0, bad: 0, started: now() };
			emit( "suiteStart", startModule.suiteReport.start( true ) );
			runLoggingCallbacks( "moduleStart", {
				name: startModule.name,
				tests: startModule.tests
			} );
		}

		config.current = this;

		this.testEnvironment = extend( {}, module.testEnvironment );

		this.started = now();
		emit( "testStart", this.testReport.start( true ) );
		runLoggingCallbacks( "testStart", {
			name: this.testName,
			module: module.name,
			testId: this.testId,
			previousFailure: this.previousFailure
		} );

		if ( !config.pollution ) {
			saveGlobal();
		}
	},

	run: function() {
		var promise;

		config.current = this;

		this.callbackStarted = now();

		if ( config.notrycatch ) {
			runTest( this );
			return;
		}

		try {
			runTest( this );
		} catch ( e ) {
			this.pushFailure( "Died on test #" + ( this.assertions.length + 1 ) + " " +
				this.stack + ": " + ( e.message || e ), extractStacktrace( e, 0 ) );

			// Else next test will carry the responsibility
			saveGlobal();

			// Restart the tests if they're blocking
			if ( config.blocking ) {
				internalRecover( this );
			}
		}

		function runTest( test ) {
			promise = test.callback.call( test.testEnvironment, test.assert );
			test.resolvePromise( promise );

			// If the test has a "lock" on it, but the timeout is 0, then we push a
			// failure as the test should be synchronous.
			if ( test.timeout === 0 && test.semaphore !== 0 ) {
				pushFailure(
					"Test did not finish synchronously even though assert.timeout( 0 ) was used.",
					sourceFromStacktrace( 2 )
				);
			}
		}
	},

	after: function() {
		checkPollution();
	},

	queueHook( hook, hookName, hookOwner ) {
		const callHook = () => {
			const promise = hook.call( this.testEnvironment, this.assert );
			this.resolvePromise( promise, hookName );
		};

		const runHook = () => {
			if ( hookName === "before" ) {
				if ( hookOwner.unskippedTestsRun !== 0 ) {
					return;
				}

				this.preserveEnvironment = true;
			}

			if ( hookName === "after" &&
				hookOwner.unskippedTestsRun !== numberOfUnskippedTests( hookOwner ) - 1 &&
				config.queue.length > 2 ) {
				return;
			}

			config.current = this;
			if ( config.notrycatch ) {
				callHook();
				return;
			}
			try {
				callHook();
			} catch ( error ) {
				this.pushFailure( hookName + " failed on " + this.testName + ": " +
				( error.message || error ), extractStacktrace( error, 0 ) );
			}
		};

		return runHook;
	},

	// Currently only used for module level hooks, can be used to add global level ones
	hooks( handler ) {
		const hooks = [];

		function processHooks( test, module ) {
			if ( module.parentModule ) {
				processHooks( test, module.parentModule );
			}

			if ( module.hooks[ handler ].length ) {
				for ( let i = 0; i < module.hooks[ handler ].length; i++ ) {
					hooks.push( test.queueHook( module.hooks[ handler ][ i ], handler, module ) );
				}
			}
		}

		// Hooks are ignored on skipped tests
		if ( !this.skip ) {
			processHooks( this, this.module );
		}

		return hooks;
	},

	finish: function() {
		config.current = this;
		if ( config.requireExpects && this.expected === null ) {
			this.pushFailure( "Expected number of assertions to be defined, but expect() was " +
				"not called.", this.stack );
		} else if ( this.expected !== null && this.expected !== this.assertions.length ) {
			this.pushFailure( "Expected " + this.expected + " assertions, but " +
				this.assertions.length + " were run", this.stack );
		} else if ( this.expected === null && !this.assertions.length ) {
			this.pushFailure( "Expected at least one assertion, but none were run - call " +
				"expect(0) to accept zero assertions.", this.stack );
		}

		var i,
			module = this.module,
			moduleName = module.name,
			testName = this.testName,
			skipped = !!this.skip,
			todo = !!this.todo,
			bad = 0,
			storage = config.storage;

		this.runtime = now() - this.started;

		config.stats.all += this.assertions.length;
		module.stats.all += this.assertions.length;

		for ( i = 0; i < this.assertions.length; i++ ) {
			if ( !this.assertions[ i ].result ) {
				bad++;
				config.stats.bad++;
				module.stats.bad++;
			}
		}

		notifyTestsRan( module, skipped );

		// Store result when possible
		if ( storage ) {
			if ( bad ) {
				storage.setItem( "qunit-test-" + moduleName + "-" + testName, bad );
			} else {
				storage.removeItem( "qunit-test-" + moduleName + "-" + testName );
			}
		}

		// After emitting the js-reporters event we cleanup the assertion data to
		// avoid leaking it. It is not used by the legacy testDone callbacks.
		emit( "testEnd", this.testReport.end( true ) );
		this.testReport.slimAssertions();

		runLoggingCallbacks( "testDone", {
			name: testName,
			module: moduleName,
			skipped: skipped,
			todo: todo,
			failed: bad,
			passed: this.assertions.length - bad,
			total: this.assertions.length,
			runtime: skipped ? 0 : this.runtime,

			// HTML Reporter use
			assertions: this.assertions,
			testId: this.testId,

			// Source of Test
			source: this.stack
		} );

		if ( module.testsRun === numberOfTests( module ) ) {
			logSuiteEnd( module );

			// Check if the parent modules, iteratively, are done. If that the case,
			// we emit the `suiteEnd` event and trigger `moduleDone` callback.
			let parent = module.parentModule;
			while ( parent && parent.testsRun === numberOfTests( parent ) ) {
				logSuiteEnd( parent );
				parent = parent.parentModule;
			}
		}

		config.current = undefined;

		function logSuiteEnd( module ) {
			emit( "suiteEnd", module.suiteReport.end( true ) );
			runLoggingCallbacks( "moduleDone", {
				name: module.name,
				tests: module.tests,
				failed: module.stats.bad,
				passed: module.stats.all - module.stats.bad,
				total: module.stats.all,
				runtime: now() - module.stats.started
			} );
		}
	},

	preserveTestEnvironment: function() {
		if ( this.preserveEnvironment ) {
			this.module.testEnvironment = this.testEnvironment;
			this.testEnvironment = extend( {}, this.module.testEnvironment );
		}
	},

	queue() {
		const test = this;

		if ( !this.valid() ) {
			return;
		}

		function runTest() {

			// Each of these can by async
			ProcessingQueue.addImmediate( [
				function() {
					test.before();
				},

				test.hooks( "before" ),

				function() {
					test.preserveTestEnvironment();
				},

				test.hooks( "beforeEach" ),

				function() {
					test.run();
				},

				test.hooks( "afterEach" ).reverse(),
				test.hooks( "after" ).reverse(),

				function() {
					test.after();
				},

				function() {
					test.finish();
				}
			] );
		}

		const previousFailCount = config.storage &&
				+config.storage.getItem( "qunit-test-" + this.module.name + "-" + this.testName );

		// Prioritize previously failed tests, detected from storage
		const prioritize = config.reorder && !!previousFailCount;

		this.previousFailure = !!previousFailCount;

		ProcessingQueue.add( runTest, prioritize, config.seed );

		// If the queue has already finished, we manually process the new test
		if ( ProcessingQueue.finished ) {
			ProcessingQueue.advance();
		}
	},

	pushResult: function( resultInfo ) {
		if ( this !== config.current ) {
			throw new Error( "Assertion occured after test had finished." );
		}

		// Destructure of resultInfo = { result, actual, expected, message, negative }
		var source,
			details = {
				module: this.module.name,
				name: this.testName,
				result: resultInfo.result,
				message: resultInfo.message,
				actual: resultInfo.actual,
				expected: resultInfo.expected,
				testId: this.testId,
				negative: resultInfo.negative || false,
				runtime: now() - this.started,
				todo: !!this.todo
			};

		if ( !resultInfo.result ) {
			source = resultInfo.source || sourceFromStacktrace();

			if ( source ) {
				details.source = source;
			}
		}

		this.logAssertion( details );

		this.assertions.push( {
			result: !!resultInfo.result,
			message: resultInfo.message
		} );
	},

	pushFailure: function( message, source, actual ) {
		if ( !( this instanceof Test ) ) {
			throw new Error( "pushFailure() assertion outside test context, was " +
				sourceFromStacktrace( 2 ) );
		}

		this.pushResult( {
			result: false,
			message: message || "error",
			actual: actual || null,
			expected: null,
			source
		} );
	},

	/**
	 * Log assertion details using both the old QUnit.log interface and
	 * QUnit.on( "assertion" ) interface.
	 *
	 * @private
	 */
	logAssertion( details ) {
		runLoggingCallbacks( "log", details );

		const assertion = {
			passed: details.result,
			actual: details.actual,
			expected: details.expected,
			message: details.message,
			stack: details.source,
			todo: details.todo
		};
		this.testReport.pushAssertion( assertion );
		emit( "assertion", assertion );
	},

	resolvePromise: function( promise, phase ) {
		var then, resume, message,
			test = this;
		if ( promise != null ) {
			then = promise.then;
			if ( objectType( then ) === "function" ) {
				resume = internalStop( test );
				then.call(
					promise,
					function() { resume(); },
					function( error ) {
						message = "Promise rejected " +
							( !phase ? "during" : phase.replace( /Each$/, "" ) ) +
							" \"" + test.testName + "\": " +
							( ( error && error.message ) || error );
						test.pushFailure( message, extractStacktrace( error, 0 ) );

						// Else next test will carry the responsibility
						saveGlobal();

						// Unblock
						resume();
					}
				);
			}
		}
	},

	valid: function() {
		var filter = config.filter,
			regexFilter = /^(!?)\/([\w\W]*)\/(i?$)/.exec( filter ),
			module = config.module && config.module.toLowerCase(),
			fullName = ( this.module.name + ": " + this.testName );

		function moduleChainNameMatch( testModule ) {
			var testModuleName = testModule.name ? testModule.name.toLowerCase() : null;
			if ( testModuleName === module ) {
				return true;
			} else if ( testModule.parentModule ) {
				return moduleChainNameMatch( testModule.parentModule );
			} else {
				return false;
			}
		}

		function moduleChainIdMatch( testModule ) {
			return inArray( testModule.moduleId, config.moduleId ) ||
				testModule.parentModule && moduleChainIdMatch( testModule.parentModule );
		}

		// Internally-generated tests are always valid
		if ( this.callback && this.callback.validTest ) {
			return true;
		}

		if ( config.moduleId && config.moduleId.length > 0 &&
			!moduleChainIdMatch( this.module ) ) {

			return false;
		}

		if ( config.testId && config.testId.length > 0 &&
			!inArray( this.testId, config.testId ) ) {

			return false;
		}

		if ( module && !moduleChainNameMatch( this.module ) ) {
			return false;
		}

		if ( !filter ) {
			return true;
		}

		return regexFilter ?
			this.regexFilter( !!regexFilter[ 1 ], regexFilter[ 2 ], regexFilter[ 3 ], fullName ) :
			this.stringFilter( filter, fullName );
	},

	regexFilter: function( exclude, pattern, flags, fullName ) {
		var regex = new RegExp( pattern, flags );
		var match = regex.test( fullName );

		return match !== exclude;
	},

	stringFilter: function( filter, fullName ) {
		filter = filter.toLowerCase();
		fullName = fullName.toLowerCase();

		var include = filter.charAt( 0 ) !== "!";
		if ( !include ) {
			filter = filter.slice( 1 );
		}

		// If the filter matches, we need to honour include
		if ( fullName.indexOf( filter ) !== -1 ) {
			return include;
		}

		// Otherwise, do the opposite
		return !include;
	}
};

export function pushFailure() {
	if ( !config.current ) {
		throw new Error( "pushFailure() assertion outside test context, in " +
			sourceFromStacktrace( 2 ) );
	}

	// Gets current test obj
	var currentTest = config.current;

	return currentTest.pushFailure.apply( currentTest, arguments );
}

function saveGlobal() {
	config.pollution = [];

	if ( config.noglobals ) {
		for ( var key in global ) {
			if ( hasOwn.call( global, key ) ) {

				// In Opera sometimes DOM element ids show up here, ignore them
				if ( /^qunit-test-output/.test( key ) ) {
					continue;
				}
				config.pollution.push( key );
			}
		}
	}
}

function checkPollution() {
	var newGlobals,
		deletedGlobals,
		old = config.pollution;

	saveGlobal();

	newGlobals = diff( config.pollution, old );
	if ( newGlobals.length > 0 ) {
		pushFailure( "Introduced global variable(s): " + newGlobals.join( ", " ) );
	}

	deletedGlobals = diff( old, config.pollution );
	if ( deletedGlobals.length > 0 ) {
		pushFailure( "Deleted global variable(s): " + deletedGlobals.join( ", " ) );
	}
}

// Will be exposed as QUnit.test
export function test( testName, callback ) {
	if ( focused ) {
		return;
	}

	const newTest = new Test( {
		testName: testName,
		callback: callback
	} );

	newTest.queue();
}

export function todo( testName, callback ) {
	if ( focused ) {
		return;
	}

	const newTest = new Test( {
		testName,
		callback,
		todo: true
	} );

	newTest.queue();
}

// Will be exposed as QUnit.skip
export function skip( testName ) {
	if ( focused ) {
		return;
	}

	const test = new Test( {
		testName: testName,
		skip: true
	} );

	test.queue();
}

// Will be exposed as QUnit.only
export function only( testName, callback ) {
	if ( focused ) {
		return;
	}

	config.queue.length = 0;
	focused = true;

	const newTest = new Test( {
		testName: testName,
		callback: callback
	} );

	newTest.queue();
}

// Put a hold on processing and return a function that will release it.
export function internalStop( test ) {
	test.semaphore += 1;
	config.blocking = true;

	// Set a recovery timeout, if so configured.
	if ( defined.setTimeout ) {
		let timeoutDuration;

		if ( typeof test.timeout === "number" ) {
			timeoutDuration = test.timeout;
		} else if ( typeof config.testTimeout === "number" ) {
			timeoutDuration = config.testTimeout;
		}

		if ( typeof timeoutDuration === "number" && timeoutDuration > 0 ) {
			clearTimeout( config.timeout );
			config.timeout = setTimeout( function() {
				pushFailure(
					`Test took longer than ${timeoutDuration}ms; test timed out.`,
					sourceFromStacktrace( 2 )
				);
				internalRecover( test );
			}, timeoutDuration );
		}

	}

	let released = false;
	return function resume() {
		if ( released ) {
			return;
		}

		released = true;
		test.semaphore -= 1;
		internalStart( test );
	};
}

// Forcefully release all processing holds.
function internalRecover( test ) {
	test.semaphore = 0;
	internalStart( test );
}

// Release a processing hold, scheduling a resumption attempt if no holds remain.
function internalStart( test ) {

	// If semaphore is non-numeric, throw error
	if ( isNaN( test.semaphore ) ) {
		test.semaphore = 0;

		pushFailure(
			"Invalid value on test.semaphore",
			sourceFromStacktrace( 2 )
		);
		return;
	}

	// Don't start until equal number of stop-calls
	if ( test.semaphore > 0 ) {
		return;
	}

	// Throw an Error if start is called more often than stop
	if ( test.semaphore < 0 ) {
		test.semaphore = 0;

		pushFailure(
			"Tried to restart test while already started (test's semaphore was 0 already)",
			sourceFromStacktrace( 2 )
		);
		return;
	}

	// Add a slight delay to allow more assertions etc.
	if ( defined.setTimeout ) {
		if ( config.timeout ) {
			clearTimeout( config.timeout );
		}
		config.timeout = setTimeout( function() {
			if ( test.semaphore > 0 ) {
				return;
			}

			if ( config.timeout ) {
				clearTimeout( config.timeout );
			}

			begin();
		}, 13 );
	} else {
		begin();
	}
}

function collectTests( module ) {
	const tests = [].concat( module.tests );
	const modules = [ ...module.childModules ];

	// Do a breadth-first traversal of the child modules
	while ( modules.length ) {
		const nextModule =  modules.shift();
		tests.push.apply( tests, nextModule.tests );
		modules.push( ...nextModule.childModules );
	}

	return tests;
}

function numberOfTests( module ) {
	return collectTests( module ).length;
}

function numberOfUnskippedTests( module ) {
	return collectTests( module ).filter( test => !test.skip ).length;
}

function notifyTestsRan( module, skipped ) {
	module.testsRun++;
	if ( !skipped ) {
		module.unskippedTestsRun++;
	}
	while ( ( module = module.parentModule ) ) {
		module.testsRun++;
		if ( !skipped ) {
			module.unskippedTestsRun++;
		}
	}
}
