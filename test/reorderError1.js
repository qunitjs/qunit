QUnit.module( "Test call count" );
QUnit.test( "should be success", function( assert ) {
	if ( window.sessionStorage ) {
		assert.equal( window.totalCount, 3 );
	} else {
		assert.ok(true);
	}
});
