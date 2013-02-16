(function( QUnit ) {
var iframe, hasBoundBegin;

function runSuite( suite ) {
	var path;

	if ( QUnit.is( "object", suite ) ) {
		path = suite.path;
		suite = suite.name;
	} else {
		path = suite;
	}

	QUnit.asyncTest( suite, function() {
		iframe.setAttribute( "src", path );
		// QUnit.start is called from the child iframe's QUnit.done hook.
	});
}

function initIframe() {
	var iframeWin,
		body = document.body;

	function onIframeLoad() {
		var moduleName, testName,
			count = 0;

		if ( iframe.src === "" ) {
			return;
		}

		iframeWin.QUnit.moduleStart(function( data ) {
			// Capture module name for messages
			moduleName = data.name;
		});

		iframeWin.QUnit.testStart(function( data ) {
			// Capture test name for messages
			testName = data.name;
		});
		iframeWin.QUnit.testDone(function() {
			testName = undefined;
		});

		iframeWin.QUnit.log(function( data ) {
			if (testName === undefined) {
				return;
			}
			// Pass all test details through to the main page
			var message = moduleName + ": " + testName + ": " + data.message;
			expect( ++count );
			QUnit.push( data.result, data.actual, data.expected, message );
		});

		// Continue the outer test when the iframe's test is done
		iframeWin.QUnit.done( QUnit.start );
	}

	iframe = document.createElement( "iframe" );
	iframe.className = "qunit-subsuite";
	body.appendChild( iframe );

	QUnit.addEvent( iframe, "load", onIframeLoad );

	iframeWin = iframe.contentWindow;
}

/**
 * @param {Array} suites List of suites where each suite
 *  may either be a string (path to the html test page),
 *  or an object with a path and name property.
 */
QUnit.testSuites = function( suites ) {
	if ( !hasBoundBegin ) {
		hasBoundBegin = true;
		QUnit.begin( initIframe );
	}

	for ( var i = 0, len = suites.length; i < len; i++ ) {
		runSuite( suites[ i ] );
	}

	QUnit.done(function() {
		iframe.style.display = "none";
	});
};

QUnit.testDone(function() {
	var current = QUnit.id( this.config.current.id ),
		children = current.children,
		src = iframe.src;

	QUnit.addEvent( current, "dblclick", function( e ) {
		var target = e && e.target ? e.target : window.event.srcElement;
		if ( target.nodeName.toLowerCase() === "span" || target.nodeName.toLowerCase() === "b" ) {
			target = target.parentNode;
		}
		if ( window.location && target.nodeName.toLowerCase() === "strong" ) {
			window.location = src;
		}
	});

	// Update Rerun link to point to the standalone test suite page
	current.getElementsByTagName( "a" )[ 0 ].href = src;
});

}( QUnit ) );
