QUnit.hooks.beforeEach( function() {
	this.x = 1;
	this.fromGlobal = true;
} );
QUnit.hooks.afterEach( function() {
	this.x = 100;
} );

QUnit.module( "A", function( hooks ) {
	hooks.beforeEach( function() {
		this.x = 2;
		this.fromModule = true;
	} );
	hooks.afterEach( function() {
		this.x = 20;
	} );

	QUnit.test( "A1", function( assert ) {
		assert.equal( this.x, 2 );
		assert.strictEqual( this.fromGlobal, true );
		assert.strictEqual( this.fromModule, true );
		assert.strictEqual( this.fromNested, undefined );
	} );

	QUnit.module( "AB", function( hooks ) {
		hooks.beforeEach( function() {
			this.x = 3;
			this.fromNested = true;
		} );
		hooks.afterEach( function() {
			this.x = 30;
		} );

		QUnit.test( "AB1", function( assert ) {
			assert.strictEqual( this.x, 3 );
			assert.strictEqual( this.fromGlobal, true );
			assert.strictEqual( this.fromModule, true );
			assert.strictEqual( this.fromNested, true );
		} );
	} );
} );

QUnit.test( "B", function( assert ) {
	assert.strictEqual( this.x, 1 );
	assert.strictEqual( this.fromGlobal, true );
	assert.strictEqual( this.fromModule, undefined );
	assert.strictEqual( this.fromNested, undefined );
} );

