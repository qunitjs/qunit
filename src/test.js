function Test( settings ) {
	var i, l;

	++Test.count;

	extend( this, settings );
	this.assertions = [];
	this.semaphore = 0;
	this.usedAsync = false;
	this.module = config.currentModule;
	this.stack = sourceFromStacktrace( 3 );

	// Register unique strings
	for ( i = 0, l = this.module.tests; i < l.length; i++ ) {
		if ( this.module.tests[ i ].name === this.testName ) {
			this.testName += " ";
		}
	}

	this.testId = generateHash( this.module.name, this.testName );

	this.module.tests.push({
		name: this.testName,
		testId: this.testId
	});

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

Test.prototype = {
	before: function() {
		if (

			// Emit moduleStart when we're switching from one module to another
			this.module !== config.previousModule ||

				// They could be equal (both undefined) but if the previousModule property doesn't
				// yet exist it means this is the first test in a suite that isn't wrapped in a
				// module, in which case we'll just emit a moduleStart event for 'undefined'.
				// Without this, reporters can get testStart before moduleStart  which is a problem.
				!hasOwn.call( config, "previousModule" )
		) {
			if ( hasOwn.call( config, "previousModule" ) ) {
				runLoggingCallbacks( "moduleDone", {
					name: config.previousModule.name,
					tests: config.previousModule.tests,
					failed: config.moduleStats.bad,
					passed: config.moduleStats.all - config.moduleStats.bad,
					total: config.moduleStats.all,
					runtime: now() - config.moduleStats.started
				});
			}
			config.previousModule = this.module;
			config.moduleStats = { all: 0, bad: 0, started: now() };
			runLoggingCallbacks( "moduleStart", {
				name: this.module.name,
				tests: this.module.tests
			});
		}

		config.current = this;

		this.testEnvironment = extend( {}, this.module.testEnvironment );
		delete this.testEnvironment.beforeEach;
		delete this.testEnvironment.afterEach;

		this.started = now();
		runLoggingCallbacks( "testStart", {
			name: this.testName,
			module: this.module.name,
			testId: this.testId
		});

		if ( !config.pollution ) {
			saveGlobal();
		}
	},

	run: function() {
		var promise;

		config.current = this;

		if ( this.async ) {
			QUnit.stop();
		}

		this.callbackStarted = now();

		if ( config.notrycatch ) {
			promise = this.callback.call( this.testEnvironment, this.assert );
			this.resolvePromise( promise );
			return;
		}

		try {
			promise = this.callback.call( this.testEnvironment, this.assert );
			this.resolvePromise( promise );
		} catch ( e ) {
			this.pushFailure( "Died on test #" + ( this.assertions.length + 1 ) + " " +
				this.stack + ": " + ( e.message || e ), extractStacktrace( e, 0 ) );

			// else next test will carry the responsibility
			saveGlobal();

			// Restart the tests if they're blocking
			if ( config.blocking ) {
				QUnit.start();
			}
		}
	},

	after: function() {
		checkPollution();
	},

	queueHook: function( hook, hookName ) {
		var promise,
			test = this;
		return function runHook() {
			config.current = test;
			if ( config.notrycatch ) {
				promise = hook.call( test.testEnvironment, test.assert );
				test.resolvePromise( promise, hookName );
				return;
			}
			try {
				promise = hook.call( test.testEnvironment, test.assert );
				test.resolvePromise( promise, hookName );
			} catch ( error ) {
				test.pushFailure( hookName + " failed on " + test.testName + ": " +
					( error.message || error ), extractStacktrace( error, 0 ) );
			}
		};
	},

	// Currently only used for module level hooks, can be used to add global level ones
	hooks: function( handler ) {
		var hooks = [];

		// Hooks are ignored on skipped tests
		if ( this.skip ) {
			return hooks;
		}

		if ( this.module.testEnvironment &&
				QUnit.objectType( this.module.testEnvironment[ handler ] ) === "function" ) {
			hooks.push( this.queueHook( this.module.testEnvironment[ handler ], handler ) );
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
			bad = 0;

		this.runtime = now() - this.started;
		config.stats.all += this.assertions.length;
		config.moduleStats.all += this.assertions.length;

		for ( i = 0; i < this.assertions.length; i++ ) {
			if ( !this.assertions[ i ].result ) {
				bad++;
				config.stats.bad++;
				config.moduleStats.bad++;
			}
		}

		runLoggingCallbacks( "testDone", {
			name: this.testName,
			module: this.module.name,
			skipped: !!this.skip,
			failed: bad,
			passed: this.assertions.length - bad,
			total: this.assertions.length,
			runtime: this.runtime,

			// HTML Reporter use
			assertions: this.assertions,
			testId: this.testId,

			// DEPRECATED: this property will be removed in 2.0.0, use runtime instead
			duration: this.runtime
		});

		// QUnit.reset() is deprecated and will be replaced for a new
		// fixture reset function on QUnit 2.0/2.1.
		// It's still called here for backwards compatibility handling
		QUnit.reset();

		config.current = undefined;
	},

	queue: function() {
		var bad,
			test = this;

		if ( !this.valid() ) {
			return;
		}

		function run() {

			// each of these can by async
			synchronize([
				function() {
					test.before();
				},

				test.hooks( "beforeEach" ),

				function() {
					test.run();
				},

				test.hooks( "afterEach" ).reverse(),

				function() {
					test.after();
				},
				function() {
					test.finish();
				}
			]);
		}

		// `bad` initialized at top of scope
		// defer when previous test run passed, if storage is available
		bad = QUnit.config.reorder && defined.sessionStorage &&
				+sessionStorage.getItem( "qunit-test-" + this.module.name + "-" + this.testName );

		if ( bad ) {
			run();
		} else {
			synchronize( run, true );
		}
	},

	push: function( result, actual, expected, message ) {
		var source,
			details = {
				module: this.module.name,
				name: this.testName,
				result: result,
				message: message,
				actual: actual,
				expected: expected,
				testId: this.testId,
				runtime: now() - this.started
			};

		if ( !result ) {
			source = sourceFromStacktrace();

			if ( source ) {
				details.source = source;
			}
		}

		runLoggingCallbacks( "log", details );

		this.assertions.push({
			result: !!result,
			message: message
		});
	},

	pushFailure: function( message, source, actual ) {
		if ( !this instanceof Test ) {
			throw new Error( "pushFailure() assertion outside test context, was " +
				sourceFromStacktrace( 2 ) );
		}

		var details = {
				module: this.module.name,
				name: this.testName,
				result: false,
				message: message || "error",
				actual: actual || null,
				testId: this.testId,
				runtime: now() - this.started
			};

		if ( source ) {
			details.source = source;
		}

		runLoggingCallbacks( "log", details );

		this.assertions.push({
			result: false,
			message: message
		});
	},

	resolvePromise: function( promise, phase ) {
		var then, message,
			test = this;
		if ( promise != null ) {
			then = promise.then;
			if ( QUnit.objectType( then ) === "function" ) {
				QUnit.stop();
				then.call(
					promise,
					QUnit.start,
					function( error ) {
						message = "Promise rejected " +
							( !phase ? "during" : phase.replace( /Each$/, "" ) ) +
							" " + test.testName + ": " + ( error.message || error );
						test.pushFailure( message, extractStacktrace( error, 0 ) );

						// else next test will carry the responsibility
						saveGlobal();

						// Unblock
						QUnit.start();
					}
				);
			}
		}
	},

	valid: function() {
		var include,
			filter = config.filter && config.filter.toLowerCase(),
			module = QUnit.urlParams.module && QUnit.urlParams.module.toLowerCase(),
			fullName = ( this.module.name + ": " + this.testName ).toLowerCase();

		// Internally-generated tests are always valid
		if ( this.callback && this.callback.validTest ) {
			return true;
		}

		if ( config.testId.length > 0 && inArray( this.testId, config.testId ) < 0 ) {
			return false;
		}

		if ( module && ( !this.module.name || this.module.name.toLowerCase() !== module ) ) {
			return false;
		}

		if ( !filter ) {
			return true;
		}

		include = filter.charAt( 0 ) !== "!";
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

// Resets the test setup. Useful for tests that modify the DOM.
/*
DEPRECATED: Use multiple tests instead of resetting inside a test.
Use testStart or testDone for custom cleanup.
This method will throw an error in 2.0, and will be removed in 2.1
*/
QUnit.reset = function() {

	// Return on non-browser environments
	// This is necessary to not break on node tests
	if ( typeof window === "undefined" ) {
		return;
	}

	var fixture = defined.document && document.getElementById &&
			document.getElementById( "qunit-fixture" );

	if ( fixture ) {
		fixture.innerHTML = config.fixture;
	}
};

QUnit.pushFailure = function() {
	if ( !QUnit.config.current ) {
		throw new Error( "pushFailure() assertion outside test context, in " +
			sourceFromStacktrace( 2 ) );
	}

	// Gets current test obj
	var currentTest = QUnit.config.current;

	return currentTest.pushFailure.apply( currentTest, arguments );
};

// Based on Java's String.hashCode, a simple but not
// rigorously collision resistant hashing function
function generateHash( module, testName ) {
	var hex,
		i = 0,
		hash = 0,
		str = module + "\x1C" + testName,
		len = str.length;

	for ( ; i < len; i++ ) {
		hash  = ( ( hash << 5 ) - hash ) + str.charCodeAt( i );
		hash |= 0;
	}

	// Convert the possibly negative integer hash code into an 8 character hex string, which isn't
	// strictly necessary but increases user understanding that the id is a SHA-like hash
	hex = ( 0x100000000 + hash ).toString( 16 );
	if ( hex.length < 8 ) {
		hex = "0000000" + hex;
	}

	return hex.slice( -8 );
}
