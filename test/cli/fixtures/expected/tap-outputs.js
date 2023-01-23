'use strict';
/* eslint-disable quotes */

// Expected outputs from the TapReporter for the commands run in CLI tests
module.exports = {
  qunit:
`TAP version 13
ok 1 First > 1
ok 2 Second > 1
1..2
# pass 2
# skip 0
# todo 0
# fail 0`,

  'qunit does-not-exist.js':
`# stderr
No files were found matching: does-not-exist.js

# exit code: 1`,

  "qunit 'glob/**/*-test.js'":
`TAP version 13
ok 1 A-Test > derp
ok 2 Nested-Test > herp
1..2
# pass 2
# skip 0
# todo 0
# fail 0`,

  'qunit single.js':
`TAP version 13
ok 1 Single > has a test
1..1
# pass 1
# skip 0
# todo 0
# fail 0`,

  'qunit single.js double.js':
`TAP version 13
ok 1 Double > has a test
ok 2 Double > has another test
ok 3 Single > has a test
1..3
# pass 3
# skip 0
# todo 0
# fail 0`,

  'qunit test':
`TAP version 13
ok 1 First > 1
ok 2 Second > 1
1..2
# pass 2
# skip 0
# todo 0
# fail 0`,

  'qunit fail/throws-match.js':
`TAP version 13
not ok 1 Throws match > bad
  ---
  message: match error
  severity: failed
  actual  : Error: Match me with a pattern
  expected: "/incorrect pattern/"
  stack: |
        at /qunit/test/cli/fixtures/fail/throws-match.js:3:12
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  "qunit test single.js 'glob/**/*-test.js'":
`TAP version 13
ok 1 A-Test > derp
ok 2 Nested-Test > herp
ok 3 Single > has a test
ok 4 First > 1
ok 5 Second > 1
1..5
# pass 5
# skip 0
# todo 0
# fail 0`,

  'qunit syntax-error/test.js':
`not ok 1 global failure
  ---
  message: |+
    Error: Failed to load file syntax-error/test.js
    ReferenceError: varIsNotDefined is not defined
  severity: failed
  stack: |
    ReferenceError: varIsNotDefined is not defined
        at /qunit/test/cli/fixtures/syntax-error/test.js:1:1
        at internal
  ...
Bail out! Error: Failed to load file syntax-error/test.js
TAP version 13
not ok 2 global failure
  ---
  message: No tests were run.
  severity: failed
  actual  : undefined
  expected: undefined
  stack: |
    Error: No tests were run.
        at qunit.js
        at internal
  ...
1..2
# pass 0
# skip 0
# todo 0
# fail 2

# exit code: 1`,

  'qunit fail/failure.js':
`TAP version 13
not ok 1 Failure > bad
  ---
  message: failed
  severity: failed
  actual  : false
  expected: true
  stack: |
        at /qunit/test/cli/fixtures/fail/failure.js:3:16
  ...
not ok 2 Failure > bad again
  ---
  message: failed
  severity: failed
  actual  : false
  expected: true
  stack: |
        at /qunit/test/cli/fixtures/fail/failure.js:7:16
  ...
1..2
# pass 0
# skip 0
# todo 0
# fail 2

# exit code: 1`,

  "qunit --seed s33d test single.js 'glob/**/*-test.js'":
`Running tests with seed: s33d
TAP version 13
ok 1 Second > 1
ok 2 Single > has a test
ok 3 First > 1
ok 4 Nested-Test > herp
ok 5 A-Test > derp
1..5
# pass 5
# skip 0
# todo 0
# fail 0`,

  'qunit --reporter npm-reporter':
`Run ended!`,

  'qunit --reporter does-not-exist':
`# stderr
No reporter found matching "does-not-exist".
Built-in reporters: console, tap
Extra reporters found among package dependencies: npm-reporter

# exit code: 1`,

  'qunit --reporter':
`# stderr
Built-in reporters: console, tap
Extra reporters found among package dependencies: npm-reporter

# exit code: 1`,

  'qunit hanging-test':
`TAP version 13

# stderr
Error: Process exited before tests finished running
Last test to run (hanging) has an async hold. Ensure all assert.async() callbacks are invoked and Promises resolve. You should also set a standard timeout via QUnit.config.testTimeout.

# exit code: 1`,

  'qunit unhandled-rejection.js':
`not ok 1 global failure
  ---
  message: Error: outside of a test context
  severity: failed
  stack: |
    Error: outside of a test context
        at /qunit/test/cli/fixtures/unhandled-rejection.js:17:18
        at qunit.js
        at /qunit/test/cli/fixtures/unhandled-rejection.js:3:7
        at internal
  ...
Bail out! Error: outside of a test context
TAP version 13
not ok 2 Unhandled Rejections > test passes just fine, but has a rejected promise
  ---
  message: global failure: Error: Error thrown in non-returned promise!
  severity: failed
  actual  : undefined
  expected: undefined
  stack: |
    Error: Error thrown in non-returned promise!
        at /qunit/test/cli/fixtures/unhandled-rejection.js:10:13
        at internal
  ...
1..2
# pass 0
# skip 0
# todo 0
# fail 2

# exit code: 1`,

  'qunit hard-error-in-test-with-no-async-handler.js':
`TAP version 13
not ok 1 contains a hard error after using assert.async()
  ---
  message: |+
    Died on test #2: expected error thrown in test
        at /qunit/test/cli/fixtures/hard-error-in-test-with-no-async-handler.js:1:7
        at internal
  severity: failed
  actual  : null
  expected: undefined
  stack: |
    Error: expected error thrown in test
        at /qunit/test/cli/fixtures/hard-error-in-test-with-no-async-handler.js:4:9
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  'qunit hard-error-in-hook.js':
`TAP version 13
not ok 1 contains a hard error in hook > contains a hard error
  ---
  message: before failed on contains a hard error: expected error thrown in hook
  severity: failed
  actual  : null
  expected: undefined
  stack: |
    Error: expected error thrown in hook
        at /qunit/test/cli/fixtures/hard-error-in-hook.js:3:11
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  'qunit bad-callbacks/moduleDone-throw.js':
`TAP version 13
ok 1 module1 > test1

# stderr
Error: Process exited before tests finished running

# exit code: 1`,

  'qunit bad-callbacks/testStart-throw.js':
`TAP version 13

# stderr
Error: Process exited before tests finished running

# exit code: 1`,

  'qunit no-tests':
`TAP version 13
not ok 1 global failure
  ---
  message: No tests were run.
  severity: failed
  actual  : undefined
  expected: undefined
  stack: |
    Error: No tests were run.
        at qunit.js
        at internal
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  'qunit sourcemap/source.js':
`TAP version 13
ok 1 Example > good
not ok 2 Example > bad
  ---
  message: failed
  severity: failed
  actual  : false
  expected: true
  stack: |
        at /qunit/test/cli/fixtures/sourcemap/source.js:7:16
  ...
1..2
# pass 1
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  'qunit sourcemap/source.min.js':
`TAP version 13
ok 1 Example > good
not ok 2 Example > bad
  ---
  message: failed
  severity: failed
  actual  : false
  expected: true
  stack: |
        at /qunit/test/cli/fixtures/sourcemap/sourcemap/source.js:7:10
  ...
1..2
# pass 1
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  'qunit ../../es2018/esm.mjs':
`TAP version 13
ok 1 ESM test suite > sum()
1..1
# pass 1
# skip 0
# todo 0
# fail 0`,

  'qunit timeout':
`TAP version 13
not ok 1 timeout > first
  ---
  message: Test took longer than 10ms; test timed out.
  severity: failed
  actual  : null
  expected: undefined
  stack: |
        at internal
  ...
ok 2 timeout > second
1..2
# pass 1
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  'qunit hooks-global-context.js':
`TAP version 13
ok 1 A > A1
ok 2 A > AB > AB1
ok 3 B
1..3
# pass 3
# skip 0
# todo 0
# fail 0`,

  'qunit zero-assertions.js':
`TAP version 13
ok 1 Zero assertions > has a test
1..1
# pass 1
# skip 0
# todo 0
# fail 0`,

  "qunit --filter single test single.js 'glob/**/*-test.js'":
`TAP version 13
ok 1 Single > has a test
1..1
# pass 1
# skip 0
# todo 0
# fail 0`,

  "qunit --filter 'no matches' test":
`TAP version 13
not ok 1 global failure
  ---
  message: "No tests matched the filter \\"no matches\\"."
  severity: failed
  actual  : undefined
  expected: undefined
  stack: |
    Error: No tests matched the filter "no matches".
        at qunit.js
        at internal
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  'qunit --module seconD test/':
`TAP version 13
ok 1 Second > 1
1..1
# pass 1
# skip 0
# todo 0
# fail 0`,

  'qunit single.js --require require-dep --require ./node_modules/require-dep/module.js':
`required require-dep/index.js
required require-dep/module.js
TAP version 13
ok 1 Single > has a test
1..1
# pass 1
# skip 0
# todo 0
# fail 0`,

  "node --expose-gc ../../../bin/qunit.js memory-leak/module-closure.js":
`TAP version 13
ok 1 module-closure > example test
ok 2 module-closure > example child module > example child module test
ok 3 module-closure check > memory release
1..3
# pass 3
# skip 0
# todo 0
# fail 0`,

  "node --expose-gc ../../../bin/qunit.js --filter !child memory-leak/module-closure.js":
`TAP version 13
ok 1 module-closure > example test
ok 2 module-closure check > memory release
1..2
# pass 2
# skip 0
# todo 0
# fail 0`,

  'qunit only/test.js':
`TAP version 13
ok 1 run this test
ok 2 all tests with only run
1..3
# pass 3
# skip 0
# todo 0
# fail 0`,

  'qunit only/module.js':
`TAP version 13
not ok 1 # TODO module B > Only this module should run > a todo test
  ---
  message: not implemented yet
  severity: todo
  actual  : false
  expected: true
  stack: |
        at /qunit/test/cli/fixtures/only/module.js:17:18
  ...
ok 2 # SKIP module B > Only this module should run > implicitly skipped test
ok 3 module B > Only this module should run > normal test
ok 4 module D > test D
ok 5 module E > module F > test F
ok 6 module E > test E
1..8
# pass 6
# skip 1
# todo 1
# fail 0`,

  'qunit only/module-then-test.js':
`TAP version 13
ok 1 module A > module B > test B
1..2
# pass 2
# skip 0
# todo 0
# fail 0`,

  'qunit only/module-flat.js':
`TAP version 13
not ok 1 # TODO module B > test B
  ---
  message: not implemented yet
  severity: todo
  actual  : false
  expected: true
  stack: |
        at /qunit/test/cli/fixtures/only/module-flat.js:8:14
  ...
ok 2 # SKIP module B > test C
ok 3 module B > test D
1..4
# pass 2
# skip 1
# todo 1
# fail 0`,

  'qunit module-nested.js':
`TAP version 13
ok 1 module 1 > test in module 1
ok 2 module 3 > test in module 3
1..2
# pass 2
# skip 0
# todo 0
# fail 0`,

  'qunit incorrect-hooks-warning/test.js':
`TAP version 13
ok 1 module providing hooks > module not providing hooks > has a test
1..1
# pass 1
# skip 0
# todo 0
# fail 0

# stderr
The \`beforeEach\` hook was called inside the wrong module (\`module providing hooks > module not providing hooks\`). Instead, use hooks provided by the callback to the containing module (\`module providing hooks\`). This will become an error in QUnit 3.0.`,

  'qunit async-module-warning/test.js':
`TAP version 13
ok 1 resulting parent module > has a test
1..1
# pass 1
# skip 0
# todo 0
# fail 0

# stderr
Returning a promise from a module callback is not supported. Instead, use hooks for async behavior. This will become an error in QUnit 3.0.`,

  'qunit async-module-warning/promise-test.js':
`TAP version 13
ok 1 module manually returning a promise > has a test
1..1
# pass 1
# skip 0
# todo 0
# fail 0

# stderr
Returning a promise from a module callback is not supported. Instead, use hooks for async behavior. This will become an error in QUnit 3.0.`,

  'qunit config-filter-string.js':
`TAP version 13
ok 1 filter > foo test
ok 2 filter > bar test
1..2
# pass 2
# skip 0
# todo 0
# fail 0`,

  'qunit config-filter-regex.js':
`TAP version 13
ok 1 filter > foo test
ok 2 filter > FOO test
ok 3 filter > bar test
1..3
# pass 3
# skip 0
# todo 0
# fail 0`,

  'qunit config-filter-regex-exclude.js':
`TAP version 13
ok 1 filter > foo test
ok 2 filter > Bar test
1..2
# pass 2
# skip 0
# todo 0
# fail 0`,

  'qunit config-module.js':
`TAP version 13
ok 1 Module B > Test B
1..1
# pass 1
# skip 0
# todo 0
# fail 0`,

  'qunit config-moduleId.js':
`TAP version 13
ok 1 module A scoped > module C nested > test C1
ok 2 module D scoped > test D1
ok 3 module D scoped > module E nested > test E1
ok 4 module D scoped > test D2
ok 5 module F flat > test F1
1..5
# pass 5
# skip 0
# todo 0
# fail 0`,

  'qunit config-testId.js':
`TAP version 13
ok 1 test 2
ok 2 module A > module B > test 1
ok 3 module A > module C > test 2
ok 4 module D > test 1
1..4
# pass 4
# skip 0
# todo 0
# fail 0`,

  'qunit config-testTimeout.js':
`TAP version 13
not ok 1 slow
  ---
  message: Test took longer than 10ms; test timed out.
  severity: failed
  actual  : null
  expected: undefined
  stack: |
        at internal
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  'qunit noglobals/add-global.js':
`TAP version 13
not ok 1 adds global var
  ---
  message: Introduced global variable(s): dummyGlobal
  severity: failed
  actual  : null
  expected: undefined
  stack: |
        at qunit.js
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  'qunit noglobals/remove-global.js':
`TAP version 13
not ok 1 deletes global var
  ---
  message: Deleted global variable(s): dummyGlobal
  severity: failed
  actual  : null
  expected: undefined
  stack: |
        at qunit.js
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  'qunit noglobals/ignored.js':
`TAP version 13
ok 1 adds global var
1..1
# pass 1
# skip 0
# todo 0
# fail 0`,

  'qunit bad-callbacks/begin-throw.js':
`TAP version 13
not ok 1 global failure
  ---
  message: Error: No dice
  severity: failed
  stack: |
    Error: No dice
        at /qunit/test/cli/fixtures/bad-callbacks/begin-throw.js:2:9
        at qunit.js
        at internal
  ...
Bail out! Error: No dice

# stderr
Error: Process exited before tests finished running

# exit code: 1`,

  'qunit bad-callbacks/done-throw.js':
`TAP version 13
ok 1 module1 > test1
1..1
# pass 1
# skip 0
# todo 0
# fail 0
Bail out! Error: No dice
  ---
  message: Error: No dice
  severity: failed
  stack: |
    Error: No dice
        at /qunit/test/cli/fixtures/bad-callbacks/done-throw.js:2:9
        at qunit.js
        at internal
  ...

# exit code: 1`,

  'qunit done-after-timeout.js':
`TAP version 13
not ok 1 times out before scheduled done is called
  ---
  message: Test took longer than 10ms; test timed out.
  severity: failed
  actual  : null
  expected: undefined
  stack: |
        at internal
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  'qunit drooling-done.js':
`TAP version 13
not ok 1 Test A
  ---
  message: |+
    Died on test #2: this is an intentional error
        at /qunit/test/cli/fixtures/drooling-done.js:5:7
        at internal
  severity: failed
  actual  : null
  expected: undefined
  stack: |
    Error: this is an intentional error
        at /qunit/test/cli/fixtures/drooling-done.js:8:9
  ...
ok 2 Test B
1..2
# pass 1
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  'qunit drooling-extra-done.js':
`TAP version 13
ok 1 Test A
not ok 2 Test B
  ---
  message: |+
    Died on test #2: Unexpected release of async pause during a different test.
    > Test: Test A [async #1]
        at /qunit/test/cli/fixtures/drooling-extra-done.js:13:7
        at internal
  severity: failed
  actual  : null
  expected: undefined
  stack: |
    Error: Unexpected release of async pause during a different test.
    > Test: Test A [async #1]
  ...
1..2
# pass 1
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  'qunit drooling-extra-done-outside.js':
`TAP version 13
ok 1 extra done scheduled outside any test
1..1
# pass 1
# skip 0
# todo 0
# fail 0
Bail out! Error: Unexpected release of async pause after tests finished.
  ---
  message: |+
    Error: Unexpected release of async pause after tests finished.
    > Test: extra done scheduled outside any test [async #1]
  severity: failed
  stack: |
    Error: Unexpected release of async pause after tests finished.
    > Test: extra done scheduled outside any test [async #1]
        at qunit.js
        at internal
  ...

# exit code: 1`,

  'qunit too-many-done-calls.js':
`TAP version 13
not ok 1 Test A
  ---
  message: |+
    Died on test #2: Tried to release async pause that was already released.
    > Test: Test A [async #1]
        at /qunit/test/cli/fixtures/too-many-done-calls.js:1:7
        at internal
  severity: failed
  actual  : null
  expected: undefined
  stack: |
    Error: Tried to release async pause that was already released.
    > Test: Test A [async #1]
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  'qunit assert-expect/no-tests.js':
`TAP version 13
1..0
# pass 0
# skip 0
# todo 0
# fail 0`,

  'qunit assert-expect/failing-expect.js':
`TAP version 13
not ok 1 failing test
  ---
  message: Expected 2 assertions, but 1 were run
  severity: failed
  actual  : null
  expected: undefined
  stack: |
        at /qunit/test/cli/fixtures/assert-expect/failing-expect.js:1:7
        at internal
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  'qunit assert-expect/no-assertions.js':
`TAP version 13
not ok 1 no assertions
  ---
  message: Expected at least one assertion, but none were run - call expect(0) to accept zero assertions.
  severity: failed
  actual  : null
  expected: undefined
  stack: |
        at /qunit/test/cli/fixtures/assert-expect/no-assertions.js:1:7
        at internal
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1

# exit code: 1`,

  'qunit assert-expect/require-expects.js':
`TAP version 13
not ok 1 passing test
  ---
  message: Expected number of assertions to be defined, but expect() was not called.
  severity: failed
  actual  : null
  expected: undefined
  stack: |
        at /qunit/test/cli/fixtures/assert-expect/require-expects.js:3:7
        at internal
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1

# exit code: 1`
};
