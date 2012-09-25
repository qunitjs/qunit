/**
 * QUnit for Google Apps Script
 *
 * Read the <a href="https://github.com/simula-innovation/qunit/tree/gas/gas">README</a> for more information.
 *
 * Based on a fork of QUnit v1.11.0pre - A JavaScript Unit Testing Framework (http://qunitjs.com)
 * Adaptation for Google Apps Script made by Simula Innovation and released under the MIT license.
 */

/**
 * Configure QUnit for Google Apps Script. To just retrieve the
 * configuration object, call this function without arguments.
 *
 * <h3>Examples:</h3>
 * Example with one setting:
 * <pre>
 * QUnit.config({ title: "Test suite for project X" });
 * </pre>
 *
 * Example with multiple settings:
 * <pre>
 * QUnit.config({
 *   title: "Test suite for project X",
 *   requireExpects: true,
 *   hidepassed: true,
 *   cssUrl: "https://raw.github.com/jquery/qunit/master/qunit/qunit.css"
 * });
 * </pre>
 *
 * @param {Object} cfg Configation object to merge with the existing
 *        configuration.
 * @return {Object} The configuration object.
 */
function config( cfg ) {
  if ( typeof cfg === "undefined" ) {
    return QUnit_.config;
  } else {
    QUnit_.extend( QUnit_.config, cfg );
    return QUnit_.config;
  }
}

/**
 * Load QUnit for Google Apps Script.
 * <p>
 * If a begin callback has been registered, it is fired here.
 * </p>
 * @param {Function} tests [Optional] A function with tests to run.
 */
function load( tests ) {
  if ( typeof tests === "function" ) {
    if ( QUnit_.config.autorun ) {
      QUnit_.load();
      tests();
    } else {
      tests();
      QUnit_.load();
    }
  } else {
    QUnit_.load();
  }
}

/**
 * Pass URL parameters to QUnit for Google Apps Script. To just
 * retrieve the parameters, call this function without arguments.
 *
 * <h3>Examples:</h3>
 * <pre>
 * function doGet(e) {
 *   QUnit.urlParams(e.parameter);
 *   QUnit.load(myTests);
 *   return QUnit.getHtml();
 * }
 * </pre>
 *
 * @param {Object} params [Optional] URL parameters to set.
 * @return {Object} The URL parameters.
 */
function urlParams( params ) {
  if ( typeof params == "undefined" ) {
    return QUnit_.urlParams;
  } else {
    var p, decodedParams = {};

    for ( p in params ) {
      decodedParams[p] = decodeURIComponent(params[p]);
    }
    QUnit_.urlParams = QUnit_.extend( {}, decodedParams );

    // String search anywhere in moduleName+testName
    QUnit_.config.filter = QUnit_.urlParams.filter;

    // Exact match of the module name
    QUnit_.config.module = QUnit_.urlParams.modulefilter;

    QUnit_.config.testNumber = parseInt( QUnit_.urlParams.testNumber, 10 ) || null;
    return QUnit_.urlParams;
  }
}

/**
 * Retrieve test results as HTML.
 *
 * <h3>Examples:</h3>
 * <pre>
 * function doGet(e) {
 *   QUnit.urlParams(e.parameter);
 *   QUnit.run(myTests); // myTests is a function containing your tests
 *   return QUnit.getHtml();
 * }
 * </pre>
 *
 * @return {HtmlOutput} A new HtmlOutput object.
 */
function getHtml() {
  var i,
    config = QUnit_.config,
    htmlCollection = QUnit_.htmlCollection,
    testHtml = HtmlService.createHtmlOutput();

  if ( config.altertitle ) {
    // show ✖ for good, ✔ for bad suite result in title
    // use escape sequences in case file gets loaded with non-utf-8-charset
    htmlCollection.main.title = [
      ( config.stats.bad ? "\u2716" : "\u2714" ),
      htmlCollection.main.title.replace( /^[\u2714\u2716] /i, "" )
    ].join( " " );
  }
  htmlCollection.main.testUrl = htmlCollection.toolbar.testUrl = ScriptApp.getService().getUrl();
  htmlCollection.main.hidepassed = config.hidepassed;
  htmlCollection.main.bannerClassName = config.stats.bad ? "qunit-fail" : "qunit-pass";
  htmlCollection.main.toolbar = htmlCollection.toolbar.evaluate().getContent();
  if ( config.reverse ) {
    htmlCollection.testResults.reverse();
  }
  for ( i = 0; i < htmlCollection.testResults.length; i++ ) {
    testHtml.append( htmlCollection.testResults[i] );
  }
  htmlCollection.main.tests = testHtml.getContent();
  return htmlCollection.main.evaluate().setTitle( htmlCollection.main.title );
}

