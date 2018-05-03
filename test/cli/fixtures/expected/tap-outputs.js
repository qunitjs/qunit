"use strict";

// Expected outputs from the TapReporter for the commands run in CLI tests
module.exports = {
	"qunit":
`TAP version 13
ok 1 First > 1
ok 2 Second > 1
1..2
# pass 2
# skip 0
# todo 0
# fail 0`,

	"qunit 'glob/**/*-test.js'":
`TAP version 13
ok 1 A-Test > derp
ok 2 Nested-Test > herp
1..2
# pass 2
# skip 0
# todo 0
# fail 0`,

	"qunit single.js":
`TAP version 13
ok 1 Single > has a test
1..1
# pass 1
# skip 0
# todo 0
# fail 0`,

	"qunit single.js double.js":
`TAP version 13
ok 1 Double > has a test
ok 2 Double > has another test
ok 3 Single > has a test
1..3
# pass 3
# skip 0
# todo 0
# fail 0`,

	"qunit test":
`TAP version 13
ok 1 First > 1
ok 2 Second > 1
1..2
# pass 2
# skip 0
# todo 0
# fail 0`,

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

	"qunit --seed 's33d' test single.js 'glob/**/*-test.js'": `Running tests with seed: s33d
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

	"qunit --reporter npm-reporter": "Run ended!",
	"qunit --reporter does-not-exist": `No reporter found matching "does-not-exist".
Available reporters from JS Reporters are: console, tap
Available custom reporters from dependencies are: npm-reporter
`,

	"qunit --reporter": `Available reporters from JS Reporters are: console, tap
Available custom reporters from dependencies are: npm-reporter
`,

	/* eslint-disable max-len */
	"qunit hanging-test": `Error: Process exited before tests finished running
Last test to run (hanging) has an async hold. Ensure all assert.async() callbacks are invoked and Promises resolve. You should also set a standard timeout via QUnit.config.testTimeout.
`,
	/* eslint-enable max-len */
	"qunit unhandled-rejection.js":
`TAP version 13
not ok 1 Unhandled Rejections > test passes just fine, but has a rejected promise
  ---
  message: "Error thrown in non-returned promise!"
  severity: failed
  actual: {
  "message": "Error thrown in non-returned promise!",
  "stack": "Error: Error thrown in non-returned promise!\\n    at /some/path/wherever/unhandled-rejection.js:13:11"
}
  expected: undefined
  stack: Error: Error thrown in non-returned promise!
    at /some/path/wherever/unhandled-rejection.js:13:11
  ...
not ok 2 global failure
  ---
  message: "outside of a test context"
  severity: failed
  actual: {
  "message": "outside of a test context",
  "stack": "Error: outside of a test context\\n    at Object.<anonymous> (/some/path/wherever/unhandled-rejection.js:20:18)"
}
  expected: undefined
  stack: Error: outside of a test context
    at Object.<anonymous> (/some/path/wherever/unhandled-rejection.js:20:18)
  ...
1..2
# pass 0
# skip 0
# todo 0
# fail 2
`,

	"qunit no-tests":
`TAP version 13
not ok 1 global failure
  ---
  message: "No tests were run."
  severity: failed
  actual: null
  expected: undefined
  stack: undefined:undefined
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1
`,

	"qunit qunit --filter 'no matches' test":
`TAP version 13
not ok 1 global failure
  ---
  message: "No tests matched the filter "no matches"."
  severity: failed
  actual: null
  expected: undefined
  stack: undefined:undefined
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1
`,

	"qunit single.js --require require-dep --require './node_modules/require-dep/module.js'":
`required require-dep/index.js
required require-dep/module.js
TAP version 13
ok 1 Single > has a test
1..1
# pass 1
# skip 0
# todo 0
# fail 0`,

	"node --expose-gc --allow-natives-syntax ../../../bin/qunit memory-leak/*.js":
`TAP version 13
ok 1 some nested module > can call method on foo
ok 2 later thing > has released all foos
1..2
# pass 2
# skip 0
# todo 0
# fail 0`
};
