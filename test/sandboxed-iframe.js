/* eslint-env browser */

if (self.__grunt_contrib_qunit__ === undefined) {
  // For debugging
  self.__grunt_contrib_qunit__ = function () {
    var args = [].slice.call(arguments);
    args.unshift('[grunt-contrib-qunit]');
    console.log.apply(console, args);
  };
}

QUnit.module('QUnit.only', function (hooks) {
  var testsRun = 0;

  hooks.after(function (assert) {
    assert.strictEqual(testsRun, 2);
  });

  QUnit.test('implicitly skipped test', function (assert) {
    assert.true(false, 'test should be skipped');
  });

  QUnit.only('run this test', function (assert) {
    testsRun += 1;
    assert.true(true, 'only this test should run');
  });

  QUnit.test('another implicitly skipped test', function (assert) {
    assert.true(false, 'test should be skipped');
  });

  QUnit.only('all tests with only run', function (assert) {
    testsRun += 1;
    assert.true(true, 'this test should run as well');
  });
});
