function Test( settings ) {
	extend( this, settings );
	this.assertions = [];
	this.testNumber = ++Test.count;
	this.module = config.currentModule;
	this.moduleTestEnvironment = config.currentModuleTestEnvironment;
	this.stack = sourceFromStacktrace( 3 );

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
					name: config.previousModule,
					failed: config.moduleStats.bad,
					passed: config.moduleStats.all - config.moduleStats.bad,
					total: config.moduleStats.all,
					runtime: now() - config.moduleStats.started
				});
			}
			config.previousModule = this.module;
			config.moduleStats = { all: 0, bad: 0, started: now() };
			runLoggingCallbacks( "moduleStart", {
				name: this.module
			});
		}

		config.current = this;

		this.testEnvironment = extend( {}, this.moduleTestEnvironment );
		delete this.testEnvironment.beforeEach;
		delete this.testEnvironment.afterEach;

		this.started = now();
		runLoggingCallbacks( "testStart", {
			name: this.testName,
			module: this.module,
			testNumber: this.testNumber
		});

		if ( !config.pollution ) {
			saveGlobal();
		}
	},
	run: function() {
		config.current = this;

		if ( this.async ) {
			QUnit.stop();
		}

		this.callbackStarted = now();

		if ( config.notrycatch ) {
			this.callback.call( this.testEnvironment, this.assert );
			return;
		}

		try {
			this.callback.call( this.testEnvironment, this.assert );
		} catch ( e ) {
			this.pushFailure( "Died on test #" + ( this.assertions.length + 1 ) + " " + this.stack + ": " + ( e.message || e ), extractStacktrace( e, 0 ) );

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
		var test = this;
		return function runHook() {
			config.current = test;
			if ( config.notrycatch ) {
				hook.call( test.testEnvironment, test.assert );
				return;
			}
			try {
				hook.call( test.testEnvironment, test.assert );
			} catch ( error ) {
				test.pushFailure( hookName + " failed on " + test.testName + ": " + ( error.message || error ), extractStacktrace( error, 0 ) );
			}
		};
	},
	hooks: function( handler ) {
		var hooks = [];

		// hooks are also ignored on skipped tests
		if ( this.skip ) {
			return hooks;
		}

		if ( QUnit.objectType( config[ handler ] ) === "function" ) {
			hooks.push( this.queueHook( config[ handler ], handler ) );
		}
		if ( this.moduleTestEnvironment && QUnit.objectType( this.moduleTestEnvironment[ handler ] ) === "function" ) {
			hooks.push( this.queueHook( this.moduleTestEnvironment[ handler ], handler ) );
		}

		return hooks;
	},
	finish: function() {
		config.current = this;
		if ( config.requireExpects && this.expected === null ) {
			this.pushFailure( "Expected number of assertions to be defined, but expect() was not called.", this.stack );
		} else if ( this.expected !== null && this.expected !== this.assertions.length ) {
			this.pushFailure( "Expected " + this.expected + " assertions, but " + this.assertions.length + " were run", this.stack );
		} else if ( this.expected === null && !this.assertions.length ) {
			this.pushFailure( "Expected at least one assertion, but none were run - call expect(0) to accept zero assertions.", this.stack );
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
			module: this.module,
			skipped: !!this.skip,
			failed: bad,
			passed: this.assertions.length - bad,
			total: this.assertions.length,
			runtime: this.runtime,

			// HTML Reporter use
			assertions: this.assertions,
			testNumber: this.testNumber,

			// DEPRECATED: this property will be removed in 2.0.0, use runtime instead
			duration: this.runtime
		});

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
				+sessionStorage.getItem( "qunit-test-" + this.module + "-" + this.testName );

		if ( bad ) {
			run();
		} else {
			synchronize( run, true );
		}
	},

	push: function( result, actual, expected, message ) {
		var source,
			details = {
				module: this.module,
				name: this.testName,
				result: result,
				message: message,
				actual: actual,
				expected: expected,
				testNumber: this.testNumber,
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
			throw new Error( "pushFailure() assertion outside test context, was " + sourceFromStacktrace( 2 ) );
		}

		var details = {
				module: this.module,
				name: this.testName,
				result: false,
				message: message || "error",
				actual: actual || null,
				testNumber: this.testNumber,
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

	/** @return Boolean: true if this test should be ran */
	valid: function() {
		var include,
			filter = config.filter && config.filter.toLowerCase(),
			module = config.module && config.module.toLowerCase(),
			fullName = ( this.module + ": " + this.testName ).toLowerCase();

		// Internally-generated tests are always valid
		if ( this.callback && this.callback.validTest ) {
			delete this.callback.validTest;
			return true;
		}

		if ( config.testNumber.length > 0 ) {
			if ( inArray( this.testNumber, config.testNumber ) < 0 ) {
				return false;
			}
		}

		if ( module && ( !this.module || this.module.toLowerCase() !== module ) ) {
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

QUnit.pushFailure = function() {
	if ( !QUnit.config.current ) {
		throw new Error( "pushFailure() assertion outside test context, in " + sourceFromStacktrace( 2 ) );
	}

	// Gets current test obj
	var currentTest = QUnit.config.current;

	return currentTest.pushFailure.apply( currentTest, arguments );
};
