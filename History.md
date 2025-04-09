3.0.0 (UNRELEASED)
==================

### Added

* Core: Add module context to `before` and `after` hooks. This enables inheritence between parent and child modules, and fixes leaks between last test and `after` hooks. (Ray Cohen) [#1328](https://github.com/qunitjs/qunit/issues/1328)
* Core: Add [`QUnit.config.reporters.html`](https://qunitjs.com/api/config/reporters/) for disabling the HTML Reporter. [#1711](https://github.com/qunitjs/qunit/issues/1711)
* Core: Export [`QUnit.urlParams`](https://qunitjs.com/api/extension/QUnit.urlParams/) unconditionally. [57c2dbcffc](https://github.com/Krinkle/qunit/commit/57c2dbcffc694bf3a0b5d1d57e7f43f16ff29862)
* Core: Export `QUnit` global unconditionally. [#1771](https://github.com/qunitjs/qunit/pull/1771)
* Release: Add native ESM distribution. [#1551](https://github.com/qunitjs/qunit/issues/1551)

  This introduces an ESM distribution (`qunit/esm/qunit.module.js`), alongside the existing `qunit/qunit.js` file in the CJS format. Both are available for [download](https://releases.jquery.com/qunit/).

  Browser support for the CJS format is the same as in QUnit 2.x (including IE 9-11 and Safari 7+). If you choose to opt-in to the ESM format, note that this does not support running tests in IE 9-11 or Safari 7-9.

  When testing in Node.js, we automatically select a format based on `require()` vs `import`. Both share the same instance internally so mixed usage is okay. If some configuration files, plugins, adapters, test runners, or tests import QUnit differently, everything still works fine.

### Changed

* Core: Enable a default [test timeout](https://qunitjs.com/api/config/testTimeout/) of 3 seconds. [#1483](https://github.com/qunitjs/qunit/issues/1483)
* Core: Promote warning "[Cannot add … hook outside the containing module](https://qunitjs.com/api/QUnit/module/#E0002)" to error. (Ray Cohen) [#1576](https://github.com/qunitjs/qunit/issues/1576)
* Core: Promote warning "QUnit.module() callback must not be async" to error. (Ray Cohen) [#1600](https://github.com/qunitjs/qunit/issues/1600)
* Core: Promote warning "[Unexpected test after runEnd](https://qunitjs.com/api/config/autostart/#E0001)" to error. [#1377](https://github.com/qunitjs/qunit/issues/1377)
* Core: Promote "No tests were run." from fake test to native error. [#1790](https://github.com/qunitjs/qunit/pull/1790)
* Assert: Change [`assert.expect()`](https://qunitjs.com/api/assert/expect/) to exclude `assert.step()` calls from count. (Kyle Simpson) [#1226](https://github.com/qunitjs/qunit/issues/1226)
* HTML Reporter: New theme design and structure. Before and after demo in [#1774](https://github.com/qunitjs/qunit/pull/1774).
  * Add support for displaying early errors in the UI. [#1786](https://github.com/qunitjs/qunit/pull/1786)
  * Add `user-select: none;` to "Rerun" link and "runtime" indicator. [6becc199e0](https://github.com/qunitjs/qunit/commit/6becc199e0)
  * Add `running` class to test items. [1551120536](https://github.com/qunitjs/qunit/commit/1551120536f6f572a3bb5656db566f0a1bb217d8)
  * Change `#qunit-banner` from H2 to DIV, to fix WCAG compliance. [#1427](https://github.com/qunitjs/qunit/issues/1427)
  * Change `#qunit-testresult` from P to DIV, to fix HTML serialization. [#1301](https://github.com/qunitjs/qunit/issues/1301)
  * Change run time in toolbar from milliseconds to seconds. [#1760](https://github.com/qunitjs/qunit/pull/1760)
  * Faster UI rendering, now instantly instead of after DOM-ready. [#1793](https://github.com/qunitjs/qunit/pull/1793)
  * Fix overflow and scrollbar issues. [#1603](https://github.com/qunitjs/qunit/issues/1603)
  * Fix HTML Reporter to have no overhead when no [`id=qunit` element](https://qunitjs.com/browser/) exists. [#1711](https://github.com/qunitjs/qunit/issues/1711)
  * Remove assertion count from toolbar in favor of test count. [#1760](https://github.com/qunitjs/qunit/pull/1760)

### Fixed

* CLI: Fix confusing "No tests" message after an early uncaught error. [#1790](https://github.com/qunitjs/qunit/pull/1790)
* Core: Fix internal `QUnit.config.currentModule` for the initial unnamed module to be a complete object. [5812597b7f](https://github.com/qunitjs/qunit/commit/5812597b7f086e6afafef947ebff5231c0011f6b)
* Core: Fix crash when "bad thenable" is returned from global module hook. [3209462b88](https://github.com/qunitjs/qunit/commit/3209462b88)
* Core: Fix crash when mixing test.only() with module.only(). [99aee51a8a](https://github.com/qunitjs/qunit/commit/99aee51a8a4dfce3fa87559e171398fdf72c6886)
* Core: Fix [QUnit.config.maxDepth](https://qunitjs.com/api/config/maxDepth/) to allow changes at runtime. QUnit.dump.maxDepth is now a live alias to `QUnit.config.maxDepth`. [0a26e2c883](https://github.com/qunitjs/qunit/commit/0a26e2c883ab49831b19ebc34a4b7caac573d995) test suites. [a729421411](https://github.com/qunitjs/qunit/commit/a7294214116ab5ec0e111b37c00cc7e2c16b4e1b)

### Removed

* Core: Remove support for Node.js 10-16. Node.js 18 or later is required. (NullVoxPopuli) [#1727](https://github.com/qunitjs/qunit/issues/1727)
* Core: Remove support for PhantomJS. (Steve McClure) [#1505](https://github.com/qunitjs/qunit/pull/1505)
* Core: Remove built-in export for AMD. You can still load your application and your QUnit tests with AMD/RequireJS. This only affects the loading of the qunit.js file itself. [Example: Loading with RequireJS](https://qunitjs.com/api/config/autostart/#loading-with-requirejs). (NullVoxPopuli) [#1729](https://github.com/qunitjs/qunit/issues/1729)
* Core: Remove deprecated [`QUnit.load()`](https://qunitjs.com/api/QUnit/load/). [#1084](https://github.com/qunitjs/qunit/issues/1084)
* Core: Remove deprecated `QUnit.onError()` and `QUnit.onUnhandledRejection()` in favor of [`QUnit.onUncaughtException()`](https://qunitjs.com/api/extension/QUnit.onUncaughtException/).
* Core: Remove undocumented `details.modules[].tests` from QUnit.begin() event.
* Core: Remove undocumented `QUnit.dump.HTML` and `QUnit.dump.multiline`. [8e881f5087](https://github.com/qunitjs/qunit/commit/8e881f50876b93836dc585e8509641454bcdb834)
* HTML Reporter: Remove support for legacy markup. Use `<div id="qunit">` instead. Check [Browser Runner § Getting started](https://qunitjs.com/browser/).
* Build: Discontinue publication to Bower for future releases. Check [How to install](https://qunitjs.com/intro/#download) or [Getting started](https://qunitjs.com/intro/). [#1677](https://github.com/qunitjs/qunit/issues/1677)

2.24.1 / 2025-01-25
==================

### Fixed

* CLI: Fix TAP compliance for actual/expected indent and skip/todo colors. [b4d48fc710](https://github.com/qunitjs/qunit/commit/b4d48fc7107936b26d84b632b2c2782e368ea64c)
* CLI: Fix TAP compliance for early errors (e.g. syntax error in test file). [01f7780bd8](https://github.com/qunitjs/qunit/commit/01f7780bd8df3c21667e3920e0a4187cdf986c35)
* Core: Add memory to late [`error` event](https://qunitjs.com/api/callbacks/QUnit.on/#the-error-event) listeners, to improve reporting of early errors. [7c2f871ac3](https://github.com/qunitjs/qunit/commit/7c2f871ac339710845cee925207f5d6a62a8ad0e)

2.24.0 / 2025-01-19
==================

FYI:
* ✨ There is a new **[QUnit Blog](https://qunitjs.com/blog/)** on qunitjs.com. We're also on [Mastodon](https://fosstodon.org/@qunit) and [Bluesky](https://bsky.app/profile/qunitjs.com).
* 📗 There are [new Guides, Support, and Chat sections](https://qunitjs.com/intro/) on qunitjs.com.
  Including best practices and examples for async tests, callbacks, and event-based code.

### Added

* CLI: Add `.mjs` and `.cjs` to the default file extensions when reading a test directory.

  These have been monitored by watch mode since QUnit 2.18, but were not loaded or executed
  unless you passed them as individual files, or used your own glob like `test/*.{js,mjs,cjs}`.

  If you currently pass a directory to the QUnit CLI and have matching `.mjs` or `.cjs`
  files that should not be executed, you can opt-out by passing `test/*.js` or
  `test/**/*.js` explicitly instead of `test/`.
* CLI: Add stacktrace cleaning by omitting or greying out internal QUnit and Node.js frames in TAP reporter. [#1795](https://github.com/qunitjs/qunit/pull/1795). [#1789](https://github.com/qunitjs/qunit/pull/1789)

  Learn more about [Cleaner stack traces](https://qunitjs.com/blog/2025/01/19/stacktrace-cleaner/) on the QUnit Blog.
* Core: Add [`QUnit.config.reporters.tap`](https://qunitjs.com/api/config/reporters/) for enabling TAP via preconfig. [#1711](https://github.com/qunitjs/qunit/issues/1711)
* Core: Add memory to the [`runEnd` event](https://qunitjs.com/api/callbacks/QUnit.on/#the-runend-event) to allow late listeners. This helps [browser integrations](https://qunitjs.com/browser/#integrations) that only relay a summary. [27a33d1593](https://github.com/qunitjs/qunit/commit/27a33d15938a601716a81a638882a16c1bd7f2b9)

### Fixed

* HTML Reporter: Fix unexpected pointer cursor on "Source:" label. [f8cce2bb06](https://github.com/qunitjs/qunit/commit/f8cce2bb06396561e0cdcbf58c4e83ddf7a1f27f)
* HTML Reporter: Faster "Hide passed" toggling on large test suites. [b13ade0fd7](https://github.com/qunitjs/qunit/commit/b13ade0fd7c3baf4d0e68abe04f7d1609f686877)

2.23.1 / 2024-12-06
==================

### Fixed

* CLI: Fix support for strict [TAP parsers](https://qunitjs.com/api/config/reporters/#tap) by limiting colors to test names. [#1801](https://github.com/qunitjs/qunit/pull/1801)
* CLI: Fix confusing [`--seed` option](https://qunitjs.com/api/config/seed/) eating the file argument. [#1691](https://github.com/qunitjs/qunit/issues/1691)
* CLI: Remove confusing `expected: undefined` under error messages in TAP reporter. [#1794](https://github.com/qunitjs/qunit/pull/1794)
* HTML Reporter: Fix broken "Rerun without max depth" link. [da0c59e101](https://github.com/qunitjs/qunit/commit/da0c59e1016685ecd2b813bba914d33170e7bf98) (see also [91db92dbc5](https://github.com/qunitjs/qunit/commit/91db92dbc50bbbc41c5060a27e7aafd4e073e289), [73c03cf277](https://github.com/qunitjs/qunit/commit/73c03cf27745e179396a6d7c9af011a20d3b9082))
* HTML Reporter: Fix `<label>` to wrap `<select>` for multi-value urlConfig item. [#1773](https://github.com/qunitjs/qunit/pull/1773)

2.23.0 / 2024-12-03
==================

### Added

* Core: Add automatic labels in [`QUnit.test.each()`](https://qunitjs.com/api/QUnit/test.each/) to simple array values. [#1733](https://github.com/qunitjs/qunit/issues/1733)

2.22.0 / 2024-08-18
==================

### Added

* Core: Add [`QUnit.test.if()`](https://qunitjs.com/api/QUnit/test.if/) and `QUnit.module.if()`. (Timo Tijhof) [#1772](https://github.com/qunitjs/qunit/pull/1772)

2.21.1 / 2024-07-20
==================

### Deprecated

* Assert: Add notice about upcoming change in how [`assert.expect()`](https://qunitjs.com/api/assert/expect/) counts steps for `assert.verifySteps()`. [#1226](https://github.com/qunitjs/qunit/issues/1226)

### Fixed

* Core: Fix missing second frame in `QUnit.stack()` in Safari. [#1776](https://github.com/qunitjs/qunit/pull/1776)
* Core: Fix stacktrace cleaner to also support clean traces on URLs with host ports. [#1769](https://github.com/qunitjs/qunit/issues/1769)
* HTML Reporter: Fix reversed order after clicking "Hide passed". [#1763](https://github.com/qunitjs/qunit/pull/1763)
* HTML Reporter: Fix encoding of label for urlConfig multi-value item.

2.21.0 / 2024-05-29
==================

### Added

* Assert: Add [`assert.closeTo()`](https://qunitjs.com/api/assert/closeTo/) for float-friendly number comparisons. (Timo Tijhof) [#1735](https://github.com/qunitjs/qunit/issues/1735)
* Core: Add support for [flat preconfig](https://qunitjs.com/api/config/) via environment/global variables. (Timo Tijhof)

### Deprecated

* Core: Deprecate `QUnit.load()` and document migration path at <https://qunitjs.com/api/QUnit/load/>. (Timo Tijhof) [#1743](https://github.com/qunitjs/qunit/pull/1743)
* Core: Deprecate unset [testTimeout](https://qunitjs.com/api/config/testTimeout/#deprecated-no-timeout-set) for tests taking longer than 3 seconds. (Timo Tijhof) [#1483](https://github.com/qunitjs/qunit/issues/1483)

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

* Core: Fix memory leak via `config.timeoutHandler` from last async test. (Sergey Astapov) [#1708](https://github.com/qunitjs/qunit/pull/1708)

2.19.3 / 2022-10-22
==================

### Fixed

* Assert: Restore how deepEqual treats imposter objects. (Timo Tijhof) [#1706](https://github.com/qunitjs/qunit/issues/1706)

2.19.2 / 2022-10-17
==================

### Changed

* Core: Faster diffing for [`config.noglobals`](https://qunitjs.com/api/config/noglobals/) by refactoring slow mutations. (Izel Nakri) [#1697](https://github.com/qunitjs/qunit/pull/1697)
* Assert: Improve performance of [`assert.deepEqual()`](https://qunitjs.com/api/assert/deepEqual/) and `QUnit.equiv()`. (Izel Nakri) [#1700](https://github.com/qunitjs/qunit/pull/1700)
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

* CLI: Add [`--module`](https://qunitjs.com/cli/) option. (Shachar) [#1680](https://github.com/qunitjs/qunit/issues/1680)
* Core: Add `moduleId` to [`QUnit.begin()`](https://qunitjs.com/api/callbacks/QUnit.begin/) details object.

### Fixed

* Core: Fix event "runtime" data to be rounded to milliseconds.
* Core: Fix pretty stacktrace shortening to work on Windows.
* HTML Reporter: Faster toolbar setup by reusing `beginDetails.modules`. [e31c8d37b6](https://github.com/qunitjs/qunit/commit/e31c8d37b678ad2892abd4064f1d6dd1d42c858e) [#1664](https://github.com/qunitjs/qunit/issues/1664)

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

* HTML Reporter: Fix source attribution for test definitions. (Phani Rithvij) [#1679](https://github.com/qunitjs/qunit/issues/1679)
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

* CLI: Reduce npm install size by 35 kB, speeding up installation. (Timo Tijhof) [node-watch#115](https://github.com/yuanchuan/node-watch/pull/115)

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

* HTML Reporter: Add "Rerun failed tests" link to the [HTML Reporter](https://qunitjs.com/browser/). (Jan Buschtöns) [#1626](https://github.com/qunitjs/qunit/pull/1626)
* Core: New [`error` event](https://qunitjs.com/api/callbacks/QUnit.on/#the-error-event) for bailing on uncaught errors. (Timo Tijhof) [#1638](https://github.com/qunitjs/qunit/pull/1638)

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

* Core: New [`QUnit.test.each()`](https://qunitjs.com/api/QUnit/test.each/) method to test with data providers. (Ventuno) [#1568](https://github.com/qunitjs/qunit/issues/1568)
* Core: New [`failOnZeroTests`](https://qunitjs.com/api/config/failOnZeroTests/) configuration option. (Brenden Palmer)
* Core: New [`QUnit.reporters`](https://qunitjs.com/api/reporters/) interface. (Timo Tijhof) [f8948c9](https://github.com/qunitjs/qunit/commit/f8948c96fdcef0b0f96d27acaa59faacbabaf0f9) [js-reporters#133](https://github.com/js-reporters/js-reporters/issues/133)

  This introduces support for using the `tap` reporter in a browser.
  This was previously limited to the CLI.

### Changed

* Assert: Indicate which test a drooling `assert.async()` callback came from. (Steve McClure) [#1599](https://github.com/qunitjs/qunit/pull/1599)

### Deprecated

* Core: Warn when a module callback has a promise as a return value. (Ray Cohen) [#1600](https://github.com/qunitjs/qunit/issues/1600)

### Fixed

* Core: Fix `QUnit.module.only()` regression where some unrelated modules also executed. (Steve McClure) [#1610](https://github.com/qunitjs/qunit/issues/1610)
* CLI: Improve ESM detection. (Steve McClure) [#1593](https://github.com/qunitjs/qunit/issues/1593)
* HTML Reporter: Increase contrast and use richer colors to improve accessibility. (Timo Tijhof) [#1587](https://github.com/qunitjs/qunit/pull/1587)

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

* HTML Reporter: Deprecate PhantomJS. (Steve McClure) [#1505](https://github.com/qunitjs/qunit/pull/1505)

### Fixed

* Core: Count tests run so that `suiteEnd` emits correctly with active filters. (Stephen Yeung) [#1416](https://github.com/qunitjs/qunit/issues/1416)
* Core: Fix test counter bug when nesting invalid test functions. (Timo Tijhof)
* HTML Reporter: Avoid leaking `Map` global in older browsers. (Timo Tijhof)

2.12.0 / 2020-11-08
==================

### Added

* Core: Add [`QUnit.test.*`](https://qunitjs.com/api/QUnit/test/) aliases for `QUnit.only()`, `QUnit.skip()`, and `QUnit.todo()`. (Steve McClure) [#1496](https://github.com/qunitjs/qunit/pull/1496)
* Assert: Support arrow functions in [`assert.throws()`](https://qunitjs.com/api/assert/throws/) expected callback. (Steve McClure) [#1492](https://github.com/qunitjs/qunit/pull/1492)

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

* CLI: Faster startup for non-glob arguments. (SparshithNRai) [#1385](https://github.com/qunitjs/qunit/pull/1385)
* CLI: Fix error with `--watch` option, affected Node 14 on Linux. [#1448](https://github.com/qunitjs/qunit/pull/1448)
* Core: Fix "No tests" to check test count instead of assert count. (Jessica Jordan) [#1405](https://github.com/qunitjs/qunit/issues/1405)

### Removed

* All: Remove support for Node 6 and Node 8, require Node 10+. This reduces our dependencies from 9 to 7, speeding up installation. (Timo Tijhof) [#1464](https://github.com/qunitjs/qunit/pull/1464)

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
* HTML Reporter: Fix tab order for toolbar filters. (Eddy Lu) [#1428](https://github.com/qunitjs/qunit/issues/1428)

2.9.3 / 2019-10-08
==================

### Added

* HTML Reporter: Display progress and runtime while test suite is executing. (Stefan Penner) [#1398](https://github.com/qunitjs/qunit/pull/1398)

### Fixed

* CLI: Ignore folders mentioned in the gitignore to improve performance. (SparshithNRai) [#1384](https://github.com/qunitjs/qunit/pull/1384)
* Core: Defer getting the stack trace to improve performance. (Adam Byrne) [#1401](https://github.com/qunitjs/qunit/pull/1401)
* Core: Let `assert.timeout()` replace the timeout if `config.timeout` was already set. (Stephen Yeung) [#1400](https://github.com/qunitjs/qunit/pull/1400)

2.9.2 / 2019-02-21
==================

### Fixed

* Core: Ensure semaphores are balanced when timeout occurs. (Steve Calvert) [#1376](https://github.com/qunitjs/qunit/pull/1376)
* HTML Reporter: Avoid inline styles to support CSP without `unsafe-inline`. (jelhan) [#1369](https://github.com/qunitjs/qunit/pull/1369)

2.9.1 / 2019-01-07
==================

### Fixed

* Release: Restore missing files that were accidentally missing in the 2.9.0 npm package. [#1368](https://github.com/qunitjs/qunit/pull/1368)

2.9.0 / 2019-01-06
==================

### Fixed

* Assert: Report errors from `assert.throws()` as strings. [#1333](https://github.com/qunitjs/qunit/issues/1333)
* CLI: Reduce size of the npm package and dependency tree, from 142 dependencies, to 9 dependencies. (Timo Tijhof) [#1342](https://github.com/qunitjs/qunit/issues/1342)
* HTML Reporter: Fix an unescaped `details.source`. (Shlomi Fish) [#1341](https://github.com/qunitjs/qunit/pull/1341)

2.8.0 / 2018-11-02
==================

### Added

* Core: Add support for async functions and Promise-returns to QUnit event handlers. These can now be used via `QUnit.begin`, `QUnit.moduleStart`, `QUnit.testStart`, `QUnit.testDone`, `QUnit.moduleDone`, and `QUnit.done`. (Stephen Yeung) [#1307](https://github.com/qunitjs/qunit/pull/1307)
* Core: Add stack trace to uncaught error if the browser supports it. (Anand Thakker) [#1324](https://github.com/qunitjs/qunit/pull/1324)

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
* HTML Reporter: Faster "hidepassed" mode by removing elements from the DOM. (Gabriel Csapo) [#1311](https://github.com/qunitjs/qunit/pull/1311)

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

* Assert: New [`assert.rejects()`](https://qunitjs.com/api/assert/rejects/) method. (Robert Jackson) [#1238](https://github.com/qunitjs/qunit/pull/1238)
* CLI: Fail test if there are unhandled rejections, similar to uncaught errors. (Robert Jackson) [#1241](https://github.com/qunitjs/qunit/pull/1241/)
* HTML Reporter: Fail test if there are unhandled rejections, similar to uncaught errors. (Robert Jackson) [#1241](https://github.com/qunitjs/qunit/pull/1241/)

### Changed

* Assert: The [`assert.verifySteps()`](https://qunitjs.com/api/assert/verifySteps/) method now resets the steps buffer, making it easier to use multiple times in a single test. [#1233](https://github.com/qunitjs/qunit/pull/1233)

### Fixed

* Core: Remove artificial delays from internal `setTimeout` processing code. [#1246](https://github.com/qunitjs/qunit/pull/1246)

2.4.1 / 2017-10-21
==================

* CLI: Add slight debounce to restarting tests on file watching.
* CLI: Catch file load failures and report as failing tests.
* CLI: Clear require cache of watched files between runs.
* CLI: List available reporters when option is specified with no value.
* CLI: Properly support watching files added after first run.
* Core: Provide descriptive feedback when missing `QUnit.test()` callback.
* HTML Reporter: Fix regression in error reporting.

2.4.0 / 2017-07-08
==================

* Assert: New [`assert.timeout()`](https://qunitjs.com/api/assert/timeout/) for setting per-test timeout durations. (Trent Willis) [#1165](https://github.com/qunitjs/qunit/pull/1165)
* Assert: Fix assert.push deprecation link.
* CLI: Better messaging on early exits.
* CLI: Default to non-zero exit code.
* CLI: Exit with non-zero status when no tests are run.
* Core: Add support for multiple callbacks in module hooks, such as via `hooks.beforeEach()` and `hooks.afterEach()`.
* Core: Fallback to `typeof obj` in `QUnit.objectType`.
* Core: New [`QUnit.module.only()`](http://qunitjs.com/api/QUnit/module/) method. (Brahim Arkni) [#1179](https://github.com/qunitjs/qunit/pull/1179)
* Core: New [`QUnit.module.skip()`](http://qunitjs.com/api/QUnit/module/) method. (Brahim Arkni) [#1193](https://github.com/qunitjs/qunit/pull/1193)
* Core: New [`QUnit.module.todo()`](http://qunitjs.com/api/QUnit/module/) method. (Brahim Arkni) [#1195](https://github.com/qunitjs/qunit/pull/1195)
* Core: Fix memory release of objects in equiv logic of `assert.deepEqual()`. (Jing Wu) [#1192](https://github.com/qunitjs/qunit/issues/1192)

2.3.3 / 2017-06-02
==================

### Added

* Core: Support running in Web Worker threads. (Marten Schilstra) [#1171](https://github.com/qunitjs/qunit/pull/1171)

### Changed

* CLI: Prefer local version of QUnit.

2.3.2 / 2017-04-17
==================

* HTML Reporter: Add specific diff for number types instead of str-diff. (Adrian Leonhard) [#1155](https://github.com/qunitjs/qunit/issues/1155)
* Core: Fix bug calling hooks with skipped tests. (Ben Demboski) [#1156](https://github.com/qunitjs/qunit/issues/1156)

2.3.1 / 2017-04-10
==================

* Assert: Allow assertions after async.
* Assert: Throw if async callback invoked after test finishes.
* Core: Ensure assertions occur while test is running.
* Core: Fix test instance memory leak. [#1138](https://github.com/qunitjs/qunit/issues/1138)
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
* Assert: New `assert.step()` and `assert.verifySteps()` methods. (Trent Willis) [#1075](https://github.com/qunitjs/qunit/issues/1075)

### Changed

* Core: QUnit.onError now expects error or error-like object.
* Core: Include "todo" in assertion event data.

### Fixed

* HTML Reporter: Ensure window.onerror return values are correct.
* Core: Fix start on Node when autostart is not set to true. [#1105](https://github.com/qunitjs/qunit/issues/1105)
* Core: Fix double begin when calling start in Node.
* Core: Rewrite QUnit.equiv to be breadth-first.
* Core: Optimize the "set" and "map" callbacks.
* Core: Fix console error in IE9. [#1093](https://github.com/qunitjs/qunit/issues/1093)

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
* Core: Fix `QUnit.equiv` object methods comparison.
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
* HTML Reporter: Fix apply/reset button visibility.
* Core: Ensure runtime for skipped tests is 0.
* Dump: New parser for `Symbol` type.

2.0.0 / 2016-06-16
==================

* All: Remove deprecated features.
* All: Remove `QUnit.config.autorun`.
* All: Prevent async tests from having multiple resume timeouts.
* Assert: Remove `assert.throws()` signature with string expected value.
* Dump: update typeOf to extract extra complex type definition.
* Core: New `before` and `after` module hooks. (Trent Willis) [#919](https://github.com/qunitjs/qunit/pull/919)
* Core: Decode "+" to " " (space) in url params.
* Core: Throw error if QUnit is already defined globally.
* HTML Reporter: Add multi-select module dropdown. (Maciej Lato) [#973](https://github.com/qunitjs/qunit/pull/973)
* HTML Reporter: Add reset/apply buttons in the module picker. (Richard Gibson) [#989](https://github.com/qunitjs/qunit/pull/989)
* HTML Reporter: Improve module picker accessibility. (Richard Gibson) [#989](https://github.com/qunitjs/qunit/pull/989)
* HTML Reporter: Improve color/background order consistency. (Richard Gibson) [#989](https://github.com/qunitjs/qunit/pull/989)

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
* Core: Introduce `QUnit.config.seed` for running tests in pseudo-random order.
* Dump: Fix asymmetrical function dump argument spacing.
* HTML Reporter: Fix escaping of diffs.
* HTML Reporter: Add message explaining missing diff.
* HTML Reporter: Fix hidepassed element check.
* Assert: Treat "Set" and "Map" types as unordered in `QUnit.equiv`.

1.22.0 / 2016-02-23
==================

* Assert: New [`assert.pushResult()`](https://qunitjs.com/api/assert/pushResult/) method. (YongWoo Jeon) [#920](https://github.com/qunitjs/qunit/pull/920)
* Assert: Extend Assert methods to QUnit for backwards compatibility.
* HTML Reporter: Escape setUrl output.

1.21.0 / 2016-02-01
==================

* Assert: Improve speed of `assert.deepEqual()` and `QUnit.equiv()`. (Richard Gibson) [#895](https://github.com/qunitjs/qunit/issues/895)
* Assert: Fully support Object-wrapped primitives in `assert.deepEqual()`.
* Assert: Register notOk as a non-negative assertion.
* Core: Improve regular expression comparisons.
* Core: Support filtering by regular expression.
* HTML Reporter: Fix hidden test results under static parents.

1.20.0 / 2015-10-27
==================

* Assert: Expose `assert.raises()` to the global scope.
* Assert: Add an optional `callCount` parameter to `assert.async()`.
* Core: New [`QUnit.only()`](https://qunitjs.com/api/QUnit/test.only/) method. (Erik Benoist) [#496](https://github.com/qunitjs/qunit/issues/496)
* Core: Support Symbol types on `QUnit.equiv`.
* Core: Make `QUnit.start` fails if called with a non-numeric argument.
* Core: New nested scopes ability to [`QUnit.module()`](https://qunitjs.com/api/QUnit/module/). (Stephen Jones) [#543](https://github.com/qunitjs/qunit/issues/543)
* Core: Equivalency for descendants of null constructors.
* HTML Reporter: Add indicator for filtered test.
* HTML Reporter: Collapse details for successive failed tests.

1.19.0 / 2015-09-01
==================

* Assert: Add support for ES6 Map and Set to equiv for `assert.deepEqual()`. (Toh Chee Chuan) [#833](https://github.com/qunitjs/qunit/issues/833)
* Core: New `QUnit.stack()` method. [#801](https://github.com/qunitjs/qunit/pull/801)
* Core: Release module hooks to avoid memory leaks. (Stefan Penner) [#841](https://github.com/qunitjs/qunit/issues/841)
* Dump: Escape backslash when quoting strings.
* HTML Reporter: Avoid readyState issue with PhantomJS.
* HTML Reporter: HTML reporter enhancements for negative asserts.
* HTML Reporter: Show diff only when it helps.
1.18.0 / 2015-04-03
==================

* Assert: New `assert.notOk()` for asserting falsy values. [#745](https://github.com/qunitjs/qunit/pull/745)
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

* Core: Support Node.js export parity with CommonJS. (James M. Greene) [#709](https://github.com/qunitjs/qunit/pull/709)
* HTML Reporter: Add the filter field. (Leo Balter) [#651](https://github.com/qunitjs/qunit/issues/651)
* HTML Reporter: Don't hide skipped tests.
* HTML Reporter: Fix regression for old markup.
* HTML Reporter: Prevent XSS attacks.
* HTML Reporter: QUnit.url is now a private function in the HTML Reporter.
* HTML Reporter: Url params can be set by code.

1.16.0 / 2014-12-03
==================

### Added

* Assert: New `assert.async()`  method. (James M. Greene) [#534](https://github.com/qunitjs/qunit/issues/534)
* Assert: Add alias for throws called `assert.raises()`.
* Core: New `QUnit.skip()` method. (Leo Balter) [#637](https://github.com/qunitjs/qunit/issues/637)
* Core: Add runtime property to `QUnit.moduleDone()` data.
* Core: `QUnit.test()` now supports returning Promise and async functions. (James M. Greene) [#632](https://github.com/qunitjs/qunit/issues/632)
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

* Assert: Introduce Assert constructor with test context. This heavily improves debugging of async tests, as assertions can't leak into other tests anymore. Use the new `assert` argument in your test to get the full benefit of this. (Leo Balter) [#374](https://github.com/qunitjs/qunit/issues/374)
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
* HTML Reporter: Use `id` function for selection elements in two places that were not using it. [#463](https://github.com/qunitjs/qunit/issues/463)
* Release: Add bower.json. [#461](https://github.com/qunitjs/qunit/issues/461)

1.12.0 / 2013-06-21
===================

* Addons/Canvas: Show how to test with images. [#438](https://github.com/qunitjs/qunit/issues/438)
* Addons/JUnitLogger: Add a `name` property to the test run. [#389](https://github.com/qunitjs/qunit/issues/389)
* Addons/PhantomJS: Added optional timeout. [#415](https://github.com/qunitjs/qunit/issues/415)
* Addons/PhantomJS: Include stack trace for all failed tests. [#416](https://github.com/qunitjs/qunit/issues/416)
* Addons: Move 'addons/canvas' to 'JamesMGreene/qunit-assert-canvas.git'. Tree: <https://github.com/JamesMGreene/qunit-assert-canvas/tree/v1.0.0>.
* Addons: Move 'addons/close-enough' to 'JamesMGreene/qunit-assert-close.git'. Tree: <https://github.com/JamesMGreene/qunit-assert-close/tree/v1.0.0>.
* Addons: Move 'addons/composite' to 'jquery/qunit-composite.git'. Tree: <https://github.com/jquery/qunit-composite/tree/v1.0.0>. [#419](https://github.com/qunitjs/qunit/issues/419)
* Addons: Move 'addons/junitlogger' to 'jquery/qunit-reporter-junit.git'.
* Addons: Move 'addons/step' to 'JamesMGreene/qunit-assert-step.git'. Tree: <https://github.com/JamesMGreene/qunit-assert-step/tree/v1.0.0>.
* Addons: Move 'addons/themes/gabe' to 'Krinkle/qunit-theme-gabe.git'.
* Addons: Move 'addons/themes/ninja' to 'Krinkle/qunit-theme-ninja.git'.
* Addons: Move 'addons/themes/nv' to 'Krinkle/qunit-theme-nv.git'.
* Assert: Message for `assert.ok()` shouldn't be undefined in 'log' event.
* Core: Deprecate QUnit.current_testEnvironment in favour of config.current.testEnvironment.
* Core: Emit moduleStart before testStart even if test isn't in a module.
* Core: Fix mismatch between moduleStart and moduleDone events.
* Core: Improve circular reference logic in equiv. [#397](https://github.com/qunitjs/qunit/issues/397)
* Core: Removed jQuery.trim optimization. [#424](https://github.com/qunitjs/qunit/issues/424)
* Core: Sort the module names so we no longer rely on implicit ordering. [#391](https://github.com/qunitjs/qunit/issues/391), [#392](https://github.com/qunitjs/qunit/issues/392)
* Core: Use a local setTimeout reference for internal reference to failures if later stubbed. [#432](https://github.com/qunitjs/qunit/issues/432), [#433](https://github.com/qunitjs/qunit/issues/433)
* HTML Reporter: Clear filter and testNumber when choosing a module. [#442](https://github.com/qunitjs/qunit/issues/442)

1.11.0 / 2013-01-20
==================

### Added

* Addons: New "Ninja" theme.
* Assert: New [`assert.propEqual()`](https://qunitjs.com/api/assert/propEqual/) and `assert.notPropEqual()`. (Timo Tijhof) [#317](https://github.com/qunitjs/qunit/issues/317)
* HTML Reporter: Capture and show each test's runtime duration. [#344](https://github.com/qunitjs/qunit/issues/344)

### Changed

* Addons/Composite: Test suites can be named by including an object with name & path props within array param for `.testSuites()`.
* Addons/PhantomJS: Include source in assertion details.
* Core: Apply the same exception handling for test and teardown try/catch as for setup.

### Fixed

* Addons/Canvas: Use 0.6 as alpha value to avoid inconsistencies between browsers. [#342](https://github.com/qunitjs/qunit/issues/342)
* Addons/JUnitLogger: Rewrite as it was in bad shape (unused vars, duplicate internal code, sub-optimal XmlWriter logic).
* Addons/PhantomJS: Removed the polling mechanism in favor of PhantomJS 1.6+'s `WebPage#onCallback`.
* Assert: Make `throws` ES3 compatible. (Mathias Bynens)
* Core: Fix URL generator to take protocol and host into account to fix usage with file protocol in IE7/8.
* Core: Fix issue with Error.prototype.toString in IE 7.
* Core: Improve start()-called-too-often fix, initialize semaphore at 1, fixes autostart=false case. Also provide stack for the offending start() call.
* Core: Push a failing assertion when calling start() while already running. Resets anyway to keep other tests going. [#314](https://github.com/qunitjs/qunit/issues/314)
* Core: Remove global variable "assert". [#341](https://github.com/qunitjs/qunit/issues/341)
* Core: There's type-free objects in Firefox, extend objectType() to allow null match. [#315](https://github.com/qunitjs/qunit/issues/315)
* Dump: Extend jsdump to output Error objects as such, including the message property. Extend throws to provide 'expected' value when possible. [#307](https://github.com/qunitjs/qunit/issues/307)
* Dump: Include contents of text nodes in `jsDump.node`. (Timo Tijhof) [#380](https://github.com/qunitjs/qunit/issues/380)
* HTML Reporter: Delay start until `QUnit.init` happened. [#358](https://github.com/qunitjs/qunit/issues/358)
* HTML Reporter: Change summary text to use the word "assertions" instead of "tests". [#336](https://github.com/qunitjs/qunit/issues/336)
* HTML Reporter: Fix exception from Diff on property "constructor". [#394](https://github.com/qunitjs/qunit/issues/394)
* HTML Reporter: Fix module picker for old IE. [#366](https://github.com/qunitjs/qunit/issues/366)
* HTML Reporter: Fix urlConfig checkbox event for old IE. [#369](https://github.com/qunitjs/qunit/issues/369)
* HTML Reporter: Use classes to collapse assertion groups. [#269](https://github.com/qunitjs/qunit/issues/269)

1.10.0 / 2012-08-30
==================

* All: Simplify licensing to only MIT, no more MIT/GPL dual licensing.
* Assert: Equiv for `assert.deepEqual()` now recognizes the ES6 sticky "y" flag for RegExp objects. [#284](https://github.com/qunitjs/qunit/issues/284)
* Assert: Make `QUnit.expect()` without arguments behave as a getter. [#226](https://github.com/qunitjs/qunit/issues/226)
* Core: Add module and test name to the data provided via `QUnit.log()`. [#296](https://github.com/qunitjs/qunit/issues/296)
* Core: Keep a local reference to Date for internal use. [#283](https://github.com/qunitjs/qunit/issues/283)
* HTML Reporter: Add a UI for the module filter.
* HTML Reporter: Always display of global errors regardless of filtering URL parameters. [#288](https://github.com/qunitjs/qunit/issues/288)
* HTML Reporter: Scroll the window back to top after tests finished running. [#304](https://github.com/qunitjs/qunit/issues/304)

1.9.0 / 2012-07-11
==================

* Assert: Rename `assert.raises()` to `assert.throws()`, keeping an alias for compat. [#267](https://github.com/qunitjs/qunit/issues/267)
* Core: Make the module filter case-insensitive. [#252](https://github.com/qunitjs/qunit/issues/252)
* HTML Reporter: Link should ignore "testNumber" and "module". [#270](https://github.com/qunitjs/qunit/issues/270)
* HTML Reporter: Move checkboxes into toolbar and give them labels and tooltip descriptions. [#274](https://github.com/qunitjs/qunit/issues/274)
* HTML Reporter: Remove use of shadows and change border radius to 5px for pass/error.
* Release: Start publishing to npm under the `qunitjs` package name.

1.8.0 / 2012-06-14
==================

* Assert: Avoid global eval error from `assert.raises()` being reported as global exception in IE. [#257](https://github.com/qunitjs/qunit/issues/257)
* Core: Reset config.current at the right time. [#260](https://github.com/qunitjs/qunit/issues/260)
* HTML Reporter: Improve window.onerror handling.
* HTML Reporter: New `module` url parameter. [#252](https://github.com/qunitjs/qunit/issues/252)

1.7.0 / 2012-06-07
==================

* Addons: Add CLI runner for Phantomjs.
* Assert: Refactor assertion helper functions into a new extensible `QUnit.assert` object, globals remain for compat. (Timo Tijhof) [#244](https://github.com/qunitjs/qunit/pull/244)
* Core: Fix confusion of Date type as Object in `assert.deepEqual()`. [#250](https://github.com/qunitjs/qunit/issues/250)
* Core: Improve extractStacktrace logic. [#254](https://github.com/qunitjs/qunit/issues/254)
* Core: Make "Rerun" link only run one test by tracking execution order. [#241](https://github.com/qunitjs/qunit/issues/241)
* Core: Make filters case-insensitive. [#252](https://github.com/qunitjs/qunit/issues/252)
* Core: New [`config.requireExpects`](https://qunitjs.com/api/config/requireExpects/) option. [#207](https://github.com/qunitjs/qunit/issues/207)
* HTML Reporter: Add Rerun link to placeholders. [#240](https://github.com/qunitjs/qunit/issues/240)

1.6.0 / 2012-05-04
==================

* Addons/Composite: Double clicking on composite test rows opens individual test page.
* Core: Only check for an `exports` object to detect a CommonJS environment, fixes compat with RequireJS. [#237](https://github.com/qunitjs/qunit/issues/237)
* HTML Reporter: Prefix test-output id and ignore that in noglobals check. [#212](https://github.com/qunitjs/qunit/issues/212)

1.5.0 / 2012-04-04
==================

* Addons/JUnitLogger: Add `results` data to `QUnit.jUnitReport` callback argument. The function accepts one argument shaped as `{ xml: '<?xml ...', results: { failed: 0, passed: 0, total: 0, time: 0 } }`. (Jonathan Sanchez) [#216](https://github.com/qunitjs/qunit/pull/216)
* Assert: Provide `this` test context to [`assert.raises()`](https://qunitjs.com/api/assert/throws/) block. (Keith Cirkel) [#217](https://github.com/qunitjs/qunit/issues/217)
* Core: Fix clearing of sessionStorage in Firefox 3.6. (Scott González)
* HTML Reporter: Modify "Running..." to display test name. (Rick Waldron) [#220](https://github.com/qunitjs/qunit/issues/220)

1.4.0 / 2012-03-10
==================

* Core: A test without any assertions now fails by default, unless [`assert.expect(0)`](https://qunitjs.com/api/assert/expect/) is called. [#178](https://github.com/qunitjs/qunit/issues/178)
* Core: Add `QUnit.pushFailure` to log error conditions like exceptions. Accepts stacktrace as second argument, allowing extraction with caught exceptions (useful even in Safari). [#210](https://github.com/qunitjs/qunit/issues/210)
* Core: Apply [`notrycatch` option](https://qunitjs.com/api/config/notrycatch/) to setup and teardown hooks. [#203](https://github.com/qunitjs/qunit/issues/203) [#204](https://github.com/qunitjs/qunit/issues/204)
* Core: Extend exports object with QUnit properties at the end of the file to export everything.
* Core: Prefix test-related session-storage items to make removal more specific. [#213](https://github.com/qunitjs/qunit/issues/213)
* HTML Reporter: Sort objects in value dumps alphabetically to improve diffs. [#206](https://github.com/qunitjs/qunit/issues/206)

1.3.0 / 2012-02-26
==================

* Addons: New Gabe theme by Gabe Hendry. [#188](https://github.com/qunitjs/qunit/pull/188)
* Addons: New NV theme by NV. [#62](https://github.com/qunitjs/qunit/pull/62)
* Addons: New JUnitLogger addon.
* Core: Catch assertions running outside of `test()` context, make sure source is provided even for `ok()`. [#98](https://github.com/qunitjs/qunit/issues/98)
* Core: Check for global object to find setTimeout in Node.js.
* Core: Clear all sessionStorage entries once all tests passed. Helps getting rid of items from renamed tests. [#101](https://github.com/qunitjs/qunit/issues/101)
* Core: Fix sourceFromsStacktrace to get the right line in Firefox. Shift the 'error' line away in Chrome to get a match.
* Core: Generate more base markup, but allow the user to exclude that completely or choose their own. [#127](https://github.com/qunitjs/qunit/issues/127)
* Core: In autorun mode, moduleDone is called without matching moduleStart. [#184](https://github.com/qunitjs/qunit/issues/184)
* Core: Remove the testEnvironmentArg to `test()`. Most obscure, never used anywhere. `test()` is still heavily overloaded with argument shifting, this makes it a little more sane. [#172](https://github.com/qunitjs/qunit/issues/172)
* Core: Replace deprecated same and equals aliases with placeholders that just throw errors, providing a hint at what to use instead. Rename test file to match that.
* Core: Serialize expected and actual values only when test fails to improve testing speed for passing tests. [#183](https://github.com/qunitjs/qunit/issues/183)
* Core: Update sessionStorage support test to avoid QUOTA_EXCEEDED_EXCEPTION.
* HTML Reporter: Avoid `outerHTML` for Firefox < 11. Use cloneNode instead.
* HTML Reporter: Escape `document.title` before inserting into markup. [#127](https://github.com/qunitjs/qunit/issues/127)
* HTML Reporter: Fix the fixture reset to not break if the element is not present on the page.
* HTML Reporter: Keep label and checkbox together.
* HTML Reporter: Set fixed CSS dimensions on `#qunit-fixture`. [#114](https://github.com/qunitjs/qunit/issues/114)
* HTML Reporter: Show exception stack when test failed.

1.2.0 / 2011-11-24
==================

* Assert: Allow [`deepEqual`](https://qunitjs.com/api/assert/deepEqual/) to test objects with null prototype against object literals. (Domenic Denicola) [#170](https://github.com/qunitjs/qunit/pull/170)
* Core: Fix IE8 "Member not found" error. (Jimmy Mabey) [#154](https://github.com/qunitjs/qunit/issues/154)
* Core: Fix internal `start()` call to use `QUnit.start()`, since global is not exported in CommonJS runtimes, such as Node.js. (Antoine Musso) [#168](https://github.com/qunitjs/qunit/pull/168)

1.1.0 / 2011-10-11
==================

* Core: Check if setTimeout is available before trying to delay running the next task. [#160](https://github.com/qunitjs/qunit/issues/160)
* Core: Default 'expected' to null in `asyncTest()`, same as in `test()`.
* Core: Avoid treating random objects with `length` properties as empty arrays in comparisons. (Trevor Parscal) [#164](https://github.com/qunitjs/qunit/pull/164)
* Core: Fix IE 6-8 compat with comparisons of NodeList objects. (Trevor Parscal) [#166](https://github.com/qunitjs/qunit/pull/166)
* Core: Fix a bug where after an async test, assertions could move between test cases because of internal state (config.current) being incorrectly set.
* Core: Handle `expect(0)` as expected, i.e. `expect(0); ok(true, foo);` will cause a test to fail. (Markus Messner-Chaney) [#158](https://github.com/qunitjs/qunit/pull/158)
* HTML Reporter: Add a window.onerror handler. Makes uncaught errors actually fail the tests. [#134](https://github.com/qunitjs/qunit/issues/134)
* HTML Reporter: Avoid internal exception if user extends Object.prototype object with non-standard properties.

1.0.0 / 2011-10-06
==================

First stable release.
