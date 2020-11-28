/* globals Symbol:false */

QUnit.module( "dump", {
	afterEach: function() {
		QUnit.dump.maxDepth = null;
	}
} );

QUnit.test( "dump output", function( assert ) {
	assert.equal( QUnit.dump.parse( [ 1, 2 ] ), "[\n  1,\n  2\n]" );
	assert.equal( QUnit.dump.parse( { top: 5, left: 0 } ), "{\n  \"left\": 0,\n  \"top\": 5\n}" );
	if ( typeof document !== "undefined" && document.getElementById( "qunit-header" ) ) {
		assert.equal(
			QUnit.dump.parse( document.getElementById( "qunit-header" ) ),
			"<h1 id=\"qunit-header\"></h1>"
		);
		assert.equal(
			QUnit.dump.parse( document.getElementsByTagName( "h1" ) ),
			"[\n  <h1 id=\"qunit-header\"></h1>\n]"
		);
	}

	if ( typeof Symbol === "function" ) {
		var sym = Symbol( "QUnit" );
		assert.equal( QUnit.dump.parse( sym ), "Symbol(QUnit)", "parse is correct for symbols" );
	}
} );

QUnit.test( "dump output, shallow", function( assert ) {
	var obj = {
		top: {
			middle: {
				bottom: 0
			}
		},
		left: 0
	};
	QUnit.dump.maxDepth = 1;
	assert.equal( QUnit.dump.parse( obj ), "{\n  \"left\": 0,\n  \"top\": [object Object]\n}" );

	QUnit.dump.maxDepth = 2;
	assert.equal(
		QUnit.dump.parse( obj ),
		"{\n  \"left\": 0,\n  \"top\": {\n    \"middle\": [object Object]\n  }\n}"
	);

	QUnit.dump.maxDepth = 3;
	assert.equal(
		QUnit.dump.parse( obj ),
		"{\n  \"left\": 0,\n  \"top\": {\n    \"middle\": {\n      \"bottom\": 0\n    }\n  }\n}"
	);

	QUnit.dump.maxDepth = 5;
	assert.equal(
		QUnit.dump.parse( obj ),
		"{\n  \"left\": 0,\n  \"top\": {\n    \"middle\": {\n      \"bottom\": 0\n    }\n  }\n}"
	);
} );

QUnit.test( "dump, TypeError properties", function( assert ) {
	function CustomError( message ) {
		this.message = message;
	}

	CustomError.prototype.toString = function() {
		return this.message;
	};
	var customError = new CustomError( "sad puppy" ),
		typeError = new TypeError( "crying kitten" ),
		expectedCustomMessage = "\"message\": \"sad puppy\"",
		expectedTypeMessage = "\"message\": \"crying kitten\"",
		expectedTypeName = "\"name\": \"TypeError\"",

		dumpedCustomError = QUnit.dump.parse( customError ),
		dumpedTypeError = QUnit.dump.parse( typeError ),

		dumpedTypeErrorWithEnumerable;

	// Test when object has some enumerable properties by adding one
	typeError.hasCheeseburger = true;

	dumpedTypeErrorWithEnumerable = QUnit.dump.parse( typeError );

	assert.pushResult( {
		result: dumpedCustomError.indexOf( expectedCustomMessage ) >= 0,
		actual: dumpedCustomError,
		expected: expectedCustomMessage,
		message: "custom error contains message field"
	} );
	assert.pushResult( {
		result: dumpedTypeError.indexOf( expectedTypeMessage ) >= 0,
		actual: dumpedTypeError,
		expected: expectedTypeMessage,
		message: "type error contains message field"
	} );
	assert.pushResult( {
		result: dumpedTypeError.indexOf( expectedTypeName ) >= 0,
		actual: dumpedTypeError,
		expected: expectedTypeName,
		message: "type error contains name field"
	} );
	assert.pushResult( {
		result: dumpedTypeErrorWithEnumerable.indexOf( expectedTypeMessage ) >= 0,
		actual: dumpedTypeErrorWithEnumerable,
		expected: expectedTypeMessage,
		message: "type error with enumerable field contains message field"
	} );
} );

QUnit.test( "maximum array depth", function( assert ) {
	QUnit.dump.maxDepth = 1;
	assert.equal(
		QUnit.dump.parse( [ [ ] ] ),
		"[\n  [object Array]\n]" );
} );

QUnit.test( "regex", function( assert ) {
	assert.equal( QUnit.dump.parse( /foo/ ), "/foo/" );
} );

QUnit.test( "date", function( assert ) {
	var date = new Date( "2020-11-10T03:24:00" );
	assert.equal( QUnit.dump.parse( date ), "\"" + date + "\"" );
} );

QUnit.test( "error", function( assert ) {
	assert.equal(
		QUnit.dump.parse( new Error( "foo" ) ),
		"Error(\"foo\")" );
} );

QUnit.test( "named function", function( assert ) {
	var f = function foo() {};
	assert.equal( QUnit.dump.parse( f ), "function foo(){\n  [code]\n}" );
} );

QUnit.test( "function args", function( assert ) {
	// eslint-disable-next-line no-unused-vars
	var f = function( foo, bar ) {};
	assert.equal( QUnit.dump.parse( f ), "function f( a, b ){\n  [code]\n}" );
} );

QUnit.test( "multiline", function( assert ) {
	QUnit.dump.multiline = false;

	assert.equal( QUnit.dump.parse( [ [] ] ), "[ [] ]" );

	QUnit.dump.multiline = true;
} );

