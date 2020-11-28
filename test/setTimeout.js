( function( globalThis ) {

	QUnit.module( "Support mocked setTimeout", {
		beforeEach: function() {
			this.setTimeout = globalThis.setTimeout;
			globalThis.setTimeout = function() {};
		},

		afterEach: function() {
			globalThis.setTimeout = this.setTimeout;
		}
	} );

	QUnit.test( "test one", function( assert ) {
		assert.true( true );
	} );

	QUnit.test( "test two", function( assert ) {
		assert.true( true );
	} );

}( ( function() {
	return this;
}() ) ) );
