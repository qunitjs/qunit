/*global totalCount1, totalCount2 */

QUnit.module( "Test call count" );
// Then
QUnit.test( "should be success", function( assert ) {
    assert.equal( totalCount1, 3 );
    assert.equal( totalCount2, 2 );
});