/**
 * Separate tests into modules.
 * <p>
 * All tests that occur after a call to <code>module()</code> will be
 * grouped into that module. The test names will all be preceded by
 * the module name in the test results. You can then use that module
 * name to select tests to run.
 * </p>
 * @param {String} name The name of the module.
 * @param {Object} lifecycle [Optional] Setup and teardown callbacks
 *        to run before and after each test in this module. Calling
 *        module() again with callbacks resets them.
 */
function module( name, testEnvironment ) {
  QUnit_.module( name, testEnvironment );
}

/**
 * Add a test to run.
 * Tests added are queued and run one after the other.
 * <p>
 * When testing the most common, synchronous code, use
 * <code>test()</code>
 * </p>
 * <p>
 * The <code>assert</code> argument to the callback contains all of
 * QUnit's assertion methods. If you are avoiding using any of QUnit's
 * globals, you can use the assert argument instead.
 * </p>
 * <h3>Examples:</h3>
 * <pre>
 * test("a test", function(assert) {
 *   assert.ok(true, "always fine");
 * });
 * </pre>
 *
 * @param {String} title Title of unit being tested.
 * @param {Number} expected [Optional] Number of assertions in this
 *        test.
 * @param {Function( assert: QUnit.assert )} callback Function to
 *        close over assertions.
 */
function test( title, expected, callback ) {
  if ( arguments.length === 2 ) {
    callback = expected;
    expected = null;
  }
  QUnit_.test( title, expected, callback );
}

/**
 * Add an asynchronous test to run. The test must include a call to
 * <code>start()</code>.
 * <p>
 * For testing asynchronous code, <code>asyncTest</code> will
 * automatically stop the test runner and wait for your code to call
 * <code>start()</code> to continue.
 * </p>
 * @param {String} title Title of unit being tested.
 * @param {Number} expected [Optional] Number of assertions in this
 *        test.
 * @param {Function( assert: QUnit.assert )} callback Function to
 *        close over assertions.
 */
function asyncTest( title, expected, callback ) {
  if ( arguments.length === 2 ) {
    callback = expected;
    expected = null;
  }
  QUnit_.asyncTest( title, expected, callback );
}

/**
 * Specify how many assertions are expected to run within a test.
 * <p>
 * To ensure that an explicit number of assertions are run within any
 * test, use <code>expect( number )</code> to register an expected
 * count. If the number of assertions run does not match the expected
 * count, the test will fail.
 * </p>
 * @param {Integer} amount Number of assertions in this test.
 */
function expect( amount ) {
  if ( arguments.length === 1 ) {
    QUnit_.expect( amount );
  } else {
    return QUnit_.expect();
  }
}

/**
 * Start running tests again after the testrunner was stopped. See
 * <code>stop()</code>.
 * <p>
 * When your async test has multiple exit points, call
 * <code>start()</code> for the corresponding number of
 * <code>stop()</code> increments.
 * </p>
 * @param {Integer} decrement [Optional] The semaphore decrement. 1 by
 *        default.
 */
function start( decrement ) {
  QUnit_.start( decrement );
}

/**
 * Stop the testrunner to wait for async tests to run. Call
 * <code>start()</code> to continue.
 * <p>
 * When your async test has multiple exit points, call
 * <code>stop()</code> with the increment argument, corresponding to
 * the number of <code>start()</code> calls you need.
 * </p>
 * @param {Integer} increment [Optional] Optional argument to merge
 *        multiple stop() calls into one. Use with multiple
 *        corresponding start() calls.
 */
function stop( increment ) {
  QUnit_.stop( increment );
}

/**
 * Register a callback to fired without arguments when the test suite
 * begins.
 *
 * @param {Function} callback The callback function.
 */
function begin( callback ) {
  QUnit_.registerLoggingCallback( "begin" )( callback );
}

