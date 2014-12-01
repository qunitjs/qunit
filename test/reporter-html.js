(function() {

var delayNextSetup;

function getPreviousTests( rTestName, rModuleName ) {
	var testSpan, moduleSpan,
		matches = [],
		i = 0,
		rModule = /(^| )module-name( |$)/,
		testNames = document.getElementsByClassName ?
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

QUnit.module( "display test info" );

QUnit.test( "running test name displayed", function( assert ) {
	assert.expect( 2 );

	var displaying = document.getElementById( "qunit-testresult" );

	assert.ok( /running test name displayed/.test( displaying.innerHTML ),
		"Expect test name to be found in displayed text"
	);
	assert.ok( /display test info/.test( displaying.innerHTML ),
		"Expect module name to be found in displayed text"
	);
});

QUnit.module( "timing", {
	beforeEach: function( assert ) {
		var done;
		if ( delayNextSetup ) {
			delayNextSetup = false;
			done = assert.async();
			setTimeout(function() {
				done();
			}, 101 );
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
	assert.ok( parseInt( slow.lastChild.previousSibling.innerHTML, 10 ) > 100,
		"Runtime includes beforeEach"
	);
});

})();
