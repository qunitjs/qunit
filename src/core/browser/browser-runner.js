import initFixture from './fixture.js';
import initUrlConfig from './urlparams.js';

export function initBrowser (QUnit, window, document) {
  // Report uncaught exceptions to QUnit.
  //
  // Wrap and preserve any pre-existing window.onerror.
  // An existing handller can "accepts" the erorr by returning true.
  //
  // Returning true from window.onerror suppresses the browser's default error
  // reporting. Likewise, we will also not report it in that case.
  const originalWindowOnError = window.onerror;
  window.onerror = function (message, fileName, lineNumber, columnNumber, errorObj, ...args) {
    let ret = false;
    if (originalWindowOnError) {
      ret = originalWindowOnError.call(
        this,
        message,
        fileName,
        lineNumber,
        columnNumber,
        errorObj,
        ...args
      );
    }

    // Treat return value as window.onerror itself does,
    // Only do our handling if not suppressed.
    if (ret !== true) {
      // If there is a current test that sets the internal `ignoreGlobalErrors` field
      // (such as during `assert.throws()`), then the error is ignored and native
      // error reporting is suppressed as well. This is because in browsers, an error
      // can sometimes end up in `window.onerror` instead of in the local try/catch.
      // This ignoring of errors does not apply to our general onUncaughtException
      // method, nor to our `unhandledRejection` handlers, as those are not meant
      // to receive an "expected" error during `assert.throws()`.
      if (QUnit.config.current && QUnit.config.current.ignoreGlobalErrors) {
        return true;
      }

      // According to
      // https://blog.sentry.io/2016/01/04/client-javascript-reporting-window-onerror,
      // most modern browsers support an errorObj argument; use that to
      // get a full stack trace if it's available.
      const error = errorObj || new Error(message);
      if (!error.stack && fileName && lineNumber) {
        error.stack = `${fileName}:${lineNumber}`;
      }
      QUnit.onUncaughtException(error);
    }

    return ret;
  };

  window.addEventListener('unhandledrejection', function (event) {
    QUnit.onUncaughtException(event.reason);
  });

  QUnit.on('runEnd', function (runEnd) {
    if (QUnit.config.altertitle && document.title) {
      // Show ✖ for good, ✔ for bad suite result in title
      // use escape sequences in case file gets loaded with non-utf-8
      // charset
      document.title = [
        (runEnd.status === 'failed' ? '\u2716' : '\u2714'),
        document.title.replace(/^[\u2714\u2716] /i, '')
      ].join(' ');
    }

    // Scroll back to top to show results
    if (QUnit.config.scrolltop && window.scrollTo) {
      window.scrollTo(0, 0);
    }
  });

  initFixture(QUnit, document);
  initUrlConfig(QUnit);

  // Unless explicitly disabled via preconfig, initialize HtmlReporter now
  // (i.e. QUnit.config.reporters.html is undefined or true).
  //
  // This allows the UI to render instantly (since QUnit 3.0) for cases where the
  // qunit.js script is after `<div id="qunit">`, which is recommended.
  //
  // Otherwise, we'll fallback to waiting with a blank page until window.onload,
  // which is how it's always been in QUnit 1 and QUnit 2.
  //
  // Note that HtmlReporter constructor will only render an initial layout and
  // listen to 1 event. The final decision on whether to attach event handlers
  // and render the interactive UI is made from HtmlReporter#onRunStart, which
  // is also where it will honor QUnit.config.reporters.html if it was set to
  // false between qunit.js (here) and onRunStart.
  //
  // If someone explicitly sets QUnit.config.reporters.html to false via preconfig,
  // but then changes it at runtime to true, that is unsupported and the reporter
  // will remain disabled.
  if (QUnit.config.reporters.html !== false) {
    QUnit.reporters.html.init(QUnit);
  }

  // NOTE:
  // * It is important to attach error handlers (above) before setting up reporters,
  //   to ensure reliable reporting of error events.
  // * Is is important to set up HTML Reporter (if enabled) before calling QUnit.start(),
  //   as otherwise it will miss the first few or even all synchronous events.
  //
  // Priot to QUnit 3.0, the reporter was initialised here, between error handler (above),
  // and start (below). As of QUnit 3.0, reporters are initialized by doStart() within
  // QUnit.start(), which is logically the same place, but decoupled from initBrowser().

  function autostart () {
    // Check as late as possible because if projects set autostart=false,
    // they generally do so in their own scripts, after qunit.js.
    if (QUnit.config.autostart) {
      QUnit.start();
    }
  }
  if (document.readyState === 'complete') {
    autostart();
  } else {
    window.addEventListener('load', autostart, false);
  }
}