/**
 * Register a callback to fired when the test suite ends.
 * <p>
 * The callback is called with an object (having the properties:
 * failed, passed, total, runtime) as argument whenever all the tests
 * have finished running. failed is the number of failures that
 * occurred. total is the total number of assertions that occurred,
 * passed the passing assertions. runtime is the time in milliseconds
 * to run the tests from start to finish.
 * </p>
 * @param {Function} callback The callback function.
 */
function done( callback ) {
  QUnit_.registerLoggingCallback( "done" )( callback );
}

/**
 * Register a callback to fire whenever an assertion completes.
 * <p>
 * The callback is called with an object (having the properties
 * result, actual, expected, message) as argument whenever an
 * assertion completes.
 * </p>
 * @param {Function} callback The callback function.
 */
function log( callback ) {
  QUnit_.registerLoggingCallback( "log" )( callback );
}

/**
 * Register a callback to fired whenever a module begins.
 * <p>
 * The callback is called with an object (having a name property) as
 * the only argument.
 * </p>
 * @param {Function} callback The callback function.
 */
function moduleStart( callback ) {
  QUnit_.registerLoggingCallback( "moduleStart" )( callback );
}

/**
 * Register a callback to fired whenever a module ends.
 * <p>
 * The callback is called with an object (with the properties: name,
 * failed, passed, total) as argument whenever a module ends.
 * </p>
 * @param {Function} callback The callback function.
 */
function moduleDone( callback ) {
  QUnit_.registerLoggingCallback( "moduleDone" )( callback );
}

/**
 * Register a callback to fired whenever a test block begins.
 * <p>
 * The callback is called with an object (having a name property) as
 * the only argument.
 * </p>
 * @param {Function} callback The callback function.
 */
function testStart( callback ) {
  QUnit_.registerLoggingCallback( "testStart" )( callback );
}

/**
 * Register a callback to fired whenever a test block ends.
 * <p>
 * The callback is called with an object (with the properties: name,
 * failed, passed, total) as argument whenever a test block ends.
 * </p>
 * @param {Function} callback The callback function.
 */
function testDone( callback ) {
  QUnit_.registerLoggingCallback( "testDone" )( callback );
}

/**
 * Extend an object with the following QUnit helpers: ok, equal,
 * notEqual, deepEqual, notDeepEqual, strictEqual, notStrictEqual,
 * throws, module, test, asyncTest, expect.
 *
 * <h3>Examples:</h3>
 * <pre>
 * QUnit.helpers(this); // QUnit helpers are now global
 * </pre>
 *
 * @param {Object} obj The object to extend with QUnit helpers.
 * @return {Object} The extended object.
 */
function helpers( obj ) {
  return QUnit_.extend( QUnit_.extend( obj, QUnit_.assert ), {
    module: QUnit_.module,
    test: QUnit_.test,
    asyncTest: QUnit_.asyncTest,
    expect: QUnit_.expect,
    raises: QUnit_.raises
  });
}

/**
 * Extends the QUnit library or a given object with internal QUnit
 * functions and objects. Useful for testing internals of QUnit
 * itself.
 * <p>
 * The following internal functions and objects are exposed:
 * init, reset, registerLoggingCallback, push, pushFailure,
 * extend, is, objectType, url, id, addEvent, triggerEvent,
 * assert, ok, equal, notEqual, deepEqual, notDeepEqual, strictEqual,
 * notStrictEqual, throws, raises, equals, same, equiv, jsDump, diff,
 * htmlCollection, internals.
 * </p>
 * @param {Object} obj [Optional] The object to extend with QUnit
 *        internal functions and objects. If omitted, the QUnit
 *        library is extended.
 * @return {Object} The internal functions and objects that the QUnit
 *         library or the given object was extended with.
 */
function exposeInternals( obj ) {
  if ( typeof obj == "undefined" ) {
    QUnit_.extend( this, QUnit_.internals );
  } else {
    QUnit_.extend( obj, QUnit_.internals );
  }
  return QUnit_.internals;
}

/**
 * Get a reference to the QUnit object. Useful for testing QUnit
 * itself, or extending other objects with its functionality.
 *
 * @return {Object} The QUnit object.
 */
function getObj() {
  return QUnit_;
}
