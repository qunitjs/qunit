// For passing tests, see /test/main/assert.js
//
// TODO: After we migrate running of tests in browsers to use TAP,
// merge these two files and verify them by TAP output instead of
// by boolean passing (akin to what we do with Node.js already).

QUnit.module('assert', function () {
  QUnit.test('true [failure]', function (assert) {
    assert.true(false);
  });

  QUnit.test('false [failure]', function (assert) {
    assert.false(true);
  });

  QUnit.test('closeTo [failure]', function (assert) {
    assert.closeTo(1, 2, 0);
    assert.closeTo(1, 2, 1);
    assert.closeTo(2, 7, 1);

    assert.closeTo(7, 7.3, 0.1);
    assert.closeTo(7, 7.3, 0.2);
    assert.closeTo(2011, 2013, 1);

    assert.closeTo(20.7, 20.1, 0.1);
  });
});
