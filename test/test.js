function getPreviousTests( rTestName, rModuleName ) {
	var testSpan, moduleSpan,
		matches = [],
		i = 0,
		rModule = /(^| )module-name( |$)/,
		testNames = typeof document.getElementsByClassName !== "undefined" ?
			document.getElementsByClassName( "test-name" ) :
			(function( spans ) {
				var span,
					tests = [],
					i = 0,
					rTest = /(^| )test-name( |$)/;
				for ( ; ( span = spans[ i ] ); i++ ) {
					if ( rTest.test( span.className ) ) {
						tests.push( span );
					}
				}
				return tests;
			})( document.getElementsByTagName( "span" ) );

	for ( ; ( testSpan = testNames[ i ] ); i++ ) {
		moduleSpan = testSpan;
		while ( ( moduleSpan = moduleSpan.previousSibling ) ) {
			if ( rModule.test( moduleSpan.className ) ) {
				break;
			}
		}
		if ( ( !rTestName || rTestName.test( testSpan.innerHTML ) ) &&
			( !rModuleName || moduleSpan && rModuleName.test( moduleSpan.innerHTML ) ) ) {

			while ( ( testSpan = testSpan.parentNode ) ) {
				if ( testSpan.nodeName.toLowerCase() === "li" ) {
					matches.push( testSpan );
				}
			}
		}
	}
	return matches;
}

QUnit.test( "expect query and multiple issue", function( assert ) {
	assert.expect( 2 );
	assert.ok( true );
	var expected = assert.expect();
	assert.equal( expected, 2 );
	assert.expect( expected + 1 );
	assert.ok( true );
});

// TODO: More to the html-reporter test once we have that.
if ( typeof document !== "undefined" ) {

	QUnit.module( "<script id='qunit-unescaped-module'>'module';</script>", {
		beforeEach: function() {
		},
		afterEach: function( assert ) {

			// We can't use ok(false) inside script tags since some browsers
			// don't evaluate script tags inserted through innerHTML after domready.
			// Counting them before/after doesn't cover everything either as qunit-modulefilter
			// is created before any test is ran. So use ids instead.
			if ( document.getElementById( "qunit-unescaped-module" ) ) {

				// This can either be from in #qunit-modulefilter or #qunit-testresult
				assert.ok( false, "Unescaped module name" );
			}
			if ( document.getElementById( "qunit-unescaped-test" ) ) {
				assert.ok( false, "Unescaped test name" );
			}
			if ( document.getElementById( "qunit-unescaped-assertion" ) ) {
				assert.ok( false, "Unescaped test name" );
			}
		}
	});

	QUnit.test( "<script id='qunit-unescaped-test'>'test';</script>", function( assert ) {
		assert.expect( 1 );
		assert.ok( true, "<script id='qunit-unescaped-asassertionsert'>'assertion';</script>" );
	});
}

if ( typeof document !== "undefined" ) {

QUnit.module( "fixture" );

QUnit.test( "setup", function( assert ) {
	assert.expect( 0 );
	document.getElementById( "qunit-fixture" ).innerHTML = "foobar";
});

QUnit.test( "basics", function( assert ) {
	assert.equal(
		document.getElementById( "qunit-fixture" ).innerHTML,
		"test markup",
		"automatically reset"
	);
});

QUnit.test( "running test name displayed", function( assert ) {
	assert.expect( 2 );

	var displaying = document.getElementById( "qunit-testresult" );

	assert.ok( /running test name displayed/.test( displaying.innerHTML ),
		"Expect test name to be found in displayed text"
	);
	assert.ok( /fixture/.test( displaying.innerHTML ),
		"Expect module name to be found in displayed text"
	);
});

(function() {
	var delayNextSetup;

	QUnit.module( "timing", {
		beforeEach: function( assert ) {
			var done;
			if ( delayNextSetup ) {
				delayNextSetup = false;
				done = assert.async();
				setTimeout(function() {
					done();
				}, 250 );
			}
		}
	});

	QUnit.test( "setup", function( assert ) {
		assert.expect( 0 );
		delayNextSetup = true;
	});

	QUnit.test( "basics", function( assert ) {
		assert.expect( 2 );
		var previous = getPreviousTests( /^setup$/, /^timing$/ )[ 0 ],
			runtime = previous.lastChild.previousSibling;
		assert.ok( /(^| )runtime( |$)/.test( runtime.className ), "Runtime element exists" );
		assert.ok( /^\d+ ms$/.test( runtime.innerHTML ), "Runtime reported in ms" );
	});

	QUnit.test( "values", function( assert ) {
		assert.expect( 2 );
		var basics = getPreviousTests( /^setup$/, /^timing$/ )[ 0 ],
			slow = getPreviousTests( /^basics$/, /^timing$/ )[ 0 ];
		assert.ok( parseInt( basics.lastChild.previousSibling.innerHTML, 10 ) < 100,
			"Fast runtime for trivial test"
		);
		assert.ok( parseInt( slow.lastChild.previousSibling.innerHTML, 10 ) > 250,
			"Runtime includes beforeEach"
		);
	});
})();

}

QUnit.module( "custom assertions" );

QUnit.assert.mod2 = function( value, expected, message ) {
	var actual = value % 2;
	this.push( actual === expected, actual, expected, message );
};

QUnit.test( "mod2", function( assert ) {
	assert.expect( 2 );

	assert.mod2( 2, 0, "2 % 2 == 0" );
	assert.mod2( 3, 1, "3 % 2 == 1" );
});

QUnit.module( "QUnit.skip", {
	beforeEach: function( assert ) {

		// skip test hooks for skipped tests
		assert.ok( false, "skipped function" );
		throw "Error";
	},
	afterEach: function( assert ) {
		assert.ok( false, "skipped function" );
		throw "Error";
	}
});

QUnit.skip( "test blocks are skipped", function( assert ) {

	// this test callback won't run, even with broken code
	assert.expect( 1000 );
	throw "Error";
});

QUnit.skip( "no function" );
