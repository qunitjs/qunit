QUnit.test( "expect query and multiple issue", function( assert ) {
	assert.expect( 2 );
	assert.ok( true );
	var expected = assert.expect();
	assert.equal( expected, 2 );
	assert.expect( expected + 1 );
	assert.ok( true );
});

if ( typeof document !== "undefined" ) {

QUnit.module( "fixture" );

QUnit.test( "setup", function( assert ) {
	assert.expect( 0 );
	document.getElementById( "qunit-fixture" ).innerHTML = "foobar";
});

QUnit.test( "basics", function( assert ) {
	assert.equal(
		document.getElementById( "qunit-fixture" ).innerHTML,
		"test markup",
		"automatically reset"
	);
});

}

QUnit.module( "custom assertions" );

QUnit.assert.mod2 = function( value, expected, message ) {
	var actual = value % 2;
	this.push( actual === expected, actual, expected, message );
};

QUnit.test( "mod2", function( assert ) {
	assert.expect( 2 );

	assert.mod2( 2, 0, "2 % 2 == 0" );
	assert.mod2( 3, 1, "3 % 2 == 1" );
});

QUnit.module( "QUnit.skip", {
	beforeEach: function( assert ) {

		// skip test hooks for skipped tests
		assert.ok( false, "skipped function" );
		throw "Error";
	},
	afterEach: function( assert ) {
		assert.ok( false, "skipped function" );
		throw "Error";
	}
});

QUnit.skip( "test blocks are skipped", function( assert ) {

	// this test callback won't run, even with broken code
	assert.expect( 1000 );
	throw "Error";
});

QUnit.skip( "no function" );
