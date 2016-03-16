QUnit.config.moduleId = [ "720ab266", "0af5a573", "64f7439b", "8fdbddfe" ];

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

QUnit.module( "QUnit.config.moduleId.parentModule1", function() {
  QUnit.module( "Qunit.config.module.parentModule1.module1", function() {
    QUnit.test( "submodule should run", function( assert ) {
      assert.ok( true, "submodule test should run" );
    } );
  } );
  QUnit.module( "Qunit.config.module.parentModule.module2", function() {
    QUnit.test( "submodule should run", function( assert ) {
      assert.ok( true, "submodule test should run" );
    } );
  } );
} );

QUnit.module( "QUnit.config.moduleId.parentModule2", function() {
  QUnit.module( "Qunit.config.module.parentModule2.module1", function() {
    QUnit.test( "submodule should run", function( assert ) {
      assert.ok( true, "submodule test should run" );
    } );
  } );
  QUnit.module( "Qunit.config.module.parentModule.module1", function() {
    QUnit.test( "submodule should not run", function( assert ) {
      assert.ok( false, "submodule test should not run" );
    } );
  } );
} );
