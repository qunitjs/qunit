var globalStartError, globalStopError;

QUnit.begin(function() {
	try {
		QUnit.start();
	}
	catch ( thrownError ) {
		globalStartError = thrownError.message;
	}
});

try {
	QUnit.stop();
}
catch ( thrownError ) {
	globalStopError = thrownError.message;
}

QUnit.module( "global start/stop errors" );

QUnit.test( "Call start() when already started", function( assert ) {
	assert.expect( 1 );
	assert.equal( globalStartError, "Called start() outside of a test context while already started" );
});

QUnit.test( "Call stop() outside of test context", function( assert ) {
	assert.expect( 1 );
	assert.equal( globalStopError, "Called stop() outside of a test context" );
});

QUnit.module( "start/stop" );

QUnit.test( "parallel calls", function( assert ) {
	assert.expect( 2 );
	QUnit.stop();
	setTimeout(function() {
		assert.ok( true );
		QUnit.start();
	}, 13 );
	QUnit.stop();
	setTimeout(function() {
		assert.ok( true );
		QUnit.start();
	}, 125 );
});

QUnit.test( "waterfall calls", function( assert ) {
	assert.expect( 2 );
	QUnit.stop();
	setTimeout(function() {
		assert.ok( true, "first" );
		QUnit.start();
		QUnit.stop();
		setTimeout(function() {
			assert.ok( true, "second" );
			QUnit.start();
		}, 150 );
	}, 150 );
});

QUnit.test( "fails if start is called more than stop", function( assert ) {
	assert.expect( 1 );

	// Duck-punch to force an Error to be thrown instead of a `pushFailure` call
	assert.test.pushFailure = function( msg ) {
		throw new Error( msg );
	};
	assert.throws(function() {
		QUnit.start();
	}, new RegExp( "Called start\\(\\) while already started \\(test's semaphore was 0 already\\)" ) );
});

QUnit.module( "asyncTest" );

QUnit.asyncTest( "asyncTest", function( assert ) {
	assert.expect( 1 );
	setTimeout(function() {
		assert.ok( true );
		QUnit.start();
	}, 13 );
});

QUnit.module( "assert.async" );

QUnit.test( "single call", function( assert ) {
  var done;

  assert.expect( 1 );
  done = assert.async();
  setTimeout(function() {
    assert.ok( true );
    done();
  }, 50 );
});

QUnit.test( "parallel calls", function( assert ) {
	var done1, done2;

	assert.expect( 2 );
	done1 = assert.async();
	setTimeout(function() {
		assert.ok( true );
		done1();
	}, 13 );
	done2 = assert.async();
	setTimeout(function() {
		assert.ok( true );
		done2();
	}, 125 );
});

QUnit.test( "waterfall calls", function( assert ) {
	var done1, done2;

	assert.expect( 2 );
	done1 = assert.async();
	setTimeout(function() {
		assert.ok( true, "first" );
		done1();
		done2 = assert.async();
		setTimeout(function() {
			assert.ok( true, "second" );
			done2();
		}, 150 );
	}, 150 );
});

QUnit.test( "fails if callback is called more than once in test", function( assert ) {
	var done;

	assert.expect( 1 );

	// Duck-punch to force an Error to be thrown instead of a `pushFailure` call
	assert.test.pushFailure = function( msg ) {
		throw new Error( msg );
	};

	// Having an outer async flow in this test avoids the need to manually modify QUnit internals
	// in order to avoid post-`done` assertions causing additional failures
	done = assert.async();

	assert.throws(function() {
		var overDone = assert.async();
		overDone();
		overDone();
	}, new RegExp( "Called the callback returned from `assert.async` more than once" ) );

	done();
});

QUnit.module( "assert.async fails if callback is called more than once in", {
	beforeEach: function( assert ) {
		var done;

		assert.expect( 1 );

		// Duck-punch to force an Error to be thrown instead of a `pushFailure` call
		assert.test.pushFailure = function( msg ) {
			throw new Error( msg );
		};

		// Having an outer async flow in this test avoids the need to manually modify QUnit internals
		// in order to avoid post-`done` assertions causing additional failures
		done = assert.async();

		assert.throws(function() {
			var overDone = assert.async();
			overDone();
			overDone();
		}, new RegExp( "Called the callback returned from `assert.async` more than once" ) );

		done();
	}
});

