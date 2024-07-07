// This currently runs 0 tests because stuff cancels out.
// The intent is ambigious and outcome doesn't really matter.
// It's covered as regression test against a past crash:
//
// * module A:
//   - start module scope A
// * test A1:
//   - queue A1
// * test.only A2:
//   - start "test" focus mode.
//   - clear queue (delete A1).
//   - queue A2
// * module.only B:
//   - start "module" focus mode.
//   - clear queue (delete A2).
//   - modify parent A to become "ignored".
//   - start child-module scope B
// * test B1:
//   - ignored, because it's a non-only test and
//     we are in "focus" mode due to the earlier test.only.
//     thus the only test we would run is a "test.only" test,
//     inside a "module.only" block, which this file doesn't have any of.
// * test A4:
//   - ignored
// * ProcessingQueue.end:
//   - create new Error('No tests were run.')
//   - emit it via a dynamically created test
//   - despite forcing validTest=true, the added test (as of QUnit 2.21.0) is ignored
//     because it is a non-only test and we're in "focus" mode.
//     This causes an infinite loop between ProcessingQueue.end and ProcessingQueue.advance
//     because it thinks it ads a test, but doesn't.
//     This scenerio is surprising because the usual way to active "focused" test mode,
//     is by defining a test.only() case, in which case the queue by definition isn't
//     empty. Even if the test.only() case was skipped by a filter (or config.moduleId/testId)
//     this is taken care of by forcing validTest=true.

QUnit.module('module A', function () {
  // ... start module scope A

  // ... queue A1
  QUnit.test('test A1', function (assert) {
    assert.true(false, 'not run');
  });

  QUnit.test.only('test A2', function (assert) {
    assert.true(false, 'not run');
  });

  QUnit.module.only('module B', function () {
    QUnit.test('test B1', function (assert) {
      assert.true(true, 'run');
    });
  });

  QUnit.test('test A4', function (assert) {
    assert.true(false, 'not run');
  });
});
