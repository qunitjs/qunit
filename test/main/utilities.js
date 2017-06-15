QUnit.module( "QUnit.objectType" );

function Foo( ) { }

function validateObjectType( item, expected ) {
	QUnit.test( "should properly detect " + expected, function( assert ) {
		assert.expect( 1 );

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

if ( typeof Map === "function" ) {
	validateObjectType( new Map( ), "map" );
}

if ( typeof Set === "function" ) {
	validateObjectType( new Set( ), "set" );
}

maybeValidateObjectType( "async function() { }", "function" );
maybeValidateObjectType( "async () => { }", "function" );
maybeValidateObjectType( "() => { }", "function" );
maybeValidateObjectType( "function* { }", "function" );
