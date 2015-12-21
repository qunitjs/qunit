/*global totalCount */

QUnit.module( "Test call count" );
// Then
QUnit.test( "should be success", function( assert ) {
	if ( window.sessionStorage ) {
	    assert.equal( totalCount, 2 );
	} else {
		assert.ok(true);
	}
});
