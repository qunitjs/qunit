(function( QUnit ) {

  QUnit.extend( QUnit, {
    testSuites: function( suites ) {
      QUnit.begin(function() {
        initIframe();
      });

      var i = 0,
          suiteCount = suites.length;
      for ( ; i < suiteCount; i++ ) {
        runSuite( suites[ i ] );
      }

      QUnit.done(function() {
        qunitCompositeIframe.style.display = "none";
      });
    }
  });

  var qunitCompositeIframe,
      runSuite = function( suite ) {
        var path = suite;

        if ( QUnit.is( "object", suite ) ) {
          path = suite.path;
          suite = suite.name;
        }

        asyncTest( suite, function() {
          qunitCompositeIframe.setAttribute( "src", path );
        });
      },
      initIframe = function() {
        var body = document.body,
            iframe = document.createElement( "iframe" ),
            iframeWin;

        iframe.className = "qunit-subsuite";
        body.appendChild( iframe );

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
            test = null;
          });

          iframeWin.QUnit.log(function( data ) {
            if (test === null) {
              return;
            }
            // pass all test details through to the main page
            var message = module + ": " + test + ": " + data.message;
            expect( ++count );
            QUnit.push( data.result, data.actual, data.expected, message );
          });

          iframeWin.QUnit.done(function() {
            // start the wrapper test from the main page
            start();
          });
        }
        QUnit.addEvent( iframe, "load", onIframeLoad );

        iframeWin = iframe.contentWindow;
        qunitCompositeIframe = iframe;
      };

  QUnit.testStart(function( data ) {
    // update the test status to show which test suite is running
    QUnit.id( "qunit-testresult" ).innerHTML = "Running " + data.name + "...<br>&nbsp;";
  });

  QUnit.testDone(function() {
    var i = 0,
        current = QUnit.id( this.config.current.id ),
        children = current.children,
        childCount = children.length,
        src = qunitCompositeIframe.src;

    // undo the auto-expansion of failed tests
    for ( ; i < childCount; i++ ) {
      if ( children[ i ].nodeName === "OL" ) {
        children[ i ].style.display = "none";
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

    current.getElementsByTagName( "a" )[ 0 ].href = src;
  });

})( QUnit );
