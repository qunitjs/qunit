QUnit.test( "expect query and multiple issue", function( assert ) {
	assert.expect( 2 );
	assert.ok( true );
	var expected = assert.expect();
	assert.equal( expected, 2 );
	assert.expect( expected + 1 );
	assert.ok( true );
} );

if ( typeof document !== "undefined" ) {

QUnit.module( "fixture", function( hooks ) {
	var failure = false,
		values = [ /* initial value (see unshift below), */ "<b>ar</b>", undefined ],
		originalValue;

	hooks.before( function() {
		originalValue = QUnit.config.fixture;
		values.unshift( originalValue );
	} );

	// Set QUnit.config.fixture for the next test, propagating failures to recover the sequence
	hooks.afterEach( function( assert ) {
		if ( failure ) {
			assert.ok( false, "prior failure" );
			QUnit.config.fixture = originalValue;
		} else {
			QUnit.config.fixture = values.shift();
		}
	} );

	QUnit.test( "setup", function( assert ) {
		document.getElementById( "qunit-fixture" ).innerHTML = "foo";
		assert.equal( values.length, 3, "proper sequence" );
		failure = failure || values.length !== 3;
	} );

	QUnit.test( "automatically reset", function( assert ) {
		var contents = document.getElementById( "qunit-fixture" ).innerHTML;
		assert.equal( contents, originalValue );
		assert.equal( values.length, 2, "proper sequence" );
		failure = failure || values.length !== 2 || contents !== originalValue;
	} );

	QUnit.test( "user-specified", function( assert ) {
		var contents = document.getElementById( "qunit-fixture" ).innerHTML;
		document.getElementById( "qunit-fixture" ).innerHTML = "baz";
		assert.equal( contents, "<b>ar</b>" );
		assert.equal( values.length, 1, "proper sequence" );
		failure = failure || values.length !== 1 || contents !== "<b>ar</b>";
	} );

	QUnit.test( "disabled", function( assert ) {
		var contents = document.getElementById( "qunit-fixture" ).innerHTML;
		assert.equal( contents, "baz" );
		assert.equal( values.length, 0, "proper sequence" );
		failure = failure || values.length !== 0 || contents !== "baz";
	} );
} );

}

QUnit.module( "custom assertions" );

QUnit.assert.mod2 = function( value, expected, message ) {
	var actual = value % 2;
	this.pushResult( {
		result: actual === expected,
		actual: actual,
		expected: expected,
		message: message
	} );
};

QUnit.assert.testForPush = function( value, expected, message ) {
	this.push( true, value, expected, message, false );
};

QUnit.test( "mod2", function( assert ) {
	assert.expect( 2 );

	assert.mod2( 2, 0, "2 % 2 == 0" );
	assert.mod2( 3, 1, "3 % 2 == 1" );
} );

QUnit.test( "testForPush", function( assert ) {
	assert.expect( 6 );

	QUnit.log( function( detail ) {
		if ( detail.message === "should be call pushResult" ) {
			assert.equal( detail.result, true );
			assert.equal( detail.actual, 1 );
			assert.equal( detail.expected, 1 );
			assert.equal( detail.message, "should be call pushResult" );
			assert.equal( detail.negative, false );
		}
	} );
	assert.testForPush( 1, 1, "should be call pushResult" );
} );

QUnit.module( "QUnit.skip", {
	beforeEach: function( assert ) {

		// Skip test hooks for skipped tests
		assert.ok( false, "skipped function" );
		throw "Error";
	},
	afterEach: function( assert ) {
		assert.ok( false, "skipped function" );
		throw "Error";
	}
} );

QUnit.skip( "test blocks are skipped", function( assert ) {

	// This test callback won't run, even with broken code
	assert.expect( 1000 );
	throw "Error";
} );

QUnit.skip( "no function" );
