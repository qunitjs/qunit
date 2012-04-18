(function( QUnit ) {

QUnit.extend( QUnit, {
	testSuites: function( suites ) {
		QUnit.initIframe();

		for ( var i = 0; i < suites.length; i++ ) {
			(function( suite ) {
				asyncTest( suite, function() {
					QUnit.runSuite( suite );
				});
			}( suites[i] ) );
		}
		QUnit.done = function() {
			this.iframe.style.display = "none";
		};
	},

	testStart: function( data ) {
		// update the test status to show which test suite is running
		QUnit.id( "qunit-testresult" ).innerHTML = "Running " + data.name + "...<br>&nbsp;";
	},

	testDone: function() {
		var current = QUnit.id( this.config.current.id ),
			children = current.children,
			iframe = this.iframe;

		// undo the auto-expansion of failed tests
		for ( var i = 0; i < children.length; i++ ) {
			if ( children[i].nodeName === "OL" ) {
				children[i].style.display = "none";
			}
		}

		QUnit.addEvent(current, "dblclick", function( e ) {
			var target = e && e.target ? e.target : window.event.srcElement;
			if ( target.nodeName.toLowerCase() == "span" || target.nodeName.toLowerCase() == "b" ) {
				target = target.parentNode;
			}
			if ( window.location && target.nodeName.toLowerCase() === "strong" ) {
				window.location = iframe.src;
			}
		});

		current.getElementsByTagName('a')[0].href = iframe.src;
	},

	runSuite: function( suite ) {
		this.iframe.setAttribute( "src", suite );
	},

	initIframe: function() {
		var body = document.body,
			iframe = this.iframe = document.createElement( "iframe" ),
			iframeWin;

		iframe.className = "qunit-subsuite";
		body.appendChild( iframe );

		function onIframeLoad() {
			var module, test,
				count = 0;

			QUnit.extend( iframeWin.QUnit, {
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
		}
		QUnit.addEvent( iframe, "load", onIframeLoad );

		iframeWin = iframe.contentWindow;
	}
});
}( QUnit ) );
