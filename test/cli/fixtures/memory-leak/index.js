/* globals gc */

const foos = new WeakSet();
class Foo {
	constructor() {
		foos.add( this );
	}

	sayHello() {
		return "Hi!";
	}

	destroy() { }
}

QUnit.module( "some nested module", function( hooks ) {
	let foo;

	hooks.beforeEach( function() {
		foo = new Foo();
	} );

	hooks.afterEach( function() {
		foo.destroy();
	} );

	QUnit.test( "can call method on foo", function( assert ) {
		assert.equal( foo.sayHello(), "Hi!" );
	} );

} );

QUnit.module( "later thing", function() {
	QUnit.test( "has released all foos", function( assert ) {

		// Without async here, the test runner is recursive, and therefore the `foo`
		// instance is still retained.
		return Promise.resolve()
			.then( () => {

				// Requires `--expose-gc` flag to function properly.
				gc();

				// Using `new Function` here to avoid a syntax error.
				const retainedFoos = new Function(
					"foos",
					"return %GetWeakSetValues(foos, 0)"
				)( foos );

				assert.equal( retainedFoos.length, 0 );
			} )
			.catch( error => {
				if ( error instanceof SyntaxError ) {
					console.log( "Must launch Node 9 with `--expose-gc --allow-natives-syntax`" );
				} else {
					throw error;
				}
			} );
	} );
} );
