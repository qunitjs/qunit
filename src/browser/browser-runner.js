import initFixture from './fixture';
import initUrlConfig from './urlparams';

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
  QUnit.reporters.perf.init(QUnit);
  QUnit.reporters.html.init(QUnit);

  function autostart () {
    // Check as late as possible because if projecst set autostart=false,
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
