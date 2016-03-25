QUnit.module( "deprecated", {
	beforeEach: function() {
		this.upgradeGuide = /https\:\/\/qunitjs\.com\/upgrade-guide-2\.x/;
	}
}, function() {
	QUnit.module( "setup/teardown", {
			setup: 42,
			teardown: 43
		},
		function() {
			QUnit.test( "not deleted", function( assert ) {
				assert.equal( this.setup, 42 );
				assert.equal( this.teardown, 43 );
			} );
		}
	);

	QUnit.test( "QUnit.asyncTest", function( assert ) {
		assert.throws( function() {
			QUnit.asyncTest();
		}, this.upgradeGuide );
	} );

	QUnit.test( "QUnit.stop", function( assert ) {
		assert.throws( function() {
			QUnit.stop();
		}, this.upgradeGuide );
	} );

	QUnit.test( "QUnit.init", function( assert ) {
		assert.throws( function() {
			QUnit.init();
		}, this.upgradeGuide );
	} );

	QUnit.test( "globals", function( assert ) {
		var globals = [
			"test",
			"module",
			"expect",
			"asyncTest",
			"start",
			"stop",
			"ok",
			"notOk",
			"equal",
			"notEqual",
			"propEqual",
			"notPropEqual",
			"deepEqual",
			"notDeepEqual",
			"strictEqual",
			"notStrictEqual",
			"throws",
			"raises"
		];

		globals.forEach( function( item ) {
			assert.throws( function() {
				item();
			}, this.upgradeGuide );
		} );
	} );

	QUnit.test( "assertions on QUnit namespace", function( assert ) {
		var assertions = [
			"expect",
			"ok",
			"notOk",
			"equal",
			"notEqual",
			"propEqual",
			"notPropEqual",
			"deepEqual",
			"notDeepEqual",
			"strictEqual",
			"notStrictEqual",
			"throws",
			"raises"
		];

		assertions.forEach( function( item ) {
			assert.throws( function() {
				item();
			}, this.upgradeGuide );
		} );
	} );
} );
