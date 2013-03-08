(function( QUnit ) {
var iframe;

function runSuite( suite ) {
	var path;

	if ( QUnit.is( 'object', suite ) ) {
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
		var module, test,
			count = 0;

		if (iframe.src === "") {
			return;
		}

		iframeWin.QUnit.moduleStart(function( data ) {
			// capture module name for messages
			module = data.name;
		});

		iframeWin.QUnit.testStart(function( data ) {
			// capture test name for messages
			test = data.name;
		});
		iframeWin.QUnit.testDone(function() {
			test = undefined;
		});

		iframeWin.QUnit.log(function( data ) {
			if (test === undefined) {
				return;
			}
			// pass all test details through to the main page
			var message = module + ": " + test + ": " + data.message;
			expect( ++count );
			QUnit.push( data.result, data.actual, data.expected, message );
		});

		// Continue the outer test when the iframe's test is done
		iframeWin.QUnit.done(QUnit.start);
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
	QUnit.begin( initIframe );

	for ( var i = 0; i < suites.length; i++ ) {
		runSuite( suites[i] );
	}

	QUnit.done(function() {
		iframe.style.display = "none";
	});
};

QUnit.testStart(function( data ) {
	// update the test status to show which test suite is running
	QUnit.id( "qunit-testresult" ).innerHTML = "Running " + data.name + "...<br>&nbsp;";
});

QUnit.testDone(function() {
	var i,
		current = QUnit.id( this.config.current.id ),
		children = current.children,
		src = iframe.src;

	// undo the auto-expansion of failed tests
	for ( i = 0; i < children.length; i++ ) {
		if ( children[i].nodeName === "OL" ) {
			children[i].style.display = "none";
		}
	}

	QUnit.addEvent(current, "dblclick", function( e ) {
		var target = e && e.target ? e.target : window.event.srcElement;
		if ( target.nodeName.toLowerCase() === "span" || target.nodeName.toLowerCase() === "b" ) {
			target = target.parentNode;
		}
		if ( window.location && target.nodeName.toLowerCase() === "strong" ) {
			window.location = src;
		}
	});

	// Update Rerun link to point to the standalone test suite page
	current.getElementsByTagName('a')[0].href = src;
});

}( QUnit ) );
