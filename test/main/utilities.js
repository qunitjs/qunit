/* globals Map, Set, Symbol */

QUnit.module( "QUnit.objectType" );

function Foo() { }

function validateObjectType( item, expected ) {
	QUnit.test( "should properly detect " + expected, function( assert ) {
		var actual = QUnit.objectType( item );
		assert.equal( actual, expected );
	} );
}

function maybeValidateObjectType( string, expected ) {
	try {
		var value = new Function( "return " + string + ";" )( );
		validateObjectType( value, expected );
	} catch ( e ) {

		// do nothing if parsing failed
		if ( e.name === "SyntaxError" ) {
			return;
		}

		// do not hide other errors
		throw e;
	}
}

validateObjectType( 1, "number" );
validateObjectType( "", "string" );
validateObjectType( "foo", "string" );
validateObjectType( null, "null" );
validateObjectType( true, "boolean" );
validateObjectType( false, "boolean" );
validateObjectType( [ ], "array" );
validateObjectType( new Date( ), "date" );
validateObjectType( /foo/, "regexp" );
validateObjectType( NaN, "nan" );
validateObjectType( undefined, "undefined" );
validateObjectType( { }, "object" );
validateObjectType( new Foo( ), "object" );

if ( typeof Symbol === "function" ) {
	validateObjectType( Symbol( "HI!" ), "symbol" );
}

// Support IE 11: Skip on IE11's non-compliant implementation
if ( typeof Map === "function" && ( new Map ).toString() !== "[object Object]" ) {
	validateObjectType( new Map( ), "map" );
}

// Support IE 11: Skip on IE11's non-compliant implementation
if ( typeof Set === "function" && ( new Set ).toString() !== "[object Object]" ) {
	validateObjectType( new Set( ), "set" );
}

maybeValidateObjectType( "async function() { }", "function" );
maybeValidateObjectType( "async () => { }", "function" );
maybeValidateObjectType( "() => { }", "function" );
maybeValidateObjectType( "function* { }", "function" );

QUnit.module( "QUnit.extend" );

QUnit.test( "appends to object", function( assert ) {
	var base = { foo: 1 };
	var copy = QUnit.extend( base, { bar: 2 } );

	assert.deepEqual( base, { foo: 1, bar: 2 } );
	assert.equal( copy, base, "returns mutated object" );
} );

QUnit.test( "overwrites duplicate fields", function( assert ) {
	var base = { foo: 1 };
	var copy = QUnit.extend( base, { foo: 2 } );

	assert.deepEqual( base, { foo: 2 } );
	assert.equal( copy, base, "returns mutated object" );
} );

QUnit.test( "removes undefined fields", function( assert ) {
	var base = { foo: 1, bar: 2 };
	var copy = QUnit.extend( base, { bar: undefined } );

	assert.false( "bar" in base, "Values specified as `undefined` are removed" );
	assert.equal( copy, base, "returns mutated object" );
} );