QUnit.test( "beforeEach", function( /* assert */ ) {
	// noop
});

QUnit.module( "assert.async fails if callback is called more than once in", {
	afterEach: function( assert ) {
		var done;

		assert.expect( 1 );

		// Duck-punch to force an Error to be thrown instead of a `pushFailure` call
		assert.test.pushFailure = function( msg ) {
			throw new Error( msg );
		};

		// Having an outer async flow in this test avoids the need to manually modify QUnit internals
		// in order to avoid post-`done` assertions causing additional failures
		done = assert.async();

		assert.throws(function() {
			var overDone = assert.async();
			overDone();
			overDone();
		}, new RegExp( "Called the callback returned from `assert.async` more than once" ) );

		done();
	}
});

QUnit.test( "afterEach", function( /* assert */ ) {
	// noop
});

QUnit.module( "assert.async in beforeEach", {
	beforeEach: function( assert ) {
		var done = assert.async(),
			testContext = this;
		setTimeout(function() {
			testContext.state = "beforeEach";
			done();
		}, 50 );
	}
});

QUnit.test( "beforeEach synchronized", function( assert ) {
	assert.expect( 1 );
	assert.equal( this.state, "beforeEach", "beforeEach synchronized before test callback was executed" );
});

QUnit.module( "assert.async before afterEach", {
	afterEach: function( assert ) {
		assert.equal( this.state, "done", "test callback synchronized before afterEach was executed" );
	}
});

QUnit.test( "afterEach will synchronize", function( assert ) {
	assert.expect( 1 );
	var done = assert.async(),
		testContext = this;
	setTimeout(function() {
		testContext.state = "done";
		done();
	}, 25 );
});

QUnit.module( "assert.async in afterEach", {
	afterEach: function( assert ) {
		var done = assert.async();
		setTimeout(function() {
			assert.ok( true, "afterEach synchronized before test was finished" );
			done();
		}, 50 );
	}
});

QUnit.test( "afterEach will synchronize", function( assert ) {
	assert.expect( 1 );
});

QUnit.module( "assert.async callback event loop timing" );

QUnit.test( "`done` can be called synchronously", function( assert ) {
	var done;

	assert.expect( 1 );
	done = assert.async();

	assert.ok( true );
	done();
});

QUnit.test( "sole `done` is called last", function( assert ) {
  var done;

  assert.expect( 1 );
  done = assert.async();
  setTimeout(function() {
    assert.ok( true, "should pass if called before `done`" );
    done();
  }, 13 );
});

QUnit.test( "multiple `done` calls, no assertions after final `done`", function( assert ) {
  var done1, done2;

  assert.expect( 2 );
  done1 = assert.async();
  done2 = assert.async();
  setTimeout(function() {
    done1();
    assert.ok( true, "should pass if called after this `done` but before final `done`" );
  }, 25 );
  setTimeout(function() {
    assert.ok( true, "should pass if called before final `done`" );
    done2();
  }, 50 );
});

QUnit.test( "order of multiple `done` calls doesn't affect post-`done` assertions", function( assert ) {
  var done1, done2;

  assert.expect( 2 );
  done1 = assert.async();
  done2 = assert.async();
  setTimeout(function() {
    done2();
    assert.ok( true, "should pass if called after this `done` but before final `done`" );
  }, 25 );
  setTimeout(function() {
    assert.ok( true, "should pass if called before final `done`" );
    done1();
  }, 50 );
});

QUnit.module( "assertions after final assert.async callback in test callback fail", {
	beforeEach: function( assert ) {
		var errorRegex = new RegExp( "Assertion occurred after the final `assert\\.async` was resolved" );

		// Duck-punch to force an Error to be thrown instead of a `pushFailure` call
		assert.test.pushFailure = function( msg ) {

			// Increment the semaphore, preventing post-`done` assertions from causing another failure
			assert.test.semaphore++;

			throw new Error( msg );
		};

		// Provide a wrapper for `assert.throws` to allow test to pass this post-`done` assertion
		this._assertCatch = function( fn ) {

			assert.throws.call( assert, fn, errorRegex );

			// Decrement the semaphore to undo the effects of the duck-punched `test.pushFailure` above
			assert.test.semaphore--;
		};
	}
});

