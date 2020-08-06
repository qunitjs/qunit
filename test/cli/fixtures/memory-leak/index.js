/* globals gc */

const v8 = require( "v8" );

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

function streamToString( stream ) {
	const chunks = [];
	return new Promise( ( resolve, reject ) => {
		stream.on( "data", chunk => chunks.push( chunk ) );
		stream.on( "error", reject );
		stream.on( "end", () => resolve( Buffer.concat( chunks ).toString( "utf8" ) ) );
	} );
}

QUnit.module( "some nested module", function( hooks ) {
	let foo1;

	hooks.beforeEach( function() {
		foo1 = new Foo();
	} );

	hooks.afterEach( function() {
		foo1.destroy();
	} );

	QUnit.test( "can call method on foo", function( assert ) {
		assert.equal( foo1.sayHello(), "Hi!" );
	} );

} );

QUnit.module( "later thing", function() {
	QUnit.test( "has released all foos", async function( assert ) {

		// Create another one to ensure our heap match logic is working.
		let foo2 = new Foo();

		// The snapshot is expected to contain something like this:
		// > "part of key (Foo @…) -> value (…) pair in WeakMap (…)"
		// It is important that the regex uses \d and that the above
		// comment doesn't include a number after "@", as otherwise
		// it will match the memory relating to this function's code.
		const reHeap = /^[^\n]+Foo @\d[^\n]+/gm;

		let snapshot = await streamToString( v8.getHeapSnapshot() );
		let matches = snapshot.match( reHeap );
		assert.strictEqual( matches.length, 2, "found local Foo in heap" );

		snapshot = matches = null;
		foo2.destroy();

		// Comment out the below to test the failure mode
		foo2 = null;

		// Requires `--expose-gc` flag to function properly.
		gc();

		snapshot = await streamToString( v8.getHeapSnapshot() );
		matches = snapshot.match( reHeap );
		assert.strictEqual( null, matches, "the after heap" );
	} );
} );
