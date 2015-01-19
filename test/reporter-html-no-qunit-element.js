(function() {

QUnit.module( "reporter-html-no-qunit-element");

QUnit.test( "reporter/html when no qunit element present", function( assert ) {
	assert.expect( 1 );
    assert.ok(true);
});

})();
