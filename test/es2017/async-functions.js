QUnit.module( "modules with async hooks", function( hooks ) {
	hooks.before( async function( assert ) { assert.step( "before" ); } );
	hooks.beforeEach( async function( assert ) { assert.step( "beforeEach" ); } );
	hooks.afterEach( async function( assert ) { assert.step( "afterEach" ); } );

	hooks.after( function( assert ) {
		assert.verifySteps( [
			"before",
			"beforeEach",
			"afterEach"
		] );
	} );

	QUnit.test( "all hooks", function( assert ) {
		assert.expect( 4 );
	} );
} );

QUnit.module( "before/beforeEach/afterEach/after", {
	before: async function( assert ) { assert.step( "before" ); },
	beforeEach: async function( assert ) { assert.step( "beforeEach" ); },
	afterEach: async function( assert ) { assert.step( "afterEach" ); },
	after: async function( assert ) {
		assert.verifySteps( [
			"before",
			"beforeEach",
			"afterEach"
		] );
	}
} );

QUnit.test( "async hooks order", function( assert ) {
	assert.expect( 4 );
} );
