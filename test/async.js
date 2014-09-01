var globalStartError = {},
	globalStopError = {};

QUnit.begin(function() {

	// TODO: This setTimeout won't be necessary when Issue #659 is resolved
	setTimeout(function() {
		try {
			QUnit.start();
		}
		catch ( thrownError ) {
			globalStartError = thrownError;
		}
	}, 13);
});

try {
	QUnit.stop();
}
catch ( thrownError ) {
	globalStopError = thrownError;
}

QUnit.module( "global start/stop errors" );

QUnit.test( "Calling start() when already started should throw Error", function( assert ) {
	assert.expect( 1 );

	// TODO: This test won't need to be asynchronous when Issue #659 is resolved
	var done = assert.async();
	setTimeout(function() {
		assert.equal( globalStartError.message, "Called start() outside of a test context while already started" );
		done();
	}, 13);
});

QUnit.test( "Calling stop() outside of test context should throw Error", function( assert ) {
	assert.expect( 1 );
	assert.equal( globalStopError.message, "Called stop() outside of a test context" );
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
	});
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
		throw new Error( msg );
	};

	assert.throws(function() {
		var done = assert.async();
		done();
		done();
	});
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
