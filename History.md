
2.22.0 / 2024-08-18
==================

### Added

* Core: Add [`QUnit.test.if()`](https://qunitjs.com/api/QUnit/test.if/) and `QUnit.module.if()`. (Timo Tijhof) [#1772](https://github.com/qunitjs/qunit/pull/1772)

2.21.1 / 2024-07-20
==================

### Deprecated

* Assert: Add notice about upcoming change in how [`assert.expect()`](https://qunitjs.com/api/assert/expect/) counts steps for `assert.verifySteps()`. [#1226](https://github.com/qunitjs/qunit/issues/1226)

### Fixed

* Core: Fix missing second frame in QUnit.stack() in Safari. [#1776](https://github.com/qunitjs/qunit/pull/1776)
* Core: Fix stacktrace cleaner to support URLs with host ports. [#1769](https://github.com/qunitjs/qunit/issues/1769)
* HTML Reporter: Fix reversed order after clicking "Hide passed". [#1763](https://github.com/qunitjs/qunit/pull/1763)
* HTML Reporter: Fix encoding of label for urlConfig multi-value item.

2.21.0 / 2024-05-29
==================

### Added

* Assert: Add [`assert.closeTo()`](https://qunitjs.com/api/assert/closeTo/). (Timo Tijhof) [#1735](https://github.com/qunitjs/qunit/issues/1735)
* Core: Add support for [flat preconfig](https://qunitjs.com/api/config/) via environment/global variables. (Timo Tijhof)

### Deprecated

* Core: Deprecate `QUnit.load()` and document migration path at <https://qunitjs.com/api/QUnit/load/>. (Timo Tijhof) [#1743](https://github.com/qunitjs/qunit/pull/1743)
* Core: Deprecate unset [testTimeout](https://qunitjs.com/api/config/testTimeout/) for tests taking longer than 3 seconds. (Timo Tijhof) [#1483](https://github.com/qunitjs/qunit/issues/1483)

2.20.1 / 2024-02-15
==================

### Fixed

* Core: Fix compatibility with `sinon.useFakeTimers` in IE 10 and IE 11. (Timmy Willison) [#1738](https://github.com/qunitjs/qunit/pull/1738)
* Core: Fix hanging `assert.async()` after `assert.timeout()`. (Timo Tijhof) [#1705](https://github.com/qunitjs/qunit/issues/1705)

2.20.0 / 2023-09-23
==================

### Added

* Core: Add `QUnit.reporters.perf`. (Timo Tijhof) [#1714](https://github.com/qunitjs/qunit/pull/1714)

### Changed

* Assert: Add type check for `assert.async()` parameter. (Zixin Yin) [#1721](https://github.com/qunitjs/qunit/issues/1721)
* HTML Reporter: Remove units for 0 values in qunit.css. (Hareesh) [#1715](https://github.com/qunitjs/qunit/pull/1715)

### Fixed

* Core: Faster `inArray` by using Array.prototype.includes when possible. (Izel Nakri)

2.19.4 / 2023-01-23
==================

### Fixed

* Core: Fix memory leak via `config.timeoutHandler` from last async test. (Sergey Astapov)

2.19.3 / 2022-10-22
==================

### Fixed

* Assert: Restore how deepEqual treats imposter objects. (Timo Tijhof) [#1706](https://github.com/qunitjs/qunit/issues/1706)

2.19.2 / 2022-10-17
==================

### Changed

* Core: Faster diffing for `config.noglobals` by refactoring slow mutations. (Izel Nakri) [#1697](https://github.com/qunitjs/qunit/pull/1697)
* Assert: Improve performance of `QUnit.equiv()`. (Izel Nakri) [#1700](https://github.com/qunitjs/qunit/pull/1700)
* Assert: Faster deepEqual for Map values by avoiding typeEquiv calls. (Timo Tijhof)
* Assert: Faster deepEqual by reducing internal objectType checks. (Timo Tijhof)
* Assert: Faster deepEqual by using re-assignment for internal pairs. (Timo Tijhof)

### Fixed

* Core: Fix inaccurate count in reporter output after re-run. [#1687](https://github.com/qunitjs/qunit/issues/1687)
* CLI: Fix MaxListeners warning in long-running watch mode. [#1692](https://github.com/qunitjs/qunit/issues/1692)

2.19.1 / 2022-05-01
==================

### Fixed

* HTML Reporter: Restore float-clear for narrow viewports. [87c90ce2e0](https://github.com/qunitjs/qunit/commit/87c90ce2e0eb03f3d10b8cec07c0ac9b3709b0d7)

2.19.0 / 2022-04-28
==================

### Added

* CLI: Add `--module` option. (Shachar) [#1680](https://github.com/qunitjs/qunit/issues/1680)
* Core: Add `moduleId` to [`QUnit.begin()`](https://qunitjs.com/api/callbacks/QUnit.begin/) details object.

### Fixed

* Core: Fix event "runtime" data to be rounded to milliseconds.
* Core: Fix pretty stacktrace shortening to work on Windows.
* HTML Reporter: Faster toolbar setup by reusing `beginDetails.modules`.

2.18.2 / 2022-04-17
==================

### Changed

* HTML Reporter: Improve accessibility and design of the module filter. (Timo Tijhof) [#1664](https://github.com/qunitjs/qunit/issues/1664#issuecomment-1101007741)
* HTML Reporter: Improve fuzzy-matching of the module filter. (Timo Tijhof) [#1685](https://github.com/qunitjs/qunit/pull/1685)

### Fixed

* HTML Reporter: Faster rendering of module filter results. [#1685](https://github.com/qunitjs/qunit/pull/1685), [#1664](https://github.com/qunitjs/qunit/issues/1664)
* HTML Reporter: Fix retention of state over multiple module searches. [#1683](https://github.com/qunitjs/qunit/issues/1683)
* HTML Reporter: Fix runtime to be rounded in Chromium. [#1678](https://github.com/qunitjs/qunit/issues/1678)

2.18.1 / 2022-03-29
==================

### Fixed

* HTML Reporter: Fix source attribution for test definitions. [#1679](https://github.com/qunitjs/qunit/issues/1679)
* Core: Fix preconfig support in SpiderMonkey and other environments. [0befe2aafe](https://github.com/qunitjs/qunit/commit/0befe2aafe913704db958c472ed6f2a37ec8caaf)
* Core: Improve performance of async pauses with native Map when available. [aa7314b431](https://github.com/qunitjs/qunit/commit/aa7314b431db10d321109c78041747b681e1521c)

2.18.0 / 2022-02-15
==================

### Added

* Assert: New `assert.propContains()` for partial object comparison. (Izel Nakri) [#1668](https://github.com/qunitjs/qunit/pull/1668)
* Core: Add `QUnit.hooks` to globally add beforeEach and afterEach. (Timo Tijhof) [#1475](https://github.com/qunitjs/qunit/issues/1475)
* CLI: Add support for watching `.ts` files when TypeScript is used. (Timo Tijhof) [#1669](https://github.com/qunitjs/qunit/issues/1669)
* CLI: Add support for watching `.json`, `.cjs`, and `.mjs` files. [#1676](https://github.com/qunitjs/qunit/pull/1676)

### Fixed

* CLI: Fix ESM file imports on Windows to use file-protocol URLs. (Timo Tijhof) [#1667](https://github.com/qunitjs/qunit/issues/1667)
* CLI: Improve performance of watch mode by recursively ignoring directories. (Timo Tijhof) [#1676](https://github.com/qunitjs/qunit/pull/1676)

2.17.2 / 2021-09-19
==================

### Changed

* CLI: Reduce npm install size by 35 kB. (Timo Tijhof) [node-watch#115](https://github.com/yuanchuan/node-watch/pull/115)

### Fixed

* Core: Correctly ignore late tests after a nested `QUnit.module.only()` closure. (Steve McClure) [#1645](https://github.com/qunitjs/qunit/issues/1645)
* Core: Restore fake test for "No tests were run" message. (Timo Tijhof) [#1652](https://github.com/qunitjs/qunit/pull/1652)
* HTML Reporter: Restore URL parameter reading. (Timo Tijhof) [#1657](https://github.com/qunitjs/qunit/issues/1657)

2.17.1 / 2021-09-09
==================

### Fixed

* HTML Reporter: Fix `display: none` regression with the "global failure" message. (Timo Tijhof) [#1651](https://github.com/qunitjs/qunit/issues/1651)

2.17.0 / 2021-09-05
==================

### Added

* HTML Reporter: Add "Rerun failed tests" link. (Jan Buschtöns) [#1626](https://github.com/qunitjs/qunit/pull/1626)
* Core: New `error` event for bailing on uncaught errors. (Timo Tijhof) [#1638](https://github.com/qunitjs/qunit/pull/1638)

### Changed

* Core: Improve warning for incorrect hook usage to include module name. (Chris Krycho) [#1647](https://github.com/qunitjs/qunit/issues/1647)

### Deprecated

* Core: The internal `QUnit.onError` and `QUnit.onUnhandledRejection` callbacks are deprecated. [#1638](https://github.com/qunitjs/qunit/pull/1638)

  These were undocumented, but may have been used in a fork or other custom runner for QUnit.
  Switch to the supported [`QUnit.onUncaughtException`](https://qunitjs.com/api/extension/QUnit.onUncaughtException/) instead.

### Fixed

* Assert: Improve validation handling of `assert.throws()` and `assert.rejects()`. (Steve McClure) [#1637](https://github.com/qunitjs/qunit/issues/1637)
* Core: Ensure skipped child module hooks don't leak memory. (Ben Demboski) [#1650](https://github.com/qunitjs/qunit/pull/1650)
* Core: Fix bad module nesting when module closure throws global error. [#1478](https://github.com/qunitjs/qunit/issues/1478)
* Core: Fix reporting of uncaught errors during `QUnit.begin()`. (Timo Tijhof) [#1446](https://github.com/qunitjs/qunit/issues/1446)
* Core: Fix reporting of uncaught errors during or after `QUnit.done()`. (Timo Tijhof) [#1629](https://github.com/qunitjs/qunit/pull/1629)

2.16.0 / 2021-06-06
==================

### Added

* Core: New `QUnit.test.each()` method for data providers. (ventuno) [#1568](https://github.com/qunitjs/qunit/issues/1568)
* Core: New `failOnZeroTests` configuration option. (Brenden Palmer)
* Core: New `QUnit.reporters` interface. (Timo Tijhof) [f8948c9](https://github.com/qunitjs/qunit/commit/f8948c96fdcef0b0f96d27acaa59faacbabaf0f9) [js-reporters#133](https://github.com/js-reporters/js-reporters/issues/133)

  This introduces support for using the `tap` reporter in a browser.
  This was previously limited to the CLI.

### Changed

* Assert: Indicate which test a drooling `assert.async()` callback came from. (Steve McClure) [#1599](https://github.com/qunitjs/qunit/pull/1599)

### Deprecated

* Core: Warn when a module callback has a promise as a return value. (Ray Cohen) [#1600](https://github.com/qunitjs/qunit/issues/1600)

### Fixed

* Core: Fix `QUnit.module.only()` regression where some unrelated modules also executed. (Steve McClure) [#1610](https://github.com/qunitjs/qunit/issues/1610)
* CLI: Improve ESM detection. (Steve McClure) [#1593](https://github.com/qunitjs/qunit/issues/1593)
* HTML Reporter: Increase contrast and use richer colors overall. (Timo Tijhof) [#1587](https://github.com/qunitjs/qunit/pull/1587)

2.15.0 / 2021-04-12
==================

### Changed

* HTML Reporter: Trim whitespace of the filter input. (Nathaniel Furniss) [#1573](https://github.com/qunitjs/qunit/pull/1573)
* CLI: Upgrade `js-reporters` to 2.0.0. [#1577](https://github.com/qunitjs/qunit/pull/1577)

### Deprecated

* Core: Warn when setting hooks for a different module. (Ray Cohen) [#1586](https://github.com/qunitjs/qunit/pull/1586)

### Fixed

* Assert: Fix `assert.throws()` to fail gracefully when expected class does not match. (Steve McClure) [#1530](https://github.com/qunitjs/qunit/issues/1530)
* CLI: Fix TAP output to support cyclical objects. (Zachary Mulgrew) [#1555](https://github.com/qunitjs/qunit/issues/1555) [js-reporters#104](https://github.com/js-reporters/js-reporters/issues/104)
* CLI: Fix TAP output for the `Infinity` value, previously became `null`. (Timo Tijhof) [#1406](https://github.com/qunitjs/qunit/issues/1406)
* CLI: Fix TAP output going silent if `console` object is mocked. (Timo Tijhof) [#1340](https://github.com/qunitjs/qunit/issues/1340)

2.14.1 / 2021-03-14
==================

### Changed

* CLI: Upgrade `commander` to 7.1.0. (Timo Tijhof) [#1564](https://github.com/qunitjs/qunit/issues/1564)

### Fixed

* Core: Restore strict mode compatibility (Edward Faulkner) [#1558](https://github.com/qunitjs/qunit/pull/1558)
* HTML Reporter: Check for undefined `testItem` in testDone callback. (Timo Tijhof)

2.14.0 / 2021-01-12
==================

### Added

* HTML Reporter: Use a fixed header with scrollable test results. (Bryan Crotaz) [#1513](https://github.com/qunitjs/qunit/pull/1513)
* Core: Add official support for SpiderMonkey runtime. (Timo Tijhof) [#1535](https://github.com/qunitjs/qunit/issues/1535)

### Changed

* CLI: Update and re-audit `tiny-glob` and `node-watch`  dependencies. [#1522](https://github.com/qunitjs/qunit/issues/1522), [#1524](https://github.com/qunitjs/qunit/issues/1524)

### Fixed

* HTML Reporter: Set `main` and `navigation` ARIA roles. (Steve McClure) [#1427](https://github.com/qunitjs/qunit/issues/1427)
* Core: Fix `QUnit.module.only` logic for unscoped modules. (Steve McClure) [#1272](https://github.com/qunitjs/qunit/issues/1272)
* Assert: Fix `assert.timeout()` bug causing a non-async test to fail. [#1539](https://github.com/qunitjs/qunit/issues/1539)

2.13.0 / 2020-11-29
==================

### Added

* Core: Log test name as part of "Assertion after test" failures. (brandonocasey) [#1517](https://github.com/qunitjs/qunit/pull/1517)
* CLI: Add native support for ESM .mjs files on Node 12+. (Timo Tijhof) [#1465](https://github.com/qunitjs/qunit/issues/1465)

### Deprecated

* HTML Reporter: Deprecate PhantomJS. (Steve McClure)

### Fixed

* Core: Count tests run so that `suiteEnd` emits correctly with active filters. (Stephen Yeung) [#1416](https://github.com/qunitjs/qunit/issues/1416)
* Core: Fix test counter bug when nesting invalid test functions. (Timo Tijhof)
* HTML Reporter: Avoid leaking `Map` global in older browsers. (Timo Tijhof)

2.12.0 / 2020-11-08
==================

### Added

* Core: Add `QUnit.test.*` aliases for `QUnit.only()`, `QUnit.skip()`, and `QUnit.todo()`. (Steve McClure) [#1496](https://github.com/qunitjs/qunit/pull/1496)
* Assert: Support arrow functions in `assert.throws()` expected callback. (Steve McClure) [#1492](https://github.com/qunitjs/qunit/pull/1492)

### Changed

* CLI: Update `node-watch` and `commander` dependencies. (Timo Tijhof) [#1500](https://github.com/qunitjs/qunit/pull/1500)

### Deprecated

* Core: Deprecate `QUnit.extend()`. (Steve McClure)

2.11.3 / 2020-10-05
==================

### Fixed

* CLI: Fix 'qunit' require error on Node 10 if qunit.json exists. [#1484](https://github.com/qunitjs/qunit/issues/1484)

2.11.2 / 2020-09-09
==================

### Fixed

* CLI: Align `actual` whitespace with `expected` in TapReporter. (Robert Jackson) [js-reporters/js-reporters#107](https://github.com/js-reporters/js-reporters/pull/107) [#1481](https://github.com/qunitjs/qunit/pull/1481)

2.11.1 / 2020-08-25
==================

### Fixed

* CLI: Improve startup performance by using `tiny-glob`. [#1476](https://github.com/qunitjs/qunit/pull/1476)

2.11.0 / 2020-08-16
==================

### Added

* Assert: New strict boolean `assert.true()` and `assert.false()` methods. (Ventuno) [#1445](https://github.com/qunitjs/qunit/pull/1445)
* Docs: Redesign of <https://qunitjs.com>. (Trent Willis) [#1458](https://github.com/qunitjs/qunit/issues/1458)
* HTML Reporter: New fuzzy search when typing in the module filter. (Ventuno) [#1440](https://github.com/qunitjs/qunit/pull/1440)

### Changed

* HTML Reporter: Hide skipped tests also when `hidepassed` is set. (Ray Cohen) [#1208](https://github.com/qunitjs/qunit/issues/1208)

### Fixed

* CLI: Improve performance for non-glob arguments. (SparshithNRai) [#1385](https://github.com/qunitjs/qunit/pull/1385)
* CLI: Fix error with `--watch` option, affected Node 14 on Linux. [#1448](https://github.com/qunitjs/qunit/pull/1448)
* Core: Fix "No tests" to check test count instead of assert count. (Jessica Jordan) [#1405](https://github.com/qunitjs/qunit/issues/1405)

### Removed

* All: Remove support for Node 6 and Node 8, require Node 10+.

2.10.1 / 2020-07-04
==================

### Fixed

* HTML Reporter: Scope QUnit UI button style to not affect `#qunit-fixture`. (XhmikosR) [#1437](https://github.com/qunitjs/qunit/issues/1437)

2.10.0 / 2020-05-02
==================

### Changed

* Core: Run all `QUnit.only`-marked tests. (Ventuno) [#1436](https://github.com/qunitjs/qunit/pull/1436)

### Fixed

* Docs: Add project logo to README. (Jim Lynch)
* HTML Reporter: Fix tab order for toolbar filters. (Eddy Lu)

2.9.3 / 2019-10-08
==================

### Added

* HTML Reporter: Display progress and runtime while test suite is executing. (Stefan Penner) [#1398](https://github.com/qunitjs/qunit/pull/1398)

### Fixed

* CLI: Ignore folders mentioned in the gitignore to improve performance. (SparshithNRai)
* Core: Defer getting the stack trace to improve performance. (Adam Byrne)
* Core: Let `assert.timeout()` replace the timeout if `config.timeout` was already set.

2.9.2 / 2019-02-21
==================

### Fixed

* Core: Ensure semaphores are balanced when timeout occurs. [#1376](https://github.com/qunitjs/qunit/pull/1376)
* HTML Reporter: Avoid inline styles to support CSP without `unsafe-inline`.

2.9.1 / 2019-01-07
==================

### Fixed

* Release: Restore missing files that were accidentally missing in the 2.9.0 npm package. [#1368](https://github.com/qunitjs/qunit/pull/1368)

2.9.0 / 2019-01-06
==================

### Fixed

* Assert: Report errors from `assert.throws()` as strings. [#1333](https://github.com/qunitjs/qunit/issues/1333)
* CLI: Reduce size of the npm package dependency tree. (Timo Tijhof) [#1342](https://github.com/qunitjs/qunit/issues/1342)
* HTML Reporter: Fix an unescaped `details.source`. (Shlomi Fish) [#1341](https://github.com/qunitjs/qunit/pull/1341)

2.8.0 / 2018-11-02
==================

### Added

* Core: Add support for async functions and Promise-returns to QUnit event handlers. These can now be used via `QUnit.begin`, `QUnit.moduleStart`, `QUnit.testStart`, `QUnit.testDone`, `QUnit.moduleDone`, and `QUnit.done`. (Stephen Yeung) [#1307](https://github.com/qunitjs/qunit/pull/1307)
* Core: Add stack trace to uncaught error if the browser supports it. (Anand Thakker)

### Changed

* HTML Reporter: Add a `running` class to list items, for use by plugins. This was previously removed in 2.7.0. [#1323](https://github.com/qunitjs/qunit/pull/1323)

2.7.1 / 2018-10-17
==================

### Fixed

* Core: Avoid breaking tests if the browser throws an error from `performance.measure`. (Gabriel Csapo)

2.7.0 / 2018-10-10
==================

### Added

* HTML Reporter: Add "User Timings" for each test to the browser's Performance Timeline. (Tobias Bieniek) [#1296](https://github.com/qunitjs/qunit/pull/1296)

### Fixed

* CLI: Remove need for `fsevents` extension by upgrading the `sane` package. (Stefan Penner) [#1314](https://github.com/qunitjs/qunit/pull/1314)
* HTML Reporter: Fix XHTML output issue. (Shlomi Fish) [#1317](https://github.com/qunitjs/qunit/pull/1317)

2.6.2 / 2018-08-19
==================

### Fixed

* Assert: Remove redundant return statement from `assert.pushResult()`. (Ger Hobbelt) [#1298](https://github.com/qunitjs/qunit/pull/1298)
* CLI: Update `fsevents` extension for Node 10 compatibility. (Tobias Bieniek) [#1295](https://github.com/qunitjs/qunit/pull/1295)

2.6.1 / 2018-05-15
==================

### Fixed

* Core: Ensure module and test callbacks are released for GC. (Robert Jackson) [#1279](https://github.com/qunitjs/qunit/pull/1279)
* HTML Reporter: Disable autocomplete on module search input. (Christian) [#1277](https://github.com/qunitjs/qunit/pull/1277)

2.6.0 / 2018-03-26
==================

### Added

* CLI: New `--require` option. (Trent Willis) [#1271](https://github.com/qunitjs/qunit/pull/1271)

### Changed

* Assert: Fail test if a non-string value is passed to `assert.step()`.
* Assert: Recognize `undefined` and other falsy rejection values in `assert.rejects()`.
* Core: Throw an error if no tests are run.

### Fixed

* Assert: Clone steps array in `assert.verifySteps()` before exposing to logging callbacks. [#1267](https://github.com/qunitjs/qunit/pull/1267)
* Core: Ensure late-add high-priority tests are inserted in proper order. [#1269](https://github.com/qunitjs/qunit/pull/1269)

2.5.1 / 2018-02-27
==================

### Changed

* HTML Reporter: Restore attributes on `#qunit-fixture` between tests. (Robert Jackson) [#1250](https://github.com/qunitjs/qunit/pull/1250)
* Assert: Fail test if using `assert.step()` without `assert.verifySteps()`.

### Fixed

* Core: Release all processing locks when Promise rejects from a test. [#1253](https://github.com/qunitjs/qunit/pull/1253)

2.5.0 / 2018-01-09
==================

### Added

* Assert: New `assert.rejects()` method. (Robert Jackson) [#1238](https://github.com/qunitjs/qunit/pull/1238)
* CLI: Fail test if there are unhandled rejections, similar to uncaught errors. (Robert Jackson) [#1241](https://github.com/qunitjs/qunit/pull/1241/)
* HTML Reporter: Fail test if there are unhandled rejections, similar to uncaught errors. (Robert Jackson) [#1241](https://github.com/qunitjs/qunit/pull/1241/)

### Changed

* Assert: The `assert.verifySteps()` method now resets the steps buffer, making it easier to use multiple times in a single test. [#1233](https://github.com/qunitjs/qunit/pull/1233)

### Fixed

* Core: Remove artificial delays from internal `setTimeout` processing code. [#1246](https://github.com/qunitjs/qunit/pull/1246)

2.4.1 / 2017-10-21
==================

* CLI: Add slight debounce to restarting tests on file watching.
* CLI: Catch file load failures and report as failing tests.
* CLI: Clear require cache of watched files between runs.
* CLI: List available reporters when option is specified with no value.
* CLI: Properly support watching files added after first run.
* HTML Reporter: Fix regression in error reporting.

2.4.0 / 2017-07-08
==================

* Assert: Fix assert.push deprecation link.
* Assert: New `assert.timeout()` for setting per-test timeout durations.
* CLI: Better messaging on early exits.
* CLI: Default to non-zero exit code.
* CLI: Exit with non-zero status when no tests are run.
* Core: Add support for multiple callbacks in module hooks, such as via `hooks.beforeEach()` and `hooks.afterEach()`.
* Core: Fallback to `typeof obj` in `QUnit.objectType`.
* Core: New `QUnit.module.only()` method.
* Core: New `QUnit.module.skip()` method.
* Core: New `QUnit.module.todo()` method.
* Core: Fix memory release of objects in equiv logic of `assert.deepEqual()`.

2.3.3 / 2017-06-02
==================

### Added

* Core: Support running in Web Workers. (Marten Schilstra) [#1171](https://github.com/qunitjs/qunit/pull/1171)

### Changed

* CLI: Prefer local version of QUnit.

2.3.2 / 2017-04-17
==================

* HTML Reporter: Add specific diff for number types instead of str-diff. #1155
* Core: Fix bug calling hooks with skipped tests. #1156

2.3.1 / 2017-04-10
==================

* Assert: Allow assertions after async.
* Assert: Throw if async callback invoked after test finishes.
* Core: Ensure assertions occur while test is running.
* Core: Fix test instance memory leak. #1138
* Core: Slim assertions after reporting them.

2.3.0 / 2017-03-29
==================

### Added

* CLI: Introduce QUnit CLI. (Trent Willis) [#1115](https://github.com/qunitjs/qunit/pull/1115)
* CLI: Add file watching option.
* CLI: Add seed option.
* CLI: Add support for custom reporters.
* HTML Reporter: Display todo tests when `hidepassed` is set.

### Changed

* Core: `Test#pushFailure` now calls `Test#pushResult` internally.

2.2.1 / 2017-03-19
==================

* Core: Fix sessionStorage feature detection.

2.2.0 / 2017-03-11
==================

### Added

* Core: Support running in a sandboxed iframe.
* Core: New event emitter. (Trent Willis) [#1087](https://github.com/qunitjs/qunit/pull/1087)
* Core: New `QUnit.todo()` method. (Trent Willis) [#1080](https://github.com/qunitjs/qunit/pull/1080)
* Assert: New `assert.step()` and `assert.verifySteps()` methods. (Trent Willis)(Trent Willis) [#1075](https://github.com/qunitjs/qunit/issues/1075)

### Changed

* Core: QUnit.onError now expects error or error-like object.
* Core: Include "todo" in assertion event data.

### Fixed

* HTML Reporter: Ensure window.onerror return values are correct.
* Core: Fix start on Node when autostart is not set to true. #1105
* Core: Fix double begin when calling start in Node.
* Core: Rewrite QUnit.equiv to be breadth-first.
* Core: Optimize the "set" and "map" callbacks.
* Core: Fix console error in IE9. #1093

2.1.1 / 2017-01-05
==================

* All: Remove deprecated 1.x features.
* Assert: Deprecate `assert.push()`.
* Core: `QUnit.start()` no longer requires calling `QUnit.load()` first.
* HTML Reporter: Add an "Abort" button.

2.1.0 / 2016-12-05
==================

* Core: Support a predefined QUnit.config.
* Core: Fix clearing of storage on done.
* Core: Always report if test previously failed.
* Core: New `config.storage` option.
* Core: Load the onerror module.
* Core: Fix QUnit.equiv object methods comparison.
* Core: Support multiple nested modules hooks properly.
* Core: Fire moduleStart only when starting module for the first time.
* Core: Fire moduleDone when actually finished with module.
* HTML Reporter: Decouple from sessionStorage reordering logic.
* HTML Reporter: Fix expanding failed tests when collapse is false.
* HTML Reporter: Handle URL params named like `Object.prototype` properties.
* Release: Use SPDX format in bower.json's license.

2.0.1 / 2016-07-23
==================

* Core: Prevent multiple "begin" events from calling `QUnit.load()`.
* Core: Use callback-based pause/resume for better multi-pause isolation.
* HTML Reporter: Fix apply/reset button visibilty.
* Core: Ensure runtime for skipped tests is 0.
* Dump: New parser for `Symbol` type.

2.0.0 / 2016-06-16
==================

* All: Remove deprecated features.
* All: Remove `QUnit.config.autorun`.
* All: Prevent async tests from having multiple resume timeouts.
* Assert: Remove `assert.throws()` signature with string expected value.
* Dump: update typeOf to extract extra complex type definition.
* Core: New `before` and `after` module hooks.
* Core: Decode "+" to " " (space) in url params.
* Core: Throw error if QUnit is already defined globally.
* HTML Reporter: Add reset/apply buttons in the module picker.
* HTML Reporter: Improve module picker accessibility. (Richard Gibson)
* HTML Reporter: Improve color/background order consistency. (Richard Gibson)
* HTML Reporter: Improve toolbar styles. (Richard Gibson)
* HTML Reporter: Add multi-select module dropdown. (Maciej Lato)

2.0.0-rc1 / 2016-04-19
=====================

* All: Remove deprecated features.
* All: Remove `QUnit.config.autorun`.
* Assert: Remove `assert.throws()` signature with string expected value.
* Core: New `before` and `after` module hooks.
* HTML Reporter: Add multi-select module dropdown.

1.23.1 / 2016-04-12
===================

* Core: Prevents "throws" keyword from breaking Rhino environments.
* Core: Be consistent in function type checks.

1.23.0 / 2016-03-25
==================

* Core: Move URL parameter handling to HTML Reporter.
* Core: Reintroduce `QUnit.config.module`.
* Core: Stop splitting URL parameter values by commas.
* Core: New `moduleId`-based filtering.
* Core: Support running tests in pseudo-random order.
* Dump: Fix asymmetrical function dump argument spacing.
* HTML Reporter: Fix escaping of diffs.
* HTML Reporter: Add message explaining missing diff.
* HTML Reporter: Fix hidepassed element check.
* Assert: Treat "Set" and "Map" types as unordered in `QUnit.equiv`.

1.22.0 / 2016-02-23
==================

* Assert: New `assert.pushResult()` method.
* Assert: Extend Assert methods to QUnit for backwards compatibility.
* HTML Reporter: Escape setUrl output.

1.21.0 / 2016-02-01
==================

* Assert: Improve speed of QUnit.equiv.
* Assert: Fully support Object-wrapped primitives in `assert.deepEqual()`.
* Assert: Register notOk as a non-negative assertion.
* Core: Improve regular expression comparisons.
* Core: Support filtering by regular expression.
* HTML Reporter: Fix hidden test results under static parents.

1.20.0 / 2015-10-27
==================

* Assert: Expose `assert.raises()` to the global scope.
* Assert: Add an optional `callCount` parameter to `assert.async()`.
* Core: New `QUnit.only()` method.
* Core: Support Symbol types on `QUnit.equiv`.
* Core: Make `QUnit.start` fails if called with a non-numeric argument.
* Core: New nested scopes ability for modules.
* Core: Equivalency for descendants of null constructors.
* HTML Reporter: Add indicator for filtered test.
* HTML Reporter: Collapse details for successive failed tests.

1.19.0 / 2015-09-01
==================

* Assert: Add support for ES6 Map and Set to equiv for `assert.deepEqual()`.
* Core: New `QUnit.stack()` method.
* Dump: Escape backslash when quoting strings.
* HTML Reporter: Avoid readyState issue with PhantomJS.
* HTML Reporter: HTML reporter enhancements for negative asserts.
* HTML Reporter: Show diff only when it helps.

1.18.0 / 2015-04-03
==================

* Assert: New `assert.notOk()` for asserting falsy values.
* Core: Expose Dump `maxDepth` property.
* Core: Expose QUnit version as `QUnit.version` property.
* Dump: Fix .name/.property doublettes.
* HTML Reporter: New diff using Google's Diff-Patch-Match library.
* HTML Reporter: Make it more obvious why diff is suppressed.
* HTML Reporter: Change display text for bad tests.
* HTML Reporter: Fix checkbox and select handling in IE <9.
* HTML Reporter: Fix test filter without any module.
* HTML Reporter: Retain failed tests numbers.

1.17.1 / 2015-01-20
==================

* HTML Reporter: Fix missing toolbar bug.

1.17.0 / 2015-01-19
==================

* Core: Support Node.js export parity with CommonJS.
* HTML Reporter: Add the filter field.
* HTML Reporter: Don't hide skipped tests.
* HTML Reporter: Fix regression for old markup.
* HTML Reporter: Prevent XSS attacks.
* HTML Reporter: QUnit.url is now a private function in the HTML Reporter.
* HTML Reporter: Url params can be set by code.

1.16.0 / 2014-12-03
==================

### Added

* Assert: Add alias for throws called `assert.raises()`.
* Assert: New `assert.async()`  method.
* Core: Add runtime property to `QUnit.moduleDone()` data.
* Core: New `QUnit.skip()` method.
* Core: `QUnit.test()` now supports returning Promise and async functions.
* HTML Reporter: Add runtime of each assertion to result output.

### Changed

* Core: Change `url()` helper to output `?foo` instead of `?foo=true`.
* Core: Rename config.module to config.moduleFilter.

### Fixed

* Assert: Fail assertions after existing `assert.async()` flows are resolved.
* Core: Restore and warn if some logging callback gets modified.
* Core: Throws an error on non-function params for logging methods.
* Core: Defer begin event till tests actually starts.
* Core: Detail modules and tests names in the logging callbacks.
* Core: Use `Error#stack` without throwing when available.
* Dump: Configurable limit for object depth.

1.15.0 / 2014-08-08
==================

* Assert: Introduce Assert constructor with test context. This heavily improves debugging of async tests, as assertions can't leak into other tests anymore. Use the new `assert` argument in your test to get the full benefit of this.
* Assert: Improve the default message from `assert.ok()`  to include the exact received value.
* Assert: Removal of deprecated `raises`, `same`, and `equals` methods. Use `throws`, `deepEqual`, and `equal` instead.
* Core: Add `totalTests` for total number of tests to `QUnit.begin()`  data.
* Dump: Rename `QUnit.jsDump` to `QUnit.dump`, the old name is kept as deprecated alias and may be removed later.
* Dump: Output non-enumerable properties of TypeError. Makes it easier to compare properties of error objects.
* HTML Reporter: Output only assertion count for green tests. Less visual clutter for passing tests.
* Assert: Support for buggy IE native Error types in `assert.throws()`.

1.14.0 / 2014-01-31
==================

* Addons: Remove last remnants.
* Assert: `assert.throws()` now supports comparing to Error instances.
* Assert: `assert.throws()` now supports comparing to error strings.
* Core: Add config property for disabling default scroll-to-top.
* Core: Add support for "select one" dropdowns to `QUnit.config.urlConfig`.
* Core: Cache window.clearTimeout in case it gets mocked.
* Core: Run multiple tests by test number.
* HTML Reporter: Removing some redundant CSS code.
* Release: Set main property to qunit/qunit.js.

1.13.0 / 2014-01-04
==================

* All: The Grand QUnit Split of 2013. (Timo Tijhof)
* Assert: Remove `raises()`, deprecated in 2012.
* Core: Add runtime property to testDone, deprecate duration.
* Core: Only export to the variable that we check for.
* Core: Properly check for existence of document.
* Core: Remove triggerEvent, which isn't used or documented anywhere.
* Core: Silence addEvent in non-browser env.
* HTML Reporter: Use `id` function for selection elements in two places that were not using it. #463
* Release: Add bower.json. #461

1.12.0 / 2013-06-21
===================

* Addons/Canvas: Show how to test with images. #438
* Addons/JUnitLogger: Add a `name` property to the test run. #389
* Addons/PhantomJS: Added optional timeout. Closes #415.
* Addons/PhantomJS: Include stack trace for all failed tests. #416.
* Addons: Move 'addons/canvas' to 'JamesMGreene/qunit-assert-canvas.git'. Tree: https://github.com/JamesMGreene/qunit-assert-canvas/tree/v1.0.0.
* Addons: Move 'addons/close-enough' to 'JamesMGreene/qunit-assert-close.git'. Tree: https://github.com/JamesMGreene/qunit-assert-close/tree/v1.0.0.
* Addons: Move 'addons/composite' to 'jquery/qunit-composite.git'. Tree: https://github.com/jquery/qunit-composite/tree/v1.0.0. #419.
* Addons: Move 'addons/junitlogger' to 'jquery/qunit-reporter-junit.git'.
* Addons: Move 'addons/step' to 'JamesMGreene/qunit-assert-step.git'. Tree: https://github.com/JamesMGreene/qunit-assert-step/tree/v1.0.0.
* Addons: Move 'addons/themes/gabe' to 'Krinkle/qunit-theme-gabe.git'.
* Addons: Move 'addons/themes/ninja' to 'Krinkle/qunit-theme-ninja.git'.
* Addons: Move 'addons/themes/nv' to 'Krinkle/qunit-theme-nv.git'.
* Assert: Message for `assert.ok()` shouldn't be undefined in 'log' event.
* Core: Deprecate QUnit.current_testEnvironment in favour of config.current.testEnvironment.
* Core: Emit moduleStart before testStart even if test isn't in a module.
* Core: Fix mismatch between moduleStart and moduleDone events.
* Core: Improve circular reference logic in equiv. #397
* Core: Removed jQuery.trim optimization. #424
* Core: Sort the module names so we no longer rely on implicit ordering. #391, #392
* Core: Use a local setTimeout reference for internal reference to failures if later stubbed. #432, #433.
* HTML Reporter: Clear filter and testNumber when choosing a module. #442

1.11.0 / 2013-01-20
==================

### Added

* Addons: New "Ninja" theme.
* Assert: New `assert.propEqual()` and `assert.notPropEqual()`. (Timo Tijhof) [#317](https://github.com/qunitjs/qunit/issues/317)
* HTML Reporter: Capture and show each test's runtime duration. #344

### Changed

* Addons/Composite: Test suites can be named by including an obj with name & path props within array param for `.testSuites()`.
* Addons/PhantomJS: Include source in assertion details.
* Core: Apply the same exception handling for test and teardown try/catch as for setup.

### Fixed

* Addons/Canvas: Use 0.6 as alpha value to avoid inconsistencies between browsers. #342
* Addons/JUnitLogger: Rewrite as it was in bad shape (unused vars, duplicate internal code, sub-optimal XmlWriter logic).
* Addons/PhantomJS: Removed the polling mechanism in favor of PhantomJS 1.6+'s `WebPage#onCallback`.
* Assert: Make `throws` ES3 compatible. (Mathias Bynens)
* Core: Fix URL generator to take protocol and host into account to fix usage with file protocol in IE7/8.
* Core: Fix issue with Error.prototype.toString in IE 7.
* Core: Improve start()-called-too-often fix, initialize semaphore at 1, fixes autostart=false case. Also provide stack for the offending start() call.
* Core: Push a failing assertion when calling start() while already running. Resets anyway to keep other tests going. #314
* Core: Remove global variable "assert". #341
* Core: There's type-free objects in Firefox, extend objectType() to allow null match. #315
* Dump: Extend jsdump to output Error objects as such, including the message property. Extend throws to provide 'expected' value when possible. #307
* Dump: Include contents of text nodes in `jsDump.node`. (Timo Tijhof) #380
* HTML Reporter: Delay start until `QUnit.init` happened. #358
* HTML Reporter: Change summary text to use the word "assertions" instead of "tests". #336
* HTML Reporter: Fix exception from Diff on property "constructor". #394
* HTML Reporter: Fix module picker for old IE. #366.
* HTML Reporter: Fix urlConfig checkbox event for old IE. #369
* HTML Reporter: Use classes to collapse assertion groups. #269

1.10.0 / 2012-08-30
==================

* All: Simplify licensing to only MIT, no more MIT/GPL dual licensing.
* Assert: Equiv for `assert.deepEqual()` now recognizes the ES6 sticky "y" flag for RegExp objects. #284
* Assert: Make `QUnit.expect()` without arguments behave as a getter. #226
* Core: Add module and test name to the data provided via `QUnit.log()`. #296
* Core: Keep a local reference to Date for internal use. #283
* HTML Reporter: Add a UI for the module filter.
* HTML Reporter: Always display of global errors regardless of filtering URL parameters. #288
* HTML Reporter: Scroll the window back to top after tests finished running. #304

1.9.0 / 2012-07-11
==================

* Assert: Rename `assert.raises()` to `assert.throws()`, keeping an alias for compat. #267
* Core: Make the module filter case-insensitive. #252
* HTML Reporter: Link should ignore "testNumber" and "module". #270
* HTML Reporter: Move checkboxes into toolbar and give them labels and tooltip descriptions. #274
* HTML Reporter: Remove use of shadows and change border radius to 5px for pass/error.
* Release: Start publishing to npm under the `qunitjs` package name.

1.8.0 / 2012-06-14
==================

* Assert: Avoid global eval error from `assert.raises()` being reported as global exception in IE. #257
* Core: Reset config.current at the right time. #260
* HTML Reporter: Improve window.onerror handling.
* HTML Reporter: New `module` url parameter. #252

1.7.0 / 2012-06-07
==================

* Addons: Add CLI runner for Phantomjs.
* Assert: Refactor assertion helper functions into a new extensible `QUnit.assert` object, globals remain for compat.
* Core: Fix confusion of Date type as Object in `assert.deepEqual()`. #250
* Core: Improve extractStacktrace logic. #254
* Core: Make "Rerun" link only run one test by tracking execution order. #241
* Core: Make filters case-insensitive. #252
* Core: New `config.requireExpects` option. #207
* HTML Reporter: Add Rerun link to placeholders. #240

1.6.0 / 2012-05-04
==================

* Addons/Composite: Double clicking on composite test rows opens individual test page.
* Core: Only check for an `exports` object to detect a CommonJS environment, fixes compat with RequireJS. #237
* HTML Reporter: Prefix test-output id and ignore that in noglobals check. #212

1.5.0 / 2012-04-04
==================

* Core: Add stats results to data. QUnit.jUnitReport function take one argument `{   xml:'<?xml ...',   results:{failed:0, passed:0, total:0, time:0} }`.
* Core: Call test "block" with config.current.testEnvironment. #217
* Core: Fix clearing of sessionStorage in Firefox 3.6.
* HTML Reporter: Modify "Running..." to display test name. #220

1.4.0 / 2012-03-10
==================

* Core: Add QUnit.pushFailure to log error conditions like exceptions. Accepts stacktrace as second argument, allowing extraction with catched exceptions (useful even in Safari). Remove old `fail()` function that would just log to console, not useful anymore as regular test output is much more useful by now. Move up `QUnit.reset()` call to just make that another failed assertion. Used to not make a test fail. #210
* Core: Apply "notrycatch" option to setup and teardown callbacks. #203, #204
* Core: Extend exports object with QUnit properties at the end of the file to export everything.
* Core: Make test fail if no assertions run. #178
* Core: Prefix test-related session-storage items to make removal more specific. #213
* HTML Reporter: Sort objects in value dumps alphabetically to improve diffs. #206

1.3.0 / 2012-02-26
==================

* Addons: New Gabe theme by Gabe Hendry. [#188](https://github.com/qunitjs/qunit/pull/188)
* Addons: New NV theme by NV. [#62](https://github.com/qunitjs/qunit/pull/62)
* Addons: New junitlogger addon.
* Core: Catch assertions running outside of `test()` context, make sure source is provided even for `ok()`. #98
* Core: Check for global object to find setTimeout in Node.js.
* Core: Clear all sessionStorage entries once all tests passed. Helps getting rid of items from renamed tests. #101
* Core: Fix sourceFromsStacktrace to get the right line in Firefox. Shift the 'error' line away in Chrome to get a match.
* Core: Generate more base markup, but allow the user to exclude that completely or choose their own. #127
* Core: In autorun mode, moduleDone is called without matching moduleStart. #184
* Core: Remove the testEnvironmentArg to `test()`. Most obscure, never used anywhere. `test()` is still heavily overloaded with argument shifting, this makes it a little more sane. #172
* Core: Replace deprecated same and equals aliases with placeholders that just throw errors, providing a hint at what to use instead. Rename test file to match that.
* Core: Serialize expected and actual values only when test fails to improve testing speed for passing tests. #183
* Core: Update sessionStorage support test to avoid QUOTA_EXCEEDED_EXCEPTION.
* HTML Reporter: Avoid `outerHTML` for Firefox < 11. Use cloneNode instead.
* HTML Reporter: Escape `document.title` before inserting into markup. #127
* HTML Reporter: Fix the fixture reset to not break if the element is not present on the page.
* HTML Reporter: Keep label and checkbox together.
* HTML Reporter: Set fixed CSS dimensions on `#qunit-fixture`. #114
* HTML Reporter: Show exception stack when test failed.

1.2.0 / 2011-11-24
==================

* Core: Allow objects with no prototype to tested against object literals.
* Core: Fix IE8 "Member not found" error.
* Core: Export `QUnit.start()` as alias for global `start()` for use in CommonJS runtimes, such as Node.js.

1.1.0 / 2011-10-11
==================

* Core: Check if setTimeout is available before trying to delay running the next task. #160
* Core: Default 'expected' to null in `asyncTest()`, same as in `test()`.
* Core: Avoid treating random objects with `length` properties as empty arrays in comparisons. (Trevor Parscal) [#164](https://github.com/qunitjs/qunit/pull/164)
* Core: Fix IE 6-8 compat with comparisons of NodeList objects. (Trevor Parscal) [#166](https://github.com/qunitjs/qunit/pull/166)
* Core: Fix a bug where after an async test, assertions could move between test cases because of internal state (config.current) being incorrectly set
* Core: Handle `expect(0)` as expected, i.e. `expect(0); ok(true, foo);` will cause a test to fail. (mmchaney) [#158](https://github.com/qunitjs/qunit/pull/158)
* HTML Reporter: Add a window.onerror handler. Makes uncaught errors actually fail the tests. #134
* HTML Reporter: Avoid internal exception if user extends Object.prototype object with non-standard properties.

1.0.0 / 2011-10-06
==================

First stable release.