QUnit.test( "sole `done` is called synchronously BEFORE passing assertion", function( assert ) {
	var done;

	assert.expect( 1 );

	done = assert.async();
	done();

	this._assertCatch(function() {

		// FAIL!!! (with duck-punch to force an Error to be thrown instead of a `pushFailure` call)
		assert.ok( true, "should fail with a special `done`-related error message if called " +
			"after `done` even if result is passing" );
	});
});

QUnit.test( "sole `done` is called synchronously BEFORE failing assertion", function( assert ) {
	var done;

	assert.expect( 1 );

	done = assert.async();
	done();

	this._assertCatch(function() {

		// FAIL!!! (with duck-punch to force an Error to be thrown instead of a `pushFailure` call)
		assert.ok( false, "should fail with a special `done`-related error message if called " +
			"after `done` even if result is already failing" );
	});
});

QUnit.test( "sole `done` is called BEFORE passing assertion", function( assert ) {
	var done,
		testContext = this;

	assert.expect( 1 );

	done = assert.async();
	setTimeout(function() {
		done();

		testContext._assertCatch(function() {

			// FAIL!!! (with duck-punch to force an Error to be thrown instead of a `pushFailure` call)
			assert.ok( true, "should fail with a special `done`-related error message if called " +
				"after `done` even if result is passing" );
		});
	}, 50 );
});

QUnit.test( "sole `done` is called BEFORE failing assertion", function( assert ) {
	var done,
		testContext = this;

	assert.expect( 1 );

	done = assert.async();
	setTimeout(function() {
		done();

		testContext._assertCatch(function() {

			// FAIL!!! (with duck-punch to force an Error to be thrown instead of a `pushFailure` call)
			assert.ok( false, "should fail with a special `done`-related error message if called " +
				"after `done` even if result is already failing" );
		});
	}, 50 );
});

QUnit.test( "multiple `done` calls, final `done` is called BEFORE passing assertion", function( assert ) {
	var done1, done2,
		testContext = this;

	assert.expect( 2 );
	done1 = assert.async();
	done2 = assert.async();
	setTimeout(function() {
		done1();
		assert.ok( true, "should pass as this is not after the final `done`" );
	}, 25 );
	setTimeout(function() {
		done2();

		testContext._assertCatch(function() {

			// FAIL!!! (with duck-punch to force an Error to be thrown instead of a `pushFailure` call)
			assert.ok( true, "should fail with a special `done`-related error message if called " +
				"after final `done` even if result is passing" );
		});
	}, 50 );
});

QUnit.test( "multiple `done` calls, final `done` is called BEFORE failing assertion", function( assert ) {
	var done1, done2,
		testContext = this;

	assert.expect( 2 );
	done1 = assert.async();
	done2 = assert.async();
	setTimeout(function() {
		done1();
		assert.ok( true, "should pass if called after this `done` but before final `done`" );
	}, 25 );
	setTimeout(function() {
		done2();

		testContext._assertCatch(function() {

			// FAIL!!! (with duck-punch to force an Error to be thrown instead of a `pushFailure` call)
			assert.ok( false, "should fail with a special `done`-related error message if called " +
				"after `done` even if result is already failing" );
		});
	}, 50 );
});

QUnit.test( "cannot allow assertions between first `done` call and second `assert.async` call", function( assert ) {
	var done1, done2,
		testContext = this;

	assert.expect( 1 );
	done1 = assert.async();
	setTimeout(function() {
		done1();

		testContext._assertCatch(function() {

			// FAIL!!! (with duck-punch to force an Error to be thrown instead of a `pushFailure` call)
			assert.ok( true, "should fail with a special `done`-related error message if called " +
				"after final `done` even if result is passing" );

			done2 = assert.async();
			setTimeout(function() {
				assert.ok( false, "Should never reach this point anyway" );
				done2();
			}, 13 );
		});
	}, 13 );
});

