/* global QUnit, window */

(function () {
  function sendMessage () {
    window.__grunt_contrib_qunit__.apply(window, arguments);
  }

  QUnit.on('runEnd', function () {
    // send coverage data if available
    if (window.__coverage__) {
      sendMessage('qunit.coverage', window.location.pathname, window.__coverage__);
    }
  });
}());
