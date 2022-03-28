/* eslint-env browser */
QUnit.module('urlParams performance mark module', function () {
  QUnit.test("shouldn't fail if performance marks are cleared", function (assert) {
    // Optional feature available in IE10+ and Safari 10+
    // eslint-disable-next-line compat/compat
    performance.clearMarks();

    assert.true(true);
  });
});
