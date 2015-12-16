QUnit.module( "Test call count - first case" );
QUnit[ window.sessionStorage ? "test" : "skip" ](
	"does not skip tests after reordering",
	function( assert ) {
		assert.equal( window.totalCount, 3 );
	}
);
