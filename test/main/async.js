function asyncCallback( assert ) {
	var done = assert.async();
	setTimeout( function() {
		assert.ok( true );
		done();
	} );
}

QUnit.module( "assert.async" );

QUnit.test( "single call", function( assert ) {
	var done = assert.async();

	assert.expect( 1 );
	setTimeout( function() {
		assert.ok( true );
		done();
	} );
} );

QUnit.test( "multiple call", function( assert ) {
	var done = assert.async( 4 );

	assert.expect( 4 );
	setTimeout( function() {
		assert.ok( true );
		done();
	} );
	setTimeout( function() {
		assert.ok( true );
		done();
	} );
	setTimeout( function() {
		assert.ok( true );
		done();
	} );
	setTimeout( function() {
		assert.ok( true );
		done();
	} );

} );

QUnit.test( "parallel calls", function( assert ) {
	var done1 = assert.async(),
		done2 = assert.async();

	assert.expect( 2 );
	setTimeout( function() {
		assert.ok( true );
		done1();
	} );
	setTimeout( function() {
		assert.ok( true );
		done2();
	} );
} );

QUnit.test( "parallel calls of differing speeds", function( assert ) {
	var done1 = assert.async(),
		done2 = assert.async();

	assert.expect( 2 );
	setTimeout( function() {
		assert.ok( true );
		done1();
	} );
	setTimeout( function() {
		assert.ok( true );
		done2();
	}, 100 );
} );

QUnit.test( "waterfall calls", function( assert ) {
	var done2,
		done1 = assert.async();

	assert.expect( 2 );
	setTimeout( function() {
		assert.ok( true, "first" );
		done1();
		done2 = assert.async();
		setTimeout( function() {
			assert.ok( true, "second" );
			done2();
		} );
	} );
} );

QUnit.test( "waterfall calls of differing speeds", function( assert ) {
	var done2,
		done1 = assert.async();

	assert.expect( 2 );
	setTimeout( function() {
		assert.ok( true, "first" );
		done1();
		done2 = assert.async();
		setTimeout( function() {
			assert.ok( true, "second" );
			done2();
		}, 100 );
	} );
} );

QUnit.test( "fails if callback is called more than once in test", function( assert ) {

	// Having an outer async flow in this test avoids the need to manually modify QUnit internals
	// in order to avoid post-`done` assertions causing additional failures
	var done = assert.async();

	assert.expect( 1 );

	// Duck-punch to force an Error to be thrown instead of a `pushFailure` call
	assert.test.pushFailure = function( msg ) {
		throw new Error( msg );
	};

	var overDone = assert.async();
	overDone();

	assert.throws( function() {
		overDone();
	}, new RegExp( "Too many calls to the `assert.async` callback" ) );

	done();
} );

QUnit.test( "fails if callback is called more than callback call count", function( assert ) {

	// Having an outer async flow in this test avoids the need to manually modify QUnit internals
	// in order to avoid post-`done` assertions causing additional failures
	var done = assert.async();

	assert.expect( 1 );

	// Duck-punch to force an Error to be thrown instead of a `pushFailure` call
	assert.test.pushFailure = function( msg ) {
		throw new Error( msg );
	};

	var overDone = assert.async( 3 );
	overDone();
	overDone();
	overDone();

	assert.throws( function() {
		overDone();
	}, new RegExp( "Too many calls to the `assert.async` callback" ) );

	done();
} );

( function() {
	var previousTestDone;

	QUnit.test( "errors if callback is called after test - part 1", function( assert ) {
		assert.expect( 0 );
		previousTestDone = assert.async();
		previousTestDone();
	} );

	QUnit.test( "errors if callback is called after test - part 2", function( assert ) {
		assert.throws( previousTestDone, /assert.async callback called after test finished./ );
	} );
}() );

QUnit.module( "assert.async in module hooks", {
	before: asyncCallback,
	beforeEach: asyncCallback,
	afterEach: asyncCallback,
	after: asyncCallback
} );

QUnit.test( "calls in all hooks", function( assert ) {
	assert.expect( 5 );
	asyncCallback( assert );
} );

QUnit.module( "assert.async fails if callback is called more than once in", {
	before: function( assert ) {

		// Having an outer async flow in this test avoids the need to manually modify QUnit
		// internals in order to avoid post-`done` assertions causing additional failures
		var done = assert.async();

		assert.expect( 1 );

		// Duck-punch to force an Error to be thrown instead of a `pushFailure` call
		assert.test.pushFailure = function( msg ) {
			throw new Error( msg );
		};

		var overDone = assert.async();
		overDone();

		assert.throws( function() {
			overDone();
		}, new RegExp( "Too many calls to the `assert.async` callback" ) );

		done();
	}
} );

QUnit.test( "before", function() {} );

QUnit.module( "assert.async fails if callback is called more than once in", {
	beforeEach: function( assert ) {

		// Having an outer async flow in this test avoids the need to manually modify QUnit
		// internals in order to avoid post-`done` assertions causing additional failures
		var done = assert.async();

		assert.expect( 1 );

		// Duck-punch to force an Error to be thrown instead of a `pushFailure` call
		assert.test.pushFailure = function( msg ) {
			throw new Error( msg );
		};

		var overDone = assert.async();
		overDone();

		assert.throws( function() {
			overDone();
		}, new RegExp( "Too many calls to the `assert.async` callback" ) );

		done();
	}
} );

