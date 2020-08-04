( function( window ) {

	QUnit.module( "Module that mucks with time", {
		beforeEach: function() {
			this.setTimeout = window.setTimeout;
			window.setTimeout = function() {};
		},

		afterEach: function() {
			window.setTimeout = this.setTimeout;
		}
	} );

	QUnit.test( "just a test", function( assert ) {
		assert.true( true );
	} );

	QUnit.test( "just a test", function( assert ) {
		assert.true( true );
	} );

}( ( function() {
	return this;
}() ) ) );
