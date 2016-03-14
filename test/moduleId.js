QUnit.config.moduleId = [ "720ab266", "0af5a573" ];

QUnit.module( "QUnit.config.moduleId.foo" );

QUnit.test( "foo test should be run", function( assert ) {
	assert.ok( true, "foo test should be run" );
} );

QUnit.module( "QUnit.config.moduleId.bar" );

QUnit.test( "bar test should be run", function( assert ) {
	assert.ok( true, "bar test should be run" );
} );

QUnit.module( "QUnit.config.moduleId.foobar" );

QUnit.test( "foobar test should not be run", function( assert ) {
	assert.ok( false, "foobar test should not be run" );
} );
