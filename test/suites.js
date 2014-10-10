(function( suite, test, beforeEach, afterEach ) {
	var testEnv, previousTestEnv,
		expectedSuiteMeta = {
			root: {
				name: "",
				fullName: "",
				depth: 0
			},
			level1: {
				name: "level1",
				fullName: "level1",
				depth: 1
			},
			level2: {
				name: "level2",
				fullName: "level1 level2",
				depth: 2
			}
		};

	beforeEach(function( assert ) {
		previousTestEnv = testEnv;
		testEnv = this;
		assert.deepEqual(
			assert.suite,
			expectedSuiteMeta.root,
			"During the root suite's beforeEach, assert.suite represents the root suite"
		);
		assert.notEqual( testEnv, previousTestEnv, "Using a different testEnvironment from the last test (if any)" );
	});

	test( "test1", function( assert ) {
		assert.expect( 6 );
		assert.deepEqual(
			assert.suite,
			expectedSuiteMeta.root,
			"During the root suite's pre-nesting test callback, assert.suite represents the root suite"
		);
		assert.strictEqual( this, testEnv, "Still using the same testEnvironment" );
	});

	suite( "level1", function() {
		beforeEach(function( assert ) {
			assert.deepEqual(
				assert.suite,
				expectedSuiteMeta.level1,
				"During the level1 suite's beforeEach, assert.suite represents the level1 suite"
			);
			assert.strictEqual( this, testEnv, "Still using the same testEnvironment" );
	});

		test( "test2", function( assert ) {
			assert.expect( 10 );
			assert.deepEqual(
				assert.suite,
				expectedSuiteMeta.level1,
				"During the level1 suite's pre-nesting test callback, assert.suite represents the level1 suite"
			);
			assert.strictEqual( this, testEnv, "Still using the same testEnvironment" );
		});

		suite( "level2", function() {
			beforeEach(function( assert ) {
				assert.deepEqual(
					assert.suite,
					expectedSuiteMeta.level2,
					"During the level2 suite's beforeEach, assert.suite represents the level2 suite"
				);
				assert.strictEqual( this, testEnv, "Still using the same testEnvironment" );
			});

			test( "test3", function( assert ) {
				assert.expect( 14 );
				assert.deepEqual(
					assert.suite,
					expectedSuiteMeta.level2,
					"During the level2 suite's first test callback, assert.suite represents the level2 suite"
				);
				assert.strictEqual( this, testEnv, "Still using the same testEnvironment" );
			});
			test( "test4", function( assert ) {
				assert.expect( 14 );
				assert.deepEqual(
					assert.suite,
					expectedSuiteMeta.level2,
					"During the level2 suite's last test callback, assert.suite represents the level2 suite"
				);
				assert.strictEqual( this, testEnv, "Still using the same testEnvironment" );
			});

			afterEach(function( assert ) {
				assert.deepEqual(
					assert.suite,
					expectedSuiteMeta.level2,
					"During the level2 suite's afterEach, assert.suite represents the level2 suite"
				);
				assert.strictEqual( this, testEnv, "Still using the same testEnvironment" );
			});
		});

		test( "test5", function( assert ) {
			assert.expect( 10 );
			assert.deepEqual(
				assert.suite,
				expectedSuiteMeta.level1,
				"During the level1 suite's post-nesting test callback, assert.suite represents the level1 suite"
			);
			assert.strictEqual( this, testEnv, "Still using the same testEnvironment" );
		});

		afterEach(function( assert ) {
			assert.deepEqual(
				assert.suite,
				expectedSuiteMeta.level1,
				"During the level1 suite's afterEach, assert.suite represents the level1 suite"
			);
			assert.strictEqual( this, testEnv, "Still using the same testEnvironment" );
		});
	});

	test( "test6", function( assert ) {
		assert.expect( 6 );
		assert.deepEqual(
			assert.suite,
			expectedSuiteMeta.root,
			"During the root suite's post-nesting test callback, assert.suite represents the root suite"
		);
		assert.strictEqual( this, testEnv, "Still using the same testEnvironment" );
	});

	afterEach(function( assert ) {
		assert.deepEqual(
			assert.suite,
			expectedSuiteMeta.root,
			"During the root suite's afterEach, assert.suite represents the root suite"
		);
		assert.strictEqual( this, testEnv, "Still using the same testEnvironment" );
	});

})( QUnit.suite, QUnit.test, QUnit.beforeEach, QUnit.afterEach );
