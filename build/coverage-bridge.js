/* global QUnit, window, define, require */

(function (factory) {
  // For the amd tests we need to delay setup
  if (typeof define === 'function' && define.amd) {
    require(['qunit'], factory);
  } else {
    factory(QUnit);
  }
}(function (QUnit) {
  function sendMessage () {
    window.__grunt_contrib_qunit__.apply(window, arguments);
  }

  QUnit.done(function () {
    // send coverage data if available
    if (window.__coverage__) {
      sendMessage('qunit.coverage', window.location.pathname, window.__coverage__);
    }
  });
}));
