var tests = [];

var testsStats = {
	failed: 0, skipped: 0, todo: 0
};

var assertionsStats = {
	passed: 0, failed: 0
};

var done = false;

QUnit.testDone( function( details ) {
	if ( done ) {
		return;
	}

	assertionsStats.passed += details.passed;
	assertionsStats.failed += details.failed;

	if ( details.skipped ) {
		testsStats.skipped++;
	}

	if ( details.todo ) {
		testsStats.todo++;
	}

	if ( details.failed > 0 && !details.todo ) {
		testsStats.failed++;
	}

	tests.push( {
		name: details.name,
		module: details.module,
		skipped: details.skipped,
		todo: details.todo
	} );
} );

QUnit.done( function() {
	if ( done ) {
		return;
	}

	done = true;

	QUnit.test( "Compare stats", function( assert ) {
		assert.expect( 3 );

		assert.deepEqual( testsStats, { failed: 0, skipped: 5, todo: 4 } );
		assert.deepEqual( assertionsStats, { failed: 4, passed: 1 } );
		assert.deepEqual( tests, [
			{
				name: "a todo test",
				module: "Only this module should run",
				skipped: false,
				todo: true
			},
			{
				name: "implicitly skipped test",
				module: "Only this module should run",
				skipped: true,
				todo: false
			},
			{
				name: "another implicitly skipped test",
				module: "Only this module should run",
				skipped: true,
				todo: false
			},
			{
				name: "normal test",
				module: "Only this module should run",
				skipped: false,
				todo: false
			},
			{
				name: "another todo test",
				module: "Only this module should run",
				skipped: false,
				todo: true
			},
			{
				name: "this will be treated as a todo",
				module: "Only this module should run > A todo module",
				skipped: false,
				todo: true
			},
			{
				name: "a skip test that should be treated as a todo",
				module: "Only this module should run > A todo module",
				skipped: false,
				todo: true
			},
			{
				name: "test will be treated as a skipped test",
				module: "Only this module should run > This module will be skipped",
				skipped: true,
				todo: false
			},
			{
				name: "a todo test that should be skipped",
				module: "Only this module should run > This module will be skipped",
				skipped: true,
				todo: false
			},
			{
				name: "an only test that should be skipped",
				module: "Only this module should run > This module will be skipped",
				skipped: true,
				todo: false
			}
		] );
	} );
} );

QUnit.module( "module A", function() {
	QUnit.test( "test A", function( assert ) {
		assert.ok( false, "this test should not run" );
	} );
} );

QUnit.module.only( "Only this module should run", function() {
	QUnit.todo( "a todo test", function( assert ) {
		assert.ok( false, "not implemented yet" );
	} );

	QUnit.skip( "implicitly skipped test", function( assert ) {
		assert.ok( false, "test should be skipped" );
	} );

	QUnit.skip( "another implicitly skipped test", function( assert ) {
		assert.ok( false, "test should be skipped" );
	} );

	QUnit.test( "normal test", function( assert ) {
		assert.ok( true, "this test should run" );
	} );

	QUnit.todo( "another todo test", function( assert ) {
		assert.ok( false, "not implemented yet" );
	} );

	QUnit.module.todo( "A todo module", function() {
		QUnit.test( "this will be treated as a todo", function( assert ) {
			assert.ok( false, "not implemented yet" );
		} );

		QUnit.skip( "a skip test that should be treated as a todo", function( assert ) {
			assert.ok( false, "not implemented yet" );
		} );
	} );

	QUnit.module.skip( "This module will be skipped", function() {
		QUnit.test( "test will be treated as a skipped test", function( assert ) {
			assert.ok( false, "this test should not run" );
		} );

		QUnit.todo( "a todo test that should be skipped", function( assert ) {
			assert.ok( false, "this test should not run" );
		} );

		QUnit.only( "an only test that should be skipped", function( assert ) {
			assert.ok( false, "this test should not run" );
		} );
	} );
} );

QUnit.module( "module B", function() {
	QUnit.test( "test B", function( assert ) {
		assert.ok( false, "this test should not run" );
	} );
} );
