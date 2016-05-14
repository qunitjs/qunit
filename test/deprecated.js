/*globals global: false */

var originalWarn = console.warn,
	warnings = [],
	upgradeGuide =
			/Details in our upgrade guide at https\:\/\/qunitjs\.com\/upgrade-guide-2\.x/;

// Autorun should't prevent the tests to run
QUnit.config.autorun = false;

// Duck punch console.warn
console.warn = function( arg ) {
	warnings.push( arg );
};

QUnit.done( function() {
	console.warn = originalWarn;
} );

QUnit.module( "setup+teardown", {
		setup: 42,
		teardown: 42
	},
	function() {
		QUnit.test( "not deleted", function( assert ) {
			assert.equal( this.setup, 42 );
			assert.equal( this.teardown, 42 );
		} );

		QUnit.test( "warned", function( assert ) {
			assert.equal( warnings.length, 1, "warned once for setup+teardown" );
			assert.ok(
				upgradeGuide.test( warnings.pop() ),
				"warning contains link to upgrade guide"
			);
		} );
	}
);

QUnit.test( "QUnit.reset", function( assert ) {
	assert.throws( function() {
		QUnit.reset();
	}, upgradeGuide );
} );

QUnit.test( "setting QUnit.reset", function( assert ) {
	assert.throws( function() {
		QUnit.reset = function() {};
	}, upgradeGuide );
} );

QUnit.test( "throws with string expected value", function( assert ) {
	assert.throws( function() {
		assert.throws( function() {
			throw "This is not called";
		}, "foo", "bar" );
	}, upgradeGuide );
} );

QUnit.test( "QUnit.asyncTest", function( assert ) {
	assert.throws( function() {
		QUnit.asyncTest();
	}, upgradeGuide );
} );

QUnit.test( "QUnit.stop", function( assert ) {
	assert.throws( function() {
		QUnit.stop();
	}, upgradeGuide );

	assert.throws( function() {
		QUnit.stop();
	}, /QUnit\.stop/ );

	assert.throws( function() {
		QUnit.stop();
	}, /use QUnit\.test\(\) with assert\.async\(\) instead\./ );
} );

QUnit.test( "QUnit.start inside text context", function( assert ) {
	assert.throws( function() {
		QUnit.start();
	}, upgradeGuide );

	assert.throws( function() {
		QUnit.start();
	}, /QUnit\.start/ );

	assert.throws( function() {
		QUnit.start();
	}, /use QUnit\.test\(\) with assert\.async\(\) instead\./ );
} );

QUnit[ typeof window !== "undefined" ? "test" : "skip" ]( "QUnit.init", function( assert ) {
	assert.throws( function() {
		QUnit.init();
	}, upgradeGuide );
} );

QUnit[ typeof window !== "undefined" ? "test" : "skip" ]( "globals", function( assert ) {
	var globals = [
		"test",
		"module",
		"expect",
		"start",
		"ok",
		"notOk",
		"equal",
		"notEqual",
		"propEqual",
		"notPropEqual",
		"deepEqual",
		"notDeepEqual",
		"strictEqual",
		"notStrictEqual",
		"throws",
		"raises"
	];

	globals.forEach( function( item ) {
		assert.throws( function() {
			( window || global )[ item ]();
		}, upgradeGuide );
	} );
} );

QUnit.test( "assertions on QUnit namespace", function( assert ) {
	var assertions = [
		"expect",
		"ok",
		"notOk",
		"equal",
		"notEqual",
		"propEqual",
		"notPropEqual",
		"deepEqual",
		"notDeepEqual",
		"strictEqual",
		"notStrictEqual",
		"throws",
		"raises"
	];

	assertions.forEach( function( item ) {
		assert.throws( function() {
			QUnit[ item ]();
		}, upgradeGuide );
	} );
} );
