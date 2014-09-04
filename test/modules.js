QUnit.module( "setup/teardown", {
	setup: function() {
		this.lastHook = "module-setup";
	},
	teardown: function( assert ) {
		assert.strictEqual( this.lastHook, "test-block", "Module's teardown runs after current test block" );
	}
});

QUnit.test( "hooks order", function( assert ) {
	assert.expect( 2 );

	assert.strictEqual( this.lastHook, "module-setup", "Module's setup runs before current test block" );
	this.lastHook = "test-block";
});

QUnit.module( "Test context object", {
	setup: function( assert ) {
		var key,
			keys = [];

		for ( key in this ) {
			keys.push( key );
		}
		assert.deepEqual( keys, [ "helper", "otherHelper" ] );
	},
	teardown: function( assert ) {
		var key,
			keys = [];

		for ( key in this ) {
			keys.push( key );
		}
		assert.deepEqual( keys, [ "helper", "otherHelper" ] );
	},
	helper: function() {},
	otherHelper: "foo"
});

QUnit.test( "keys", function( assert ) {
	var key,
		keys = [];

	assert.expect( 3 );
	for ( key in this ) {
		keys.push( key );
	}
	assert.deepEqual( keys, [ "helper", "otherHelper" ] );
});

QUnit.module( "teardown and QUnit.stop", {
	setup: function() {
		this.state = false;
	},
	teardown: function( assert ) {
		assert.strictEqual( this.state, true, "Test teardown." );
	}
});

QUnit.test( "teardown must be called after test ended", function( assert ) {
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

QUnit.module( "async setup test", {
	setup: function( assert ) {
		QUnit.stop();
		setTimeout(function() {
			assert.ok( true );
			QUnit.start();
		}, 500 );
	}
});

QUnit.asyncTest( "module with async setup", function( assert ) {
	assert.expect( 2 );
	assert.ok( true );
	QUnit.start();
});

QUnit.module( "async teardown test", {
	teardown: function( assert ) {
		QUnit.stop();
		setTimeout(function() {
			assert.ok( true );
			QUnit.start();
		}, 500 );
	}
});

QUnit.asyncTest( "module with async teardown", function( assert ) {
	assert.expect( 2 );
	assert.ok( true );
	QUnit.start();
});

QUnit.module( "save scope", {
	setup: function() {
		this.foo = "bar";
	},
	teardown: function( assert ) {
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
