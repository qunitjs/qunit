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
//
//   - Past problem 1: The error is hidden.
//
//     Up until QUnit 2.21.0, this error was emitted via a
//     dynamically created QUnit.test(), with `validTest=true` set to bypass
//     filters like config.filter, config.module, and config.testId.
//     However, because it is a regular test (not an "only" test) it is
//     ignored because this test file defines one or more "QUnit.test.only" cases,
//     which puts us in "focus" mode and thus never even reaches Test.valid().
//
//   - Past problem 2: Crash by infinite loop.
//
//     The first problem causes an infinite loop between ProcessingQueue.end
//     and ProcessingQueue.advance, because end() thinks it adds a fake test, but
//     the definition is ignored due to  "focused" test by a previous test.only().
//     Normally, that would by definition mean the queue can't be empty and so
//     the "No tests" code would never be reached. Even if the test.only() case
//     was skipped by a filter (or config.moduleId/testId) this was accounted
//     for by setting validTest=true.
//     Fixed in QUnit 3 (99aee51a8a) by exempting validTest from "focused" mode.
//
//   - QUnit 3 emits "No tests" as "error" instead of a fake test, which obsoletes
//     the above workarounds.

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
