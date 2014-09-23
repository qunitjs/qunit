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

	// Hack to force an Error to be thrown instead of a `pushFailure` call
	assert.test.pushFailure = function( msg ) {
		throw new Error( msg );
	};
	assert.throws(function() {
		QUnit.start();
	}, /Called start\(\) while already started \(test's semaphore was 0 already\)/ );
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
  }, 50);
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

QUnit.test( "fails if callback is called more than once", function( assert ) {
	assert.expect( 1 );

	// Hack to force an Error to be thrown instead of a `pushFailure` call
	assert.test.pushFailure = function( msg ) {

		// Need this hack to prevent the post-`done` `throws` assertion from causing another failure
		assert.test.semaphore = 1;

		throw new Error( msg );
	};

	assert.throws(function() {
		var done = assert.async();
		done();
		done();
	}, /Called the callback returned from `assert.async` more than once/ );

	// Hack to allow test to resume post-`throws` assertion
	assert.test.semaphore = 0;
});

QUnit.module( "assert.async in beforeEach", {
	beforeEach: function( assert ) {
		var done = assert.async(),
			currentTest = this;
		setTimeout(function() {
			currentTest.state = "beforeEach";
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
		currentTest = this;
	setTimeout(function() {
		currentTest.state = "done";
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

QUnit.module( "assertions after final assert.async callback fail", {
	beforeEach: function( assert ) {

		// Hack to force an Error to be thrown instead of a `pushFailure` call
		assert.test.pushFailure = function( msg ) {

			// Need this hack to prevent the post-`done` `throws` assertion from causing another failure
			assert.test.semaphore = 1;

			throw new Error( msg );
		};

		// Hack to allow test to resume post-`throws` assertion
		assert.throws = (function( _throws ) {
			return function() {

				// Invoke the original `throws` function
				_throws.apply( assert, arguments );

				// Need this hack to undo the semaphore incrementing from the hacked `test.pushFailure` above
				assert.test.semaphore = 0;
			};
		})( assert.throws );
	},

	errorRegex: /Assertion occurred after the final `assert.async` was resolved/
});

QUnit.test( "sole `done` is called synchronously BEFORE passing assertion", function( assert ) {
	var done;

	assert.expect( 1 );

	done = assert.async();
	done();

	assert.throws(function() {

		// FAIL!!! (with hack to force an Error to be thrown instead of a `pushFailure` call)
		assert.ok( true, "should fail with a special `done`-related error message if called " +
			"after `done` even if result is passing" );
	}, this.errorRegex );
});

QUnit.test( "sole `done` is called synchronously BEFORE failing assertion", function( assert ) {
	var done;

	assert.expect( 1 );

	done = assert.async();
	done();

	assert.throws(function() {

		// FAIL!!! (with hack to force an Error to be thrown instead of a `pushFailure` call)
		assert.ok( false, "should fail with a special `done`-related error message if called " +
			"after `done` even if result is already failing" );
	}, this.errorRegex );
});

QUnit.test( "sole `done` is called BEFORE passing assertion", function( assert ) {
	var done,
		_this = this;

	assert.expect( 1 );

	done = assert.async();
	setTimeout(function() {
		done();

		assert.throws(function() {

			// FAIL!!! (with hack to force an Error to be thrown instead of a `pushFailure` call)
			assert.ok( true, "should fail with a special `done`-related error message if called " +
				"after `done` even if result is passing" );
		}, _this.errorRegex );
	}, 50 );
});

QUnit.test( "sole `done` is called BEFORE failing assertion", function( assert ) {
	var done,
		_this = this;

	assert.expect( 1 );

	done = assert.async();
	setTimeout(function() {
		done();

		assert.throws(function() {

			// FAIL!!! (with hack to force an Error to be thrown instead of a `pushFailure` call)
			assert.ok( false, "should fail with a special `done`-related error message if called " +
				"after `done` even if result is already failing" );
		}, _this.errorRegex );
	}, 50 );
});

QUnit.test( "multiple `done` calls, final `done` is called BEFORE passing assertion", function( assert ) {
	var done1, done2,
		_this = this;

	assert.expect( 2 );
	done1 = assert.async();
	done2 = assert.async();
	setTimeout(function() {
		done1();
		assert.ok( true, "should pass as this is not after the final `done`" );
	}, 25 );
	setTimeout(function() {
		done2();

		assert.throws(function() {

			// FAIL!!! (with hack to force an Error to be thrown instead of a `pushFailure` call)
			assert.ok( true, "should fail with a special `done`-related error message if called " +
				"after final `done` even if result is passing" );
		}, _this.errorRegex );
	}, 50 );
});

QUnit.test( "multiple `done` calls, final `done` is called BEFORE failing assertion", function( assert ) {
	var done1, done2,
		_this = this;

	assert.expect( 2 );
	done1 = assert.async();
	done2 = assert.async();
	setTimeout(function() {
		done1();
		assert.ok( true, "should pass if called after this `done` but before final `done`" );
	}, 25);
	setTimeout(function() {
		done2();

		assert.throws(function() {

			// FAIL!!! (with hack to force an Error to be thrown instead of a `pushFailure` call)
			assert.ok( false, "should fail with a special `done`-related error message if called " +
				"after `done` even if result is already failing" );
		}, _this.errorRegex );
	}, 50);
});

QUnit.test( "cannot allow assertions between first `done` call and second `assert.async` call", function( assert ) {
	var done1, done2,
		_this = this;

	assert.expect( 1 );
	done1 = assert.async();
	setTimeout(function() {
		done1();

		assert.throws(function() {

			// FAIL!!! (with hack to force an Error to be thrown instead of a `pushFailure` call)
			assert.ok( true, "should fail with a special `done`-related error message if called " +
				"after final `done` even if result is passing" );

			done2 = assert.async();
			setTimeout(function() {
				assert.ok( false, "Should never reach this point anyway" );
				done2();
			}, 13 );
		}, _this.errorRegex );
	}, 13 );
});
