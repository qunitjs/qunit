QUnit.module( "beforeEach/afterEach", {
	beforeEach: function() {
		this.lastHook = "module-beforeEach";
	},
	afterEach: function( assert ) {
		if ( this.hooksTest ) {
			assert.strictEqual( this.lastHook, "test-block",
				"Module's afterEach runs after current test block" );
			this.lastHook = "module-afterEach";
		}
	}
});

QUnit.test( "hooks order", function( assert ) {
	assert.expect( 2 );

	// This will trigger an assertion on the global and one on the module's afterEach
	this.hooksTest = true;

	assert.strictEqual( this.lastHook, "module-beforeEach",
		"Module's beforeEach runs before current test block" );
	this.lastHook = "test-block";
});

QUnit.module( "Test context object", {
	beforeEach: function( assert ) {
		var key,
			keys = [];

		for ( key in this ) {
			keys.push( key );
		}
		assert.deepEqual( keys, [ "helper" ] );
	},
	afterEach: function() {},
	helper: function() {}
});

QUnit.test( "keys", function( assert ) {
	assert.expect( 1 );
	this.contextTest = true;
});

QUnit.module( "afterEach and QUnit.stop", {
	beforeEach: function() {
		this.state = false;
	},
	afterEach: function( assert ) {
		assert.strictEqual( this.state, true, "Test afterEach." );
	}
});

QUnit.test( "afterEach must be called after test ended", function( assert ) {
	var testContext = this;
	assert.expect( 1 );
	QUnit.stop();
	setTimeout(function() {
		testContext.state = true;
		QUnit.start();
	});
});

QUnit.test( "parameter passed to stop increments semaphore n times", function( assert ) {
	var testContext = this;
	assert.expect( 1 );
	QUnit.stop( 3 );
	setTimeout(function() {
		QUnit.start();
		QUnit.start();
	});
	setTimeout(function() {
		testContext.state = true;
		QUnit.start();
	}, 1 );
});

QUnit.test( "parameter passed to start decrements semaphore n times", function( assert ) {
	var testContext = this;
	assert.expect( 1 );
	QUnit.stop();
	QUnit.stop();
	QUnit.stop();
	setTimeout(function() {
		testContext.state = true;
		QUnit.start( 3 );
	});
});

QUnit.module( "async beforeEach test", {
	beforeEach: function( assert ) {
		QUnit.stop();
		setTimeout(function() {
			assert.ok( true );
			QUnit.start();
		});
	}
});

QUnit.asyncTest( "module with async beforeEach", function( assert ) {
	assert.expect( 2 );
	assert.ok( true );
	QUnit.start();
});

QUnit.module( "async afterEach test", {
	afterEach: function( assert ) {
		QUnit.stop();
		setTimeout(function() {
			assert.ok( true );
			QUnit.start();
		});
	}
});

QUnit.asyncTest( "module with async afterEach", function( assert ) {
	assert.expect( 2 );
	assert.ok( true );
	QUnit.start();
});

QUnit.module( "save scope", {
	foo: "foo",
	beforeEach: function( assert ) {
		assert.deepEqual( this.foo, "foo" );
		this.foo = "bar";
	},
	afterEach: function( assert ) {
		assert.deepEqual( this.foo, "foobar" );
	}
});

QUnit.test( "scope check", function( assert ) {
	assert.expect( 3 );
	assert.deepEqual( this.foo, "bar" );
	this.foo = "foobar";
});

QUnit.module( "Deprecated setup/teardown", {
	setup: function() {
		this.deprecatedSetup = true;
	},
	teardown: function( assert ) {
		assert.ok( this.deprecatedSetup );
	}
});

QUnit.test( "before/after order", function( assert ) {
	assert.expect( 1 );
});
