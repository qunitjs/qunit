QUnit.config.seed = "7x9";

var lastTest = "";

QUnit.module( "QUnit.config.seed" );

QUnit.test( "1", function( assert ) {
  assert.equal( lastTest, "2", "runs third" );
  lastTest = "1";
} );

QUnit.test( "2", function( assert ) {
  assert.equal( lastTest, "3", "runs second" );
  lastTest = "2";
} );

QUnit.test( "3", function( assert ) {
  assert.equal( lastTest, "", "runs first" );
  lastTest = "3";
} );

QUnit.test( "4", function( assert ) {
  assert.equal( lastTest, "1", "runs last" );
  lastTest = "4";
} );