QUnit.test( "beforeEach", function() { } );

QUnit.module( "assert.async fails if callback is called more than once in", {
	afterEach: function( assert ) {

		// Having an outer async flow in this test avoids the need to manually modify QUnit
		// internals in order to avoid post-`done` assertions causing additional failures
		var done = assert.async();

		assert.expect( 1 );

		// Duck-punch to force an Error to be thrown instead of a `pushFailure` call
		assert.test.pushFailure = function( msg ) {
			throw new Error( msg );
		};

		var overDone = assert.async();
		overDone();

		assert.throws( function() {
			overDone();
		}, new RegExp( "Too many calls to the `assert.async` callback" ) );

		done();
	}
} );

QUnit.test( "afterEach", function() { } );

QUnit.module( "assert.async fails if callback is called more than once in", {
	after: function( assert ) {

		// Having an outer async flow in this test avoids the need to manually modify QUnit
		// internals in order to avoid post-`done` assertions causing additional failures
		var done = assert.async();

		assert.expect( 1 );

		// Duck-punch to force an Error to be thrown instead of a `pushFailure` call
		assert.test.pushFailure = function( msg ) {
			throw new Error( msg );
		};

		var overDone = assert.async();
		overDone();

		assert.throws( function() {
			overDone();
		}, new RegExp( "Too many calls to the `assert.async` callback" ) );

		done();
	}
} );

QUnit.test( "after", function() {} );

QUnit.module( "assert.async in before", {
	before: function( assert ) {
		var done = assert.async(),
			testContext = this;
		setTimeout( function() {
			testContext.state = "before";
			done();
		} );
	}
} );

QUnit.test( "before synchronized", function( assert ) {
	assert.expect( 1 );
	assert.equal( this.state, "before", "before synchronized before test callback was " +
		"executed" );
} );

QUnit.module( "assert.async in beforeEach", {
	beforeEach: function( assert ) {
		var done = assert.async(),
			testContext = this;
		setTimeout( function() {
			testContext.state = "beforeEach";
			done();
		} );
	}
} );

QUnit.test( "beforeEach synchronized", function( assert ) {
	assert.expect( 1 );
	assert.equal( this.state, "beforeEach", "beforeEach synchronized before test callback was " +
		"executed" );
} );

QUnit.module( "assert.async before afterEach", {
	afterEach: function( assert ) {
		assert.equal( this.state, "done", "test callback synchronized before afterEach was " +
			"executed" );
	}
} );

QUnit.test( "afterEach will synchronize", function( assert ) {
	assert.expect( 1 );
	var done = assert.async(),
		testContext = this;
	setTimeout( function() {
		testContext.state = "done";
		done();
	} );
} );

QUnit.module( "assert.async in afterEach", {
	afterEach: function( assert ) {
		var done = assert.async();
		setTimeout( function() {
			assert.ok( true, "afterEach synchronized before test was finished" );
			done();
		} );
	}
} );

QUnit.test( "afterEach will synchronize", function( assert ) {
	assert.expect( 1 );
} );

QUnit.module( "assert.async before after", {
	after: function( assert ) {
		assert.equal( this.state, "done", "test callback synchronized before after was " +
			"executed" );
	}
} );

QUnit.test( "after will synchronize", function( assert ) {
	assert.expect( 1 );
	var done = assert.async(),
		testContext = this;
	setTimeout( function() {
		testContext.state = "done";
		done();
	} );
} );

QUnit.module( "assert.async in after", {
	after: function( assert ) {
		var done = assert.async();
		setTimeout( function() {
			assert.ok( true, "after synchronized before test was finished" );
			done();
		} );
	}
} );

QUnit.test( "after will synchronize", function( assert ) {
	assert.expect( 1 );
} );

QUnit.module( "assert.async callback event loop timing" );

QUnit.test( "`done` can be called synchronously", function( assert ) {
	var done;

	assert.expect( 1 );
	done = assert.async();

	assert.ok( true );
	done();
} );

QUnit.test( "sole `done` is called last", function( assert ) {
	var done;

	assert.expect( 1 );
	done = assert.async();
	setTimeout( function() {
		assert.ok( true, "should pass if called before `done`" );
		done();
	} );
} );

QUnit.test( "multiple `done` calls, no assertions after final `done`", function( assert ) {
	var done1, done2;

	assert.expect( 2 );
	done1 = assert.async();
	done2 = assert.async();
	setTimeout( function() {
		done1();
		assert.ok( true, "should pass if called after this `done` but before final `done`" );
	} );
	setTimeout( function() {
		assert.ok( true, "should pass if called before final `done`" );
		done2();
	} );
} );

QUnit.module( "assertions after final assert.async callback", {
	before: function( assert ) {
		assert.async()();
		assert.ok( true, "before" );
	},

	beforeEach: function( assert ) {
		assert.async()();
		assert.ok( true, "beforeEach" );
	},

	afterEach: function( assert ) {
		assert.async()();
		assert.ok( true, "afterEach" );
	},

	after: function( assert ) {
		assert.async()();
		assert.ok( true, "after" );
	}
} );

QUnit.test( "in any hook still pass", function( assert ) {
	assert.expect( 5 );
	assert.ok( true, "test callback" );
} );
