QUnit.config.module = "Foo";

QUnit.module( "Foo" );

QUnit.test( "Foo test should be run", function( assert ) {
  assert.ok( true, "Foo test should be run" );
} );

QUnit.module( "foo" );

QUnit.test( "foo test should be run", function( assert ) {
  assert.ok( true, "foo test should be run" );
} );

QUnit.module( "Bar" );

QUnit.test( "Bar test should not be run", function( assert ) {
  assert.ok( false, "Bar test should not be run" );
} );

QUnit.module( "Foo Bar" );

QUnit.test( "Foo Bar test should not be run", function( assert ) {
  assert.ok( false, "Foo Bar test should not be run" );
} );

QUnit.module( "Foo", function() {
  QUnit.module( "Bar", function() {
    QUnit.test( "Bar submodule test should run", function( assert ) {
      assert.ok( true, "Bar submodule test should run" );
    } );
  } );

  QUnit.module( "Boo", function() {
    QUnit.test( "Boo submodule test should run", function( assert ) {
      assert.ok( true, "Boo submodule test should run" );
    } );
  } );
} );

QUnit.module( "Bar", function() {
  QUnit.module( "Foo", function() {
    QUnit.test( "Foo submodule test should not run", function( assert ) {
      assert.ok( false, "Foo submodule test should not run" );
    } );
  } );

  QUnit.module( "Boo", function() {
    QUnit.test( "Boo submodule test should not run", function( assert ) {
      assert.ok( false, "Boo submodule test should not run" );
    } );
  } );
} );
