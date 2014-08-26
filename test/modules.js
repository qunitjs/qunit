// Before and after each tests
QUnit.config.beforeEach = function() {
	this.mySetup = true;
};

QUnit.config.afterEach = function( assert ) {
	if ( this.afterTest ) {
		assert.ok( true );
		this.afterTest = false;
	}

	if ( this.contextTest ) {
		assert.ok( true );
		this.contextTest = false;
	}
};

QUnit.module( "beforeEach/afterEach", {
	beforeEach: function( assert ) {
		assert.ok( true, "beforeEach allow assertions inside" );
		this.myModuleSetup = true;
	},
	afterEach: function( assert ) {
		if ( this.moduleAfterTest ) {
			assert.ok( true );
			this.moduleAfterTest = false;
		}
	}
});

QUnit.test( "before", function( assert ) {
	assert.expect( 3 );
	assert.ok( this.mySetup, "global beforeEach method" );
	assert.ok( this.myModuleSetup, "module's afterEach method" );
});

QUnit.test( "after", function( assert ) {
	assert.expect( 3 );

	// This will trigger an assertion on the global afterEach
	this.afterTest = true;

	// This will trigger an assertion on the module's afterEach
	this.moduleAfterTest = true;
});

QUnit.module( "Test context object", {
	beforeEach: function( assert ) {
		var key,
			keys = [];

		for ( key in this ) {
			keys.push( key );
		}
		assert.deepEqual( keys, [ "helper", "mySetup" ] );
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
