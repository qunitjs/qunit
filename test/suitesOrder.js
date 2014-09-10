var execHistoryCopy,
	execHistory = [];

(function( suite, test, beforeEach, afterEach ) {

	beforeEach(function( assert ) {
		execHistory.push( assert.suite.fullName + ".beforeEach1" );
	});
	beforeEach(function( assert ) {
		execHistory.push( assert.suite.fullName + ".beforeEach2" );
	});

	test( "test1", function( assert ) {
		assert.expect( 0 );
		execHistory.push( assert.suite.fullName + " -> test1.callback" );
	});

	suite( "level1", function() {
		beforeEach(function( assert ) {
			execHistory.push( assert.suite.fullName + ".beforeEach1" );
		});
		beforeEach(function( assert ) {
			execHistory.push( assert.suite.fullName + ".beforeEach2" );
		});

		test( "test2", function( assert ) {
			assert.expect( 0 );
			execHistory.push( assert.suite.fullName + " -> test2.callback" );
		});

		suite( "level2", function() {
			beforeEach(function( assert ) {
				execHistory.push( assert.suite.fullName + ".beforeEach1" );
			});
			beforeEach(function( assert ) {
				execHistory.push( assert.suite.fullName + ".beforeEach2" );
			});

			test( "test3", function( assert ) {
				assert.expect( 0 );
				execHistory.push( assert.suite.fullName + " -> test3.callback" );
			});
			test( "test4", function( assert ) {
				assert.expect( 0 );
				execHistory.push( assert.suite.fullName + " -> test4.callback" );
			});

			afterEach(function( assert ) {
				execHistory.push( assert.suite.fullName + ".afterEach1" );
			});
			afterEach(function( assert ) {
				execHistory.push( assert.suite.fullName + ".afterEach2" );
			});
		});

		test( "test5", function( assert ) {
			assert.expect( 0 );
			execHistory.push( assert.suite.fullName + " -> test5.callback" );
		});

		afterEach(function( assert ) {
			execHistory.push( assert.suite.fullName + ".afterEach1" );
		});
		afterEach(function( assert ) {
			execHistory.push( assert.suite.fullName + ".afterEach2" );
		});
	});

	test( "test6", function( assert ) {
		assert.expect( 0 );
		execHistory.push( assert.suite.fullName + " -> test6.callback" );
	});

	afterEach(function( assert ) {
		execHistory.push( assert.suite.fullName + ".afterEach1" );
	});
	afterEach(function( assert ) {
		execHistory.push( assert.suite.fullName + ".afterEach2" );
	});

})( QUnit.suite, QUnit.test, QUnit.beforeEach, QUnit.afterEach );

QUnit.module( "suites", {
	beforeEach: function() {
		if ( !execHistoryCopy ) {

			// Remove two global/root suite's `beforeEach` entries triggered by this `QUnit.module` call
			execHistoryCopy = execHistory.slice( 0, -2 );
			execHistory.length = 0;
		}
	}
});

QUnit.test( "hierarchical suite contexts executed in expected order", function( assert ) {
	assert.expect( 1 );
	assert.deepEqual(
		execHistoryCopy,
		[
			// Entries without a suite name prefix are defined at the level of the root suite
			".beforeEach1",
			".beforeEach2",
			" -> test1.callback",
			".afterEach1",
			".afterEach2",
			".beforeEach1",
			".beforeEach2",
			"level1.beforeEach1",
			"level1.beforeEach2",
			"level1 -> test2.callback",
			"level1.afterEach1",
			"level1.afterEach2",
			".afterEach1",
			".afterEach2",
			".beforeEach1",
			".beforeEach2",
			"level1.beforeEach1",
			"level1.beforeEach2",
			"level1 level2.beforeEach1",
			"level1 level2.beforeEach2",
			"level1 level2 -> test3.callback",
			"level1 level2.afterEach1",
			"level1 level2.afterEach2",
			"level1.afterEach1",
			"level1.afterEach2",
			".afterEach1",
			".afterEach2",
			".beforeEach1",
			".beforeEach2",
			"level1.beforeEach1",
			"level1.beforeEach2",
			"level1 level2.beforeEach1",
			"level1 level2.beforeEach2",
			"level1 level2 -> test4.callback",
			"level1 level2.afterEach1",
			"level1 level2.afterEach2",
			"level1.afterEach1",
			"level1.afterEach2",
			".afterEach1",
			".afterEach2",
			".beforeEach1",
			".beforeEach2",
			"level1.beforeEach1",
			"level1.beforeEach2",
			"level1 -> test5.callback",
			"level1.afterEach1",
			"level1.afterEach2",
			".afterEach1",
			".afterEach2",
			".beforeEach1",
			".beforeEach2",
			" -> test6.callback",
			".afterEach1",
			".afterEach2"
		],
		"Should verify execution order"
	);
});
