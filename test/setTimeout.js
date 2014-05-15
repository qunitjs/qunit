QUnit.config.updateRate = 1;

QUnit.module( "Module that mucks with time", {
	setup: function() {
		this.setTimeout = window.setTimeout;
		window.setTimeout = function() {};
	},

	teardown: function() {
		window.setTimeout = this.setTimeout;
	}
});

QUnit.test( "just a test", function( assert ) {
	assert.ok( true );
});

QUnit.test( "just a test", function( assert ) {
	assert.ok( true );
});