QUnit.test( "HTML", function( assert ) {
	QUnit.dump.HTML = true;

	assert.equal(
		QUnit.dump.parse( [ 1, 2 ] ),
		"[<br />&#160;&#160;1,<br />&#160;&#160;2<br />]" );

	QUnit.dump.multiline = false;
	assert.equal(
		QUnit.dump.parse( [ 1, 2 ] ),
		"[&#160;1,&#160;2&#160;]" );

	QUnit.dump.multiline = true;
	QUnit.dump.HTML = false;
} );

QUnit.test( "HTML Nodes", function( assert ) {

	var fakeWindow = {
		setInterval: [],
		document: {},
		nodeType: undefined
	};
	assert.equal( QUnit.dump.parse( fakeWindow ), "[Window]" );

	var fakeDocument = { nodeType: 9 };
	assert.equal( QUnit.dump.parse( fakeDocument ), "[Document]" );

	var fakeTextNode = {
		nodeType: 3,
		nodeName: "fakeTextNode",
		nodeValue: "fakeValue"
	};
	assert.equal(
		QUnit.dump.parse( fakeTextNode ),
		"<faketextnode>fakeValue</faketextnode>" );

	QUnit.dump.HTML = true;
	assert.equal(
		QUnit.dump.parse( fakeTextNode ),
		"&lt;faketextnode&gt;fakeValue&lt;/faketextnode&gt;" );

	QUnit.dump.HTML = false;
} );

QUnit.test( "Custom parser", function( assert ) {

	var parser = "dummy value";
	QUnit.dump.setParser( "CustomObject", parser );

	assert.equal( QUnit.dump.parsers.CustomObject, parser );
} );

function WrapFn( x ) {
	this.wrap = x;
	if ( x === undefined ) {
		this.first = true;
	}
}

function chainwrap( depth, first, prev ) {
	depth = depth || 0;
	var last = prev || new WrapFn();
	first = first || last;

	if ( depth === 1 ) {
		first.wrap = last;
	}
	if ( depth > 1 ) {
		last = chainwrap( depth - 1, first, new WrapFn( last ) );
	}

	return last;
}

QUnit.test( "Check dump recursion", function( assert ) {
	var noref, nodump, selfref, selfdump, parentref, parentdump, circref, circdump;

	noref = chainwrap( 0 );
	nodump = QUnit.dump.parse( noref );
	assert.equal( nodump, "{\n  \"first\": true,\n  \"wrap\": undefined\n}" );

	selfref = chainwrap( 1 );
	selfdump = QUnit.dump.parse( selfref );
	assert.equal( selfdump, "{\n  \"first\": true,\n  \"wrap\": recursion(-1)\n}" );

	parentref = chainwrap( 2 );
	parentdump = QUnit.dump.parse( parentref );
	assert.equal( parentdump,
		"{\n  \"wrap\": {\n    \"first\": true,\n    \"wrap\": recursion(-2)\n  }\n}"
	);

	circref = chainwrap( 10 );
	circdump = QUnit.dump.parse( circref );
	assert.true( new RegExp( "recursion\\(-10\\)" ).test( circdump ),
		"(" + circdump + ") should show -10 recursion level"
	);
} );

QUnit.test( "Check equal/deepEqual recursion", function( assert ) {
	var noRecursion, selfref, circref;

	noRecursion = chainwrap( 0 );
	assert.equal( noRecursion, noRecursion, "I should be equal to me." );
	assert.deepEqual( noRecursion, noRecursion, "... and so in depth." );

	selfref = chainwrap( 1 );
	assert.equal( selfref, selfref, "Even so if I nest myself." );
	assert.deepEqual( selfref, selfref, "... into the depth." );

	circref = chainwrap( 10 );
	assert.equal( circref, circref, "Or hide that through some levels of indirection." );
	assert.deepEqual( circref, circref, "... and checked on all levels!" );
} );

QUnit.test( "Circular reference with arrays", function( assert ) {
	var arr, arrdump, obj, childarr, objdump, childarrdump;

	// Pure array self-ref
	arr = [];
	arr.push( arr );

	arrdump = QUnit.dump.parse( arr );

	assert.equal( arrdump, "[\n  recursion(-1)\n]" );
	assert.equal( arr, arr[ 0 ], "no endless stack when trying to dump arrays with circular ref" );

	// Mix obj-arr circular ref
	obj = {};
	childarr = [ obj ];
	obj.childarr = childarr;

	objdump = QUnit.dump.parse( obj );
	childarrdump = QUnit.dump.parse( childarr );

	assert.equal( objdump, "{\n  \"childarr\": [\n    recursion(-2)\n  ]\n}" );
	assert.equal( childarrdump, "[\n  {\n    \"childarr\": recursion(-2)\n  }\n]" );

	assert.equal( obj.childarr, childarr,
		"no endless stack when trying to dump array/object mix with circular ref"
	);
	assert.equal( childarr[ 0 ], obj,
		"no endless stack when trying to dump array/object mix with circular ref"
	);

} );

QUnit.test( "Circular reference - test reported by soniciq in #105", function( assert ) {
	var a, b, barr,
		MyObject = function() {};
	MyObject.prototype.parent = function( obj ) {
		if ( obj === undefined ) {
			return this._parent;
		}
		this._parent = obj;
	};
	MyObject.prototype.children = function( obj ) {
		if ( obj === undefined ) {
			return this._children;
		}
		this._children = obj;
	};

	a = new MyObject();
	b = new MyObject();

	barr = [ b ];
	a.children( barr );
	b.parent( a );

	assert.equal( a.children(), barr );
	assert.deepEqual( a.children(), [ b ] );
} );
