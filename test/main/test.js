QUnit.test( "expect query and multiple issue", function( assert ) {
	assert.expect( 2 );
	assert.ok( true );
	var expected = assert.expect();
	assert.equal( expected, 2 );
	assert.expect( expected + 1 );
	assert.ok( true );
} );

if ( typeof document !== "undefined" ) {

	QUnit.module( "fixture", function( hooks ) {
		var failure = false,
			values = [

				/* initial value (see unshift below), */
				/* initial value (see unshift below), */
				"<b>ar</b>",
				"<p>bc</p>",
				undefined
			],
			originalValue;

		hooks.before( function() {
			originalValue = QUnit.config.fixture;
			values.unshift( originalValue );
			values.unshift( originalValue );

			var customFixtureNode = document.createElement( "span" );
			customFixtureNode.setAttribute( "id", "qunit-fixture" );
			customFixtureNode.setAttribute( "data-baz", "huzzah!" );
			values.push( customFixtureNode );
		} );

		hooks.beforeEach( function( assert ) {
			assert.fixtureEquals = function fixtureEquals( options ) {
				var expectedTagName = options.tagName || "div";
				var expectedAttributes = options.attributes || {};
				var expectedContent = options.content || "";

				var element = document.getElementById( "qunit-fixture" );

				this.pushResult( {
					result: element.tagName === expectedTagName.toUpperCase(),
					actual: element.tagName.toLowerCase(),
					expected: expectedTagName,
					message: "tagName"
				} );

				var actualAttributes = {};

				for ( var i = 0, l = element.attributes.length; i < l; i++ ) {
					actualAttributes[ element.attributes[ i ].name ] = element.attributes[ i ].value;
				}

				this.deepEqual( actualAttributes, expectedAttributes, "attributes" );
				this.strictEqual( element.innerHTML, expectedContent, "contents" );
			};

			assert.hasFailingAssertions = function() {
				for ( var i = 0; i < this.test.assertions.length; i++ ) {
					if ( !this.test.assertions[ i ].result ) {
						return true;
					}
				}

				return false;
			};
		} );

		// Set QUnit.config.fixture for the next test, propagating failures to recover the sequence
		hooks.afterEach( function( assert ) {
			failure = failure || assert.hasFailingAssertions();
			if ( failure ) {
				assert.ok( false, "prior failure" );
				QUnit.config.fixture = originalValue;
			} else {
				QUnit.config.fixture = values.shift();
			}
		} );

		QUnit.test( "setup", function( assert ) {
			assert.equal( values.length, 6, "proper sequence" );

			// setup for next test
			document.getElementById( "qunit-fixture" ).innerHTML = "foo";
		} );

		QUnit.test( "automatically reset", function( assert ) {
			assert.fixtureEquals( {
				tagName: "div",
				attributes: { id: "qunit-fixture" },
				content: originalValue.innerHTML
			} );
			assert.equal( values.length, 5, "proper sequence" );

			// setup for next test
			document.getElementById( "qunit-fixture" ).setAttribute( "data-foo", "blah" );
		} );

		QUnit.test( "automatically reset after attribute value mutation", function( assert ) {
			assert.fixtureEquals( {
				tagName: "div",
				attributes: { id: "qunit-fixture" },
				content: originalValue.innerHTML
			} );
			assert.equal( values.length, 4, "proper sequence" );
		} );

		QUnit.test( "user-specified string", function( assert ) {
			assert.fixtureEquals( {
				tagName: "div",
				attributes: { id: "qunit-fixture" },
				content: "<b>ar</b>"
			} );
			assert.equal( values.length, 3, "proper sequence" );

			// setup for next test
			document.getElementById( "qunit-fixture" ).setAttribute( "data-foo", "blah" );
		} );

		QUnit.test( "user-specified string automatically resets attribute value mutation", function( assert ) {
			assert.fixtureEquals( {
				tagName: "div",
				attributes: { id: "qunit-fixture" },
				content: "<p>bc</p>"
			} );
			assert.equal( values.length, 2, "proper sequence" );

			// setup for next test
			document.getElementById( "qunit-fixture" ).innerHTML = "baz";
		} );

		QUnit.test( "disabled", function( assert ) {
			assert.fixtureEquals( {
				tagName: "div",
				attributes: { id: "qunit-fixture" },
				content: "baz"
			} );
			assert.equal( values.length, 1, "proper sequence" );
		} );

		QUnit.test( "user-specified DOM node", function( assert ) {
			assert.fixtureEquals( {
				tagName: "span",
				attributes: {
					id: "qunit-fixture",
					"data-baz": "huzzah!"
				},
				content: ""
			} );
			assert.equal( values.length, 0, "proper sequence" );
		} );
	} );

}

QUnit.module( "custom assertions" );

QUnit.assert.mod2 = function( value, expected, message ) {
	var actual = value % 2;
	this.pushResult( {
		result: actual === expected,
		actual: actual,
		expected: expected,
		message: message
	} );
};

QUnit.assert.testForPush = function( value, expected, message ) {
	this.push( true, value, expected, message, false );
};

QUnit.test( "mod2", function( assert ) {
	assert.expect( 2 );

	assert.mod2( 2, 0, "2 % 2 == 0" );
	assert.mod2( 3, 1, "3 % 2 == 1" );
} );

QUnit.test( "testForPush", function( assert ) {
	assert.expect( 6 );

	QUnit.log( function( detail ) {
		if ( detail.message === "should be call pushResult" ) {
			assert.equal( detail.result, true );
			assert.equal( detail.actual, 1 );
			assert.equal( detail.expected, 1 );
			assert.equal( detail.message, "should be call pushResult" );
			assert.equal( detail.negative, false );
		}
	} );
	assert.testForPush( 1, 1, "should be call pushResult" );
} );

QUnit.module( "QUnit.skip", {
	beforeEach: function( assert ) {

		// Skip test hooks for skipped tests
		assert.ok( false, "skipped function" );
		throw "Error";
	},
	afterEach: function( assert ) {
		assert.ok( false, "skipped function" );
		throw "Error";
	}
} );

QUnit.skip( "test blocks are skipped", function( assert ) {

	// This test callback won't run, even with broken code
	assert.expect( 1000 );
	throw "Error";
} );

QUnit.skip( "no function" );

QUnit.module( "Missing Callbacks" );

QUnit.test( "QUnit.test without a callback logs a descriptive error", function( assert ) {
	assert.throws( function() {
		QUnit.test( "should throw an error" );
	}, /You must provide a function as a test callback to QUnit.test\("should throw an error"\)/ );
} );

QUnit.test( "QUnit.todo without a callback logs a descriptive error", function( assert ) {
	assert.throws( function() {
		QUnit.todo( "should throw an error" );
	}, /You must provide a function as a test callback to QUnit.todo\("should throw an error"\)/ );
} );
