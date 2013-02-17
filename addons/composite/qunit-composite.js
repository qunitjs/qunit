(function( QUnit ) {

  QUnit.extend( QUnit, {
    testSuites: function( suites ) {
      var i = 0,
          suiteCount = suites.length,
          moduleMeta = {
            completed: 0,
            total: suiteCount
          };

      QUnit.module( null, {
        setup: once(
          function() {
            executingComposite = true;
            initIframe();
            initLoggingCallbacks();
          }
        ),
        teardown: function() {
          moduleMeta.completed++;
          if ( moduleMeta.completed === moduleMeta.total ) {
            QUnit.moduleDone( once(
              function() {
                executingComposite = false;
              }
            ) );
          }
        }
      });
      
      for ( ; i < suiteCount; i++ ) {
        runSuite( suites[ i ] );
      }
    }
  });

  var qunitCompositeIframe,

      executingComposite = false,
  
      runSuite = function( suite ) {
        var path = suite;

        if ( QUnit.is( "object", suite ) ) {
          path = suite.path;
          suite = suite.name;
        }

        QUnit.asyncTest( suite, function() {
          qunitCompositeIframe.setAttribute( "src", path );
        });
      },

      once = function( fn ) {
        var memo;
        return function() {
          if ( !fn ) {
            return memo;
          }
          memo = fn.apply( this, arguments );
          fn = null;
          return memo;
        };
      },

      initIframe = once(
        function() {
          // Initialize the iframe at the start of any test run
          QUnit.begin(function() {
            qunitCompositeIframe = createIframe();
          });
          
          // Additionally, if the test run has already started and the iframe was
          // not initialized, initialize it right now instead
          if ( !qunitCompositeIframe && QUnit.config && QUnit.config.started ) {
            qunitCompositeIframe = createIframe();
          }
        }
      ),
      
      createIframe = function() {
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
        return iframe;
      },
      
      initLoggingCallbacks = once(
        function() {
          QUnit.testDone(function() {
            if ( !executingComposite ) {
              return;
            }
            
            var i = 0,
                current = QUnit.id( this.config.current.id ),
                children = current.children,
                childCount = children.length,
                src = qunitCompositeIframe.src;

            // Undo the auto-expansion of failed tests
            for ( ; i < childCount; i++ ) {
              if ( children[ i ].nodeName.toLowerCase() === "ol" ) {
                addClass( children[ i ], "qunit-collapsed" );
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

          QUnit.done(function() {
            // Hide the iframe when the test run is all finished
            qunitCompositeIframe.style.display = "none";
          });
        }
      ),

      // Hijacked from qunit.js
      hasClass = function( elem, name ) {
        return ( " " + elem.className + " " ).indexOf( " " + name + " " ) > -1;
      },

      // Hijacked from qunit.js
      addClass = function( elem, name ) {
        if ( !hasClass( elem, name ) ) {
          elem.className += ( elem.className ? " " : "" ) + name;
        }
      };

})( QUnit );
