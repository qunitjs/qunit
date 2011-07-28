(function( $, QUnit ) {

$.extend( QUnit, {
	testSuites: function( suites ) {
		$.each( suites, function( i, suite ) {
			asyncTest( suite, function() {
				QUnit.runSuite( suite );
			});
		});
	},

	testStart: function( data ) {
		// update the test status to show which test suite is running
		$( "#qunit-testresult" ).html( "Running " + data.name + "...<br>&nbsp;" );
	},

	testDone: function() {
		// undo the auto-expansion of failed tests
		$( "#qunit-tests > li.fail" ).each(function() {
			var test = $( this );
			// avoid collapsing test results that the user manually opened
			if ( test.data( "auto-collapsed" ) ) {
				return;
			}
			test.data( "auto-collapsed", true )
				.children( "ol" ).hide();
		});
	},

	runSuite: function( suite ) {
		var body = $( "body" ),
			iframe = $( "<iframe>", { src: suite, class: "qunit-subsuite" } )
				.appendTo( body ),
			iframeWin = iframe[0].contentWindow;

		$( iframe ).bind( "load", function() {
			var module, test,
				count = 0;

			$.extend( iframeWin.QUnit, {
				moduleStart: function( data ) {
					// capture module name for messages
					module = data.name;
				},

				testStart: function( data ) {
					// capture test name for messages
					test = data.name;
				},

				log: function( data ) {
					// pass all test details through to the main page
					var message = module + ": " + test + ": " + data.message;
					expect( ++count );
					QUnit.push( data.result, data.actual, data.expected, message );
				},

				done: function() {
					// start the wrapper test from the main page
					start();
				}
			});
		});
		this.runSuite = function(suite){
			iframe.attr('src', suite);
		}
	}
});
}( jQuery, QUnit ) );