QUnit.module( "assertions after final assert.async callback in beforeEach fail but allow other phases to run", {
	beforeEach: function( assert ) {
		var errorRegex = new RegExp( "Assertion occurred after the final `assert\\.async` was resolved" );

		// Duck-punch to force an Error to be thrown instead of a `pushFailure` call
		assert.test.pushFailure = function( msg ) {

			// Increment the semaphore, preventing post-`done` assertions from causing another failure
			assert.test.semaphore++;

			throw new Error( msg );
		};

		// Provide a wrapper for `assert.throws` to allow test to pass this post-`done` assertion
		this._assertCatch = function( fn ) {
			assert.throws.call( assert, fn, errorRegex );

			// Decrement the semaphore to undo the effects of the duck-punched `test.pushFailure` above
			assert.test.semaphore--;
		};

		// THIS IS THE ACTUAL TEST!
		assert.expect( 3 );
		this._assertCatch(function() {
			assert.async()();

			// FAIL!!! (with duck-punch to force an Error to be thrown instead of a `pushFailure` call)
			assert.ok( true, "should fail with a special `done`-related error message if called " +
				"after final `done` even if result is passing" );
		});
	},

	afterEach: function( assert ) {
		assert.ok( true, "This assertion should still run in afterEach" );
	}
});

QUnit.test( "beforeEach will fail but test and afterTeach will still run", function( assert ) {
	assert.ok( true, "This assertion should still run in the test callback" );
});

QUnit.module( "assertions after final assert.async callback in test callback fail but allow other phases to run", {
	beforeEach: function( assert ) {
		var errorRegex = new RegExp( "Assertion occurred after the final `assert\\.async` was resolved" );

		// Duck-punch to force an Error to be thrown instead of a `pushFailure` call
		assert.test.pushFailure = function( msg ) {

			// Increment the semaphore, preventing post-`done` assertions from causing another failure
			assert.test.semaphore++;

			throw new Error( msg );
		};

		// Provide a wrapper for `assert.throws` to allow test to pass this post-`done` assertion
		this._assertCatch = function( fn ) {
			assert.throws.call( assert, fn, errorRegex );

			// Decrement the semaphore to undo the effects of the duck-punched `test.pushFailure` above
			assert.test.semaphore--;
		};

		assert.expect( 3 );
		assert.ok( true, "This assertion should still run in beforeEach" );
	},

	afterEach: function( assert ) {
		assert.ok( true, "This assertion should still run in afterEach" );
	}
});

QUnit.test( "test callback will fail but beforeEach and afterEach will still run", function( assert ) {
	this._assertCatch(function() {
		assert.async()();

		// FAIL!!! (with duck-punch to force an Error to be thrown instead of a `pushFailure` call)
		assert.ok( true, "should fail with a special `done`-related error message if called " +
			"after final `done` even if result is passing" );
	});
});

QUnit.module( "assertions after final assert.async callback in afterEach fail but allow other phases to run", {
	beforeEach: function( assert ) {
		var errorRegex = new RegExp( "Assertion occurred after the final `assert\\.async` was resolved" );

		// Duck-punch to force an Error to be thrown instead of a `pushFailure` call
		assert.test.pushFailure = function( msg ) {

			// Increment the semaphore, preventing post-`done` assertions from causing another failure
			assert.test.semaphore++;

			throw new Error( msg );
		};

		// Provide a wrapper for `assert.throws` to allow test to pass this post-`done` assertion
		this._assertCatch = function( fn ) {
			assert.throws.call( assert, fn, errorRegex );

			// Decrement the semaphore to undo the effects of the duck-punched `test.pushFailure` above
			assert.test.semaphore--;
		};

		assert.expect( 3 );
		assert.ok( true, "This assertion should still run in beforeEach" );
	},

	afterEach: function( assert ) {
		this._assertCatch(function() {
			assert.async()();

			// FAIL!!! (with duck-punch to force an Error to be thrown instead of a `pushFailure` call)
			assert.ok( true, "should fail with a special `done`-related error message if called " +
				"after final `done` even if result is passing" );
		});
	}
});

QUnit.test( "afterEach will fail but beforeEach and test will still run", function( assert ) {
	assert.ok( true, "This assertion should still run in the test callback" );
});
