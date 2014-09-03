// Before and after each tests
QUnit.config.beforeEach = function() {
	this.lastHook = "global-beforeEach";
};

QUnit.config.afterEach = function( assert ) {
	if ( this.hooksTest ) {
		assert.strictEqual( this.lastHook, "module-afterEach", "Global afterEach runs after module's afterEach" );
		this.hooksTest = false;
	}

	if ( this.contextTest ) {
		assert.ok( true );
		this.contextTest = false;
	}
};

QUnit.module( "beforeEach/afterEach", {
	beforeEach: function( assert ) {
		assert.strictEqual( this.lastHook, "global-beforeEach", "Global beforeEach runs before module's beforeEach" );
		this.lastHook = "module-beforeEach";
	},
	afterEach: function( assert ) {
		if ( this.hooksTest ) {
			assert.strictEqual( this.lastHook, "test-block", "Module's afterEach runs after current test block" );
			this.lastHook = "module-afterEach";
		}
	}
});

QUnit.test( "hooks order", function( assert ) {
	assert.expect( 4 );

	// This will trigger an assertion on the global and one on the module's afterEach
	this.hooksTest = true;

	assert.strictEqual( this.lastHook, "module-beforeEach", "Module's beforeEach runs before current test block" );
	this.lastHook = "test-block";
});

QUnit.module( "Test context object", {
	beforeEach: function( assert ) {
		var key,
			keys = [];

		for ( key in this ) {
			keys.push( key );
		}
		assert.deepEqual( keys, [ "helper", "lastHook" ] );
	},
	afterEach: function() {},
	helper: function() {}
});

QUnit.test( "keys", function( assert ) {
	assert.expect( 2 );
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
	}, 13 );
});

QUnit.test( "parameter passed to stop increments semaphore n times", function( assert ) {
	var testContext = this;
	assert.expect( 1 );
	QUnit.stop( 3 );
	setTimeout(function() {
		QUnit.start();
		QUnit.start();
	}, 13 );
	setTimeout(function() {
		testContext.state = true;
		QUnit.start();
	}, 15 );
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
	}, 18 );
});

QUnit.module( "async beforeEach test", {
	beforeEach: function( assert ) {
		QUnit.stop();
		setTimeout(function() {
			assert.ok( true );
			QUnit.start();
		}, 500 );
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
		}, 500 );
	}
});

QUnit.asyncTest( "module with async afterEach", function( assert ) {
	assert.expect( 2 );
	assert.ok( true );
	QUnit.start();
});

QUnit.module( "save scope", {
	beforeEach: function() {
		this.foo = "bar";
	},
	afterEach: function( assert ) {
		assert.deepEqual( this.foo, "bar" );
	}
});

QUnit.test( "scope check", function( assert ) {
	assert.expect( 2 );
	assert.deepEqual( this.foo, "bar" );
});

QUnit.module( "simple testEnvironment setup", {
	foo: "bar",
	// example of meta-data
	bugid: "#5311"
});

QUnit.test( "scope check", function( assert ) {
	assert.deepEqual( this.foo, "bar" );
});

QUnit.test( "modify testEnvironment", function( assert ) {
	assert.expect( 0 );
	this.foo = "hamster";
});

QUnit.test( "testEnvironment reset for next test", function( assert ) {
	assert.deepEqual( this.foo, "bar" );
});

QUnit.module( "testEnvironment with object", {
	options: {
		recipe: "soup",
		ingredients: [ "hamster", "onions" ]
	}
});

QUnit.test( "scope check", function( assert ) {
	assert.deepEqual( this.options, {
		recipe: "soup",
		ingredients: [ "hamster", "onions" ]
	});
});

QUnit.test( "modify testEnvironment", function( assert ) {
	assert.expect( 0 );

	// since we only do a shallow copy, nested children of testEnvironment can be modified
	// and survice
	this.options.ingredients.push( "carrots" );
});

QUnit.test( "testEnvironment reset for next test", function( assert ) {
	assert.deepEqual( this.options, {
		recipe: "soup",
		ingredients: [ "hamster", "onions", "carrots" ]
	}, "Is this a bug or a feature? Could do a deep copy" );
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
