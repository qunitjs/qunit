import { globalThis, setTimeout, clearTimeout, StringMap } from './globals';
import { emit } from './events';
import Assert from './assert';
import Logger from './logger';
import Promise from './promise';

import config from './core/config';
import {
  diff,
  errorString,
  extend,
  generateHash,
  hasOwn,
  inArray,
  performance
} from './core/utilities';
import { runLoggingCallbacks } from './core/logging';
import { extractStacktrace, sourceFromStacktrace } from './core/stacktrace';

import TestReport from './reports/test';

export default function Test (settings) {
  this.expected = null;
  this.assertions = [];
  this.module = config.currentModule;
  this.steps = [];
  // This powers the QUnit.config.countStepsAsOne feature.
  // https://github.com/qunitjs/qunit/pull/1775
  this.stepsCount = 0;
  this.timeout = undefined;
  this.data = undefined;
  this.withData = false;
  this.pauses = new StringMap();
  this.nextPauseId = 1;

  // For the most common case, we have:
  // - 0: new Test
  // - 1: addTest
  // - 2: QUnit.test
  // - 3: user file
  //
  // This needs is customised by test.each()
  this.stackOffset = 3;
  extend(this, settings);

  // If a module is skipped, all its tests and the tests of the child suites
  // should be treated as skipped even if they are defined as `only` or `todo`.
  // As for `todo` module, all its tests will be treated as `todo` except for
  // tests defined as `skip` which will be left intact.
  //
  // So, if a test is defined as `todo` and is inside a skipped module, we should
  // then treat that test as if was defined as `skip`.
  if (this.module.skip) {
    this.skip = true;
    this.todo = false;

    // Skipped tests should be left intact
  } else if (this.module.todo && !this.skip) {
    this.todo = true;
  }

  // Queuing a late test after the run has ended is not allowed.
  // This was once supported for internal use by QUnit.onError().
  // Ref https://github.com/qunitjs/qunit/issues/1377
  if (config.pq.finished) {
    // Using this for anything other than onError(), such as testing in QUnit.done(),
    // is unstable and will likely result in the added tests being ignored by CI.
    // (Meaning the CI passes irregardless of the added tests).
    //
    // TODO: Make this an error in QUnit 3.0
    // throw new Error( "Unexpected test after runEnd" );
    Logger.warn('Unexpected test after runEnd. This is unstable and will fail in QUnit 3.0.');
    return;
  }
  if (!this.skip && typeof this.callback !== 'function') {
    const method = this.todo ? 'QUnit.todo' : 'QUnit.test';
    throw new TypeError(`You must provide a callback to ${method}("${this.testName}")`);
  }

  // Register unique strings
  for (let i = 0, l = this.module.tests; i < l.length; i++) {
    if (this.module.tests[i].name === this.testName) {
      this.testName += ' ';
    }
  }
  this.testId = generateHash(this.module.name, this.testName);

  // No validation after this. Beyond this point, failures must be recorded as
  // a completed test with errors, instead of early bail out.
  // Otherwise, internals may be left in an inconsistent state.
  // Ref https://github.com/qunitjs/qunit/issues/1514

  ++Test.count;
  this.errorForStack = new Error();
  if (this.callback && this.callback.validTest) {
    // Omit the test-level trace for the internal "No tests" test failure,
    // There is already an assertion-level trace, and that's noisy enough
    // as it is.
    this.errorForStack.stack = undefined;
  }
  this.testReport = new TestReport(this.testName, this.module.suiteReport, {
    todo: this.todo,
    skip: this.skip,
    valid: this.valid()
  });

  this.module.tests.push({
    name: this.testName,
    testId: this.testId,
    skip: !!this.skip
  });

  if (this.skip) {
    // Skipped tests will fully ignore any sent callback
    this.callback = function () {};
    this.async = false;
    this.expected = 0;
  } else {
    this.assert = new Assert(this);
  }
}

Test.count = 0;

function getNotStartedModules (startModule) {
  let module = startModule;
  const modules = [];

  while (module && module.testsRun === 0) {
    modules.push(module);
    module = module.parentModule;
  }

  // The above push modules from the child to the parent
  // return a reversed order with the top being the top most parent module
  return modules.reverse();
}

Test.prototype = {

  // Use a getter to avoid computing a stack trace (which can be expensive),
  // This is displayed by the HTML Reporter, but most other integrations do
  // not access it.
  get stack () {
    return extractStacktrace(this.errorForStack, this.stackOffset);
  },

  before: function () {
    const module = this.module;
    const notStartedModules = getNotStartedModules(module);

    // ensure the callbacks are executed serially for each module
    let moduleStartChain = Promise.resolve();
    notStartedModules.forEach(startModule => {
      moduleStartChain = moduleStartChain.then(() => {
        startModule.stats = { all: 0, bad: 0, started: performance.now() };
        emit('suiteStart', startModule.suiteReport.start(true));
        return runLoggingCallbacks('moduleStart', {
          name: startModule.name,
          tests: startModule.tests
        });
      });
    });

    return moduleStartChain.then(() => {
      config.current = this;

      this.testEnvironment = extend({}, module.testEnvironment);

      this.started = performance.now();
      emit('testStart', this.testReport.start(true));
      return runLoggingCallbacks('testStart', {
        name: this.testName,
        module: module.name,
        testId: this.testId,
        previousFailure: this.previousFailure
      }).then(() => {
        if (!config.pollution) {
          saveGlobal();
        }
      });
    });
  },

  run: function () {
    config.current = this;

    if (config.notrycatch) {
      runTest(this);
      return;
    }

    try {
      runTest(this);
    } catch (e) {
      this.pushFailure('Died on test #' + (this.assertions.length + 1) + ': ' +
        (e.message || e) + '\n' + this.stack, extractStacktrace(e, 0));

      // Else next test will carry the responsibility
      saveGlobal();

      // Restart the tests if they're blocking
      if (config.blocking) {
        internalRecover(this);
      }
    }

    function runTest (test) {
      let promise;
      if (test.withData) {
        promise = test.callback.call(test.testEnvironment, test.assert, test.data);
      } else {
        promise = test.callback.call(test.testEnvironment, test.assert);
      }
      test.resolvePromise(promise);

      // If the test has an async "pause" on it, but the timeout is 0, then we push a
      // failure as the test should be synchronous.
      if (test.timeout === 0 && test.pauses.size > 0) {
        pushFailure(
          'Test did not finish synchronously even though assert.timeout( 0 ) was used.',
          sourceFromStacktrace(2)
        );
      }
    }
  },

  after: function () {
    checkPollution();
  },

  queueGlobalHook (hook, hookName) {
    const runHook = () => {
      config.current = this;

      let promise;

      if (config.notrycatch) {
        promise = hook.call(this.testEnvironment, this.assert);
      } else {
        try {
          promise = hook.call(this.testEnvironment, this.assert);
        } catch (error) {
          this.pushFailure(
            'Global ' + hookName + ' failed on ' + this.testName +
              ': ' + errorString(error),
            extractStacktrace(error, 0)
          );
          return;
        }
      }

      this.resolvePromise(promise, hookName);
    };

    return runHook;
  },

  queueHook (hook, hookName, hookOwner) {
    const callHook = () => {
      const promise = hook.call(this.testEnvironment, this.assert);
      this.resolvePromise(promise, hookName);
    };

    const runHook = () => {
      if (hookName === 'before') {
        if (hookOwner.testsRun !== 0) {
          return;
        }

        this.preserveEnvironment = true;
      }

      // The 'after' hook should only execute when there are not tests left and
      // when the 'after' and 'finish' tasks are the only tasks left to process
      if (hookName === 'after' &&
        !lastTestWithinModuleExecuted(hookOwner) &&
        (config.queue.length > 0 || config.pq.taskCount() > 2)) {
        return;
      }

      config.current = this;
      if (config.notrycatch) {
        callHook();
        return;
      }
      try {
        // This try-block includes the indirect call to resolvePromise, which shouldn't
        // have to be inside try-catch. But, since we support any user-provided thenable
        // object, the thenable might throw in some unexpected way.
        // This subtle behaviour is undocumented. To avoid new failures in minor releases
        // we will not change this until QUnit 3.
        // TODO: In QUnit 3, reduce this try-block to just hook.call(), matching
        // the simplicity of queueGlobalHook.
        callHook();
      } catch (error) {
        this.pushFailure(hookName + ' failed on ' + this.testName + ': ' +
        (error.message || error), extractStacktrace(error, 0));
      }
    };

    return runHook;
  },

  // Currently only used for module level hooks, can be used to add global level ones
  hooks (handler) {
    const hooks = [];

    function processGlobalhooks (test) {
      if (
        (handler === 'beforeEach' || handler === 'afterEach') &&
        config.globalHooks[handler]
      ) {
        for (let i = 0; i < config.globalHooks[handler].length; i++) {
          hooks.push(
            test.queueGlobalHook(config.globalHooks[handler][i], handler)
          );
        }
      }
    }

    function processHooks (test, module) {
      if (module.parentModule) {
        processHooks(test, module.parentModule);
      }

      if (module.hooks[handler].length) {
        for (let i = 0; i < module.hooks[handler].length; i++) {
          hooks.push(test.queueHook(module.hooks[handler][i], handler, module));
        }
      }
    }

    // Hooks are ignored on skipped tests
    if (!this.skip) {
      processGlobalhooks(this);
      processHooks(this, this.module);
    }

    return hooks;
  },

  finish: function () {
    config.current = this;

    // Release the timeout and timeout callback references to be garbage collected.
    // https://github.com/qunitjs/qunit/pull/1708
    if (setTimeout) {
      clearTimeout(this.timeout);
      config.timeoutHandler = null;
    }

    // Release the test callback to ensure that anything referenced has been
    // released to be garbage collected.
    this.callback = undefined;

    if (this.steps.length) {
      const stepsList = this.steps.join(', ');
      this.pushFailure('Expected assert.verifySteps() to be called before end of test ' +
        `after using assert.step(). Unverified steps: ${stepsList}`, this.stack);
    }

    if (
      !config._deprecated_countEachStep_shown &&
      !config.countStepsAsOne &&
      this.expected !== null &&
      this.stepsCount
    ) {
      config._deprecated_countEachStep_shown = true;
      if (config.requireExpects) {
        Logger.warn('Counting each assert.step() for assert.expect() is changing in QUnit 3.0. You can enable QUnit.config.countStepsAsOne to prepare for the upgrade. https://qunitjs.com/api/assert/expect/');
      } else {
        Logger.warn('Counting each assert.step() for assert.expect() is changing in QUnit 3.0. Omit assert.expect() from tests that use assert.step(), or enable QUnit.config.countStepsAsOne to prepare for the upgrade. https://qunitjs.com/api/assert/expect/');
      }
    }

    const actualCountForExpect = config.countStepsAsOne
      ? (this.assertions.length - this.stepsCount)
      : this.assertions.length;

    if (config.requireExpects && this.expected === null) {
      this.pushFailure('Expected number of assertions to be defined, but expect() was ' +
        'not called.', this.stack);
    } else if (this.expected !== null && this.expected !== actualCountForExpect &&
      (this.stepsCount && this.expected === (this.assertions.length - this.stepsCount) && !config.countStepsAsOne)
    ) {
      this.pushFailure('Expected ' + this.expected + ' assertions, but ' +
        actualCountForExpect + ' were run\nIt looks like you might prefer to enable QUnit.config.countStepsAsOne, which will become the default in QUnit 3.0. https://qunitjs.com/api/assert/expect/', this.stack);
    } else if (this.expected !== null && this.expected !== actualCountForExpect &&
      (this.stepsCount && this.expected === this.assertions.length && config.countStepsAsOne)
    ) {
      this.pushFailure('Expected ' + this.expected + ' assertions, but ' +
        actualCountForExpect + ' were run\nRemember that with QUnit.config.countStepsAsOne and in QUnit 3.0, steps no longer count as separate assertions. https://qunitjs.com/api/assert/expect/', this.stack);
    } else if (this.expected !== null && this.expected !== actualCountForExpect) {
      this.pushFailure('Expected ' + this.expected + ' assertions, but ' +
        actualCountForExpect + ' were run', this.stack);
    } else if (this.expected === null && !actualCountForExpect) {
      this.pushFailure('Expected at least one assertion, but none were run - call ' +
        'expect(0) to accept zero assertions.', this.stack);
    }

    const module = this.module;
    const moduleName = module.name;
    const testName = this.testName;
    const skipped = !!this.skip;
    const todo = !!this.todo;
    let bad = 0;
    const storage = config.storage;

    this.runtime = Math.round(performance.now() - this.started);

    config.stats.all += this.assertions.length;
    config.stats.testCount += 1;
    module.stats.all += this.assertions.length;

    for (let i = 0; i < this.assertions.length; i++) {
      // A failing assertion will counts toward the HTML Reporter's
      // "X assertions, Y failed" line even if it was inside a todo.
      // Inverting this would be similarly confusing since all but the last
      // passing assertion inside a todo test should be considered as good.
      // These stats don't decide the outcome of anything, so counting them
      // as failing seems the most intuitive.
      if (!this.assertions[i].result) {
        bad++;
        config.stats.bad++;
        module.stats.bad++;
      }
    }

    if (skipped) {
      incrementTestsIgnored(module);
    } else {
      incrementTestsRun(module);
    }

    // Store result when possible.
    // Note that this also marks todo tests as bad, thus they get hoisted,
    // and always run first on refresh.
    if (storage) {
      if (bad) {
        storage.setItem('qunit-test-' + moduleName + '-' + testName, bad);
      } else {
        storage.removeItem('qunit-test-' + moduleName + '-' + testName);
      }
    }

    // After emitting the js-reporters event we cleanup the assertion data to
    // avoid leaking it. It is not used by the legacy testDone callbacks.
    emit('testEnd', this.testReport.end(true));
    this.testReport.slimAssertions();
    const test = this;

    return runLoggingCallbacks('testDone', {
      name: testName,
      module: moduleName,
      skipped: skipped,
      todo: todo,
      failed: bad,
      passed: this.assertions.length - bad,
      total: this.assertions.length,
      runtime: skipped ? 0 : this.runtime,

      // HTML Reporter use
      assertions: this.assertions,
      testId: this.testId,

      // Source of Test
      // generating stack trace is expensive, so using a getter will help defer this until we need it
      get source () { return test.stack; }
    }).then(function () {
      if (allTestsExecuted(module)) {
        const completedModules = [module];

        // Check if the parent modules, iteratively, are done. If that the case,
        // we emit the `suiteEnd` event and trigger `moduleDone` callback.
        let parent = module.parentModule;
        while (parent && allTestsExecuted(parent)) {
          completedModules.push(parent);
          parent = parent.parentModule;
        }

        let moduleDoneChain = Promise.resolve();
        completedModules.forEach(completedModule => {
          moduleDoneChain = moduleDoneChain.then(() => {
            return logSuiteEnd(completedModule);
          });
        });
        return moduleDoneChain;
      }
    }).then(function () {
      config.current = undefined;
    });

    function logSuiteEnd (module) {
      // Reset `module.hooks` to ensure that anything referenced in these hooks
      // has been released to be garbage collected. Descendant modules that were
      // entirely skipped, e.g. due to filtering, will never have this method
      // called for them, but might have hooks with references pinning data in
      // memory (even if the hooks weren't actually executed), so we reset the
      // hooks on all descendant modules here as well. This is safe because we
      // will never call this as long as any descendant modules still have tests
      // to run. This also means that in multi-tiered nesting scenarios we might
      // reset the hooks multiple times on some modules, but that's harmless.
      const modules = [module];
      while (modules.length) {
        const nextModule = modules.shift();
        nextModule.hooks = {};
        modules.push(...nextModule.childModules);
      }

      emit('suiteEnd', module.suiteReport.end(true));
      return runLoggingCallbacks('moduleDone', {
        name: module.name,
        tests: module.tests,
        failed: module.stats.bad,
        passed: module.stats.all - module.stats.bad,
        total: module.stats.all,
        runtime: Math.round(performance.now() - module.stats.started)
      });
    }
  },

  preserveTestEnvironment: function () {
    if (this.preserveEnvironment) {
      this.module.testEnvironment = this.testEnvironment;
      this.testEnvironment = extend({}, this.module.testEnvironment);
    }
  },

  queue () {
    const test = this;

    if (!this.valid()) {
      incrementTestsIgnored(this.module);
      return;
    }

    function runTest () {
      return [
        function () {
          return test.before();
        },

        ...test.hooks('before'),

        function () {
          test.preserveTestEnvironment();
        },

        ...test.hooks('beforeEach'),

        function () {
          test.run();
        },

        ...test.hooks('afterEach').reverse(),
        ...test.hooks('after').reverse(),

        function () {
          test.after();
        },

        function () {
          return test.finish();
        }
      ];
    }

    const previousFailCount = config.storage &&
        +config.storage.getItem('qunit-test-' + this.module.name + '-' + this.testName);

    // Prioritize previously failed tests, detected from storage
    const prioritize = config.reorder && !!previousFailCount;

    this.previousFailure = !!previousFailCount;

    config.pq.add(runTest, prioritize);
  },

  pushResult: function (resultInfo) {
    if (this !== config.current) {
      const message = (resultInfo && resultInfo.message) || '';
      const testName = (this && this.testName) || '';
      const error = 'Assertion occurred after test finished.\n' +
        '> Test: ' + testName + '\n' +
        '> Message: ' + message + '\n';

      throw new Error(error);
    }

    // Destructure of resultInfo = { result, actual, expected, message, negative }
    const details = {
      module: this.module.name,
      name: this.testName,
      result: resultInfo.result,
      message: resultInfo.message,
      actual: resultInfo.actual,
      testId: this.testId,
      negative: resultInfo.negative || false,
      runtime: Math.round(performance.now() - this.started),
      todo: !!this.todo
    };

    if (hasOwn.call(resultInfo, 'expected')) {
      details.expected = resultInfo.expected;
    }

    if (!resultInfo.result) {
      const source = resultInfo.source || sourceFromStacktrace();

      if (source) {
        details.source = source;
      }
    }

    this.logAssertion(details);

    this.assertions.push({
      result: !!resultInfo.result,
      message: resultInfo.message
    });
  },

  pushFailure: function (message, source, actual) {
    if (!(this instanceof Test)) {
      throw new Error('pushFailure() assertion outside test context, was ' +
        sourceFromStacktrace(2));
    }

    this.pushResult({
      result: false,
      message: message || 'error',
      actual: actual || null,
      source
    });
  },

  /**
   * Log assertion details using both the old QUnit.log interface and
   * QUnit.on( "assertion" ) interface.
   *
   * @private
   */
  logAssertion (details) {
    runLoggingCallbacks('log', details);

    const assertion = {
      passed: details.result,
      actual: details.actual,
      expected: details.expected,
      message: details.message,
      stack: details.source,
      todo: details.todo
    };
    this.testReport.pushAssertion(assertion);
    emit('assertion', assertion);
  },

  /**
   * Reset config.timeout with a new timeout duration.
   *
   * @param {number} timeoutDuration
   */
  internalResetTimeout (timeoutDuration) {
    clearTimeout(config.timeout);
    config.timeout = setTimeout(config.timeoutHandler(timeoutDuration), timeoutDuration);
  },

  /**
   * Create a new async pause and return a new function that can release the pause.
   *
   * This mechanism is internally used by:
   *
   * - explicit async pauses, created by calling `assert.async()`,
   * - implicit async pauses, created when `QUnit.test()` or module hook callbacks
   *   use async-await or otherwise return a Promise.
   *
   * Happy scenario:
   *
   * - Pause is created by calling internalStop().
   *
   *   Pause is released normally by invoking release() during the same test.
   *
   *   The release() callback lets internal processing resume.
   *
   * Failure scenarios:
   *
   * - The test fails due to an uncaught exception.
   *
   *   In this case, Test.run() will call internalRecover() which empties the clears all
   *   async pauses and sets the cancelled flag, which means we silently ignore any
   *   late calls to the resume() callback, as we will have moved on to a different
   *   test by then, and we don't want to cause an extra "release during a different test"
   *   errors that the developer isn't really responsible for. This can happen when a test
   *   correctly schedules a call to release(), but also causes an uncaught error. The
   *   uncaught error means we will no longer wait for the release (as it might not arrive).
   *
   * - Pause is never released, or called an insufficient number of times.
   *
   *   Our timeout handler will kill the pause and resume test processing, basically
   *   like internalRecover(), but for one pause instead of any/all.
   *
   *   Here, too, any late calls to resume() will be silently ignored to avoid
   *   extra errors. We tolerate this since the original test will have already been
   *   marked as failure.
   *
   *   TODO: QUnit 3 will enable timeouts by default <https://github.com/qunitjs/qunit/issues/1483>,
   *   but right now a test will hang indefinitely if async pauses are not released,
   *   unless QUnit.config.testTimeout or assert.timeout() is used.
   *
   * - Pause is spontaneously released during a different test,
   *   or when no test is currently running.
   *
   *   This is close to impossible because this error only happens if the original test
   *   succesfully finished first (since other failure scenarios kill pauses and ignore
   *   late calls). It can happen if a test ended exactly as expected, but has some
   *   external or shared state continuing to hold a reference to the release callback,
   *   and either the same test scheduled another call to it in the future, or a later test
   *   causes it to be called through some shared state.
   *
   * - Pause release() is called too often, during the same test.
   *
   *   This simply throws an error, after which uncaught error handling picks it up
   *   and processing resumes.
   *
   * @param {number} [requiredCalls=1]
   */
  internalStop (requiredCalls = 1) {
    config.blocking = true;

    const test = this;
    const pauseId = this.nextPauseId++;
    const pause = {
      cancelled: false,
      remaining: requiredCalls
    };
    test.pauses.set(pauseId, pause);

    function release () {
      if (pause.cancelled) {
        return;
      }
      if (config.current === undefined) {
        throw new Error('Unexpected release of async pause after tests finished.\n' +
          `> Test: ${test.testName} [async #${pauseId}]`);
      }
      if (config.current !== test) {
        throw new Error('Unexpected release of async pause during a different test.\n' +
          `> Test: ${test.testName} [async #${pauseId}]`);
      }
      if (pause.remaining <= 0) {
        throw new Error('Tried to release async pause that was already released.\n' +
          `> Test: ${test.testName} [async #${pauseId}]`);
      }

      // The `requiredCalls` parameter exists to support `assert.async(count)`
      pause.remaining--;
      if (pause.remaining === 0) {
        test.pauses.delete(pauseId);
      }

      internalStart(test);
    }

    // Set a recovery timeout, if so configured.
    if (setTimeout) {
      let timeoutDuration;
      if (typeof test.timeout === 'number') {
        timeoutDuration = test.timeout;
      } else if (typeof config.testTimeout === 'number') {
        timeoutDuration = config.testTimeout;
      }

      if (typeof timeoutDuration === 'number' && timeoutDuration > 0) {
        config.timeoutHandler = function (timeout) {
          return function () {
            config.timeout = null;
            pause.cancelled = true;
            test.pauses.delete(pauseId);

            test.pushFailure(
              `Test took longer than ${timeout}ms; test timed out.`,
              sourceFromStacktrace(2)
            );
            internalRecover(test);
          };
        };
        clearTimeout(config.timeout);
        config.timeout = setTimeout(
          config.timeoutHandler(timeoutDuration),
          timeoutDuration
        );
      } else {
        clearTimeout(config.timeout);
        config.timeout = setTimeout(
          function () {
            config.timeout = null;
            if (!config._deprecated_timeout_shown) {
              config._deprecated_timeout_shown = true;
              Logger.warn(`Test "${test.testName}" took longer than 3000ms, but no timeout was set. Set QUnit.config.testTimeout or call assert.timeout() to avoid a timeout in QUnit 3. https://qunitjs.com/api/config/testTimeout/`);
            }
          },
          3000
        );
      }
    }

    return release;
  },

  resolvePromise: function (promise, phase) {
    if (promise != null) {
      const test = this;
      const then = promise.then;
      if (typeof then === 'function') {
        const resume = test.internalStop();
        const resolve = function () { resume(); };
        if (config.notrycatch) {
          then.call(promise, resolve);
        } else {
          const reject = function (error) {
            const message = 'Promise rejected ' +
              (!phase ? 'during' : phase.replace(/Each$/, '')) +
              ' "' + test.testName + '": ' +
              ((error && error.message) || error);
            test.pushFailure(message, extractStacktrace(error, 0));

            // Else next test will carry the responsibility
            saveGlobal();

            // Unblock
            internalRecover(test);
          };
          then.call(promise, resolve, reject);
        }
      }
    }
  },

  valid: function () {
    // Internally-generated tests are always valid
    if (this.callback && this.callback.validTest) {
      return true;
    }

    function moduleChainIdMatch (testModule, selectedId) {
      return (
        // undefined or empty array
        !selectedId || !selectedId.length ||
        inArray(testModule.moduleId, selectedId) || (
          testModule.parentModule && moduleChainIdMatch(testModule.parentModule, selectedId)
        )
      );
    }

    if (!moduleChainIdMatch(this.module, config.moduleId)) {
      return false;
    }

    if (config.testId && config.testId.length && !inArray(this.testId, config.testId)) {
      return false;
    }

    function moduleChainNameMatch (testModule, selectedModule) {
      if (!selectedModule) {
        // undefined or empty string
        return true;
      }
      const testModuleName = testModule.name ? testModule.name.toLowerCase() : null;
      if (testModuleName === selectedModule) {
        return true;
      } else if (testModule.parentModule) {
        return moduleChainNameMatch(testModule.parentModule, selectedModule);
      } else {
        return false;
      }
    }
    const selectedModule = config.module && config.module.toLowerCase();
    if (!moduleChainNameMatch(this.module, selectedModule)) {
      return false;
    }

    const filter = config.filter;
    if (!filter) {
      return true;
    }

    const regexFilter = /^(!?)\/([\w\W]*)\/(i?$)/.exec(filter);
    const fullName = (this.module.name + ': ' + this.testName);
    return regexFilter
      ? this.regexFilter(!!regexFilter[1], regexFilter[2], regexFilter[3], fullName)
      : this.stringFilter(filter, fullName);
  },

  regexFilter: function (exclude, pattern, flags, fullName) {
    const regex = new RegExp(pattern, flags);
    const match = regex.test(fullName);

    return match !== exclude;
  },

  stringFilter: function (filter, fullName) {
    filter = filter.toLowerCase();
    fullName = fullName.toLowerCase();

    const include = filter.charAt(0) !== '!';
    if (!include) {
      filter = filter.slice(1);
    }

    // If the filter matches, we need to honour include
    if (fullName.indexOf(filter) !== -1) {
      return include;
    }

    // Otherwise, do the opposite
    return !include;
  }
};

export function pushFailure () {
  if (!config.current) {
    throw new Error('pushFailure() assertion outside test context, in ' +
      sourceFromStacktrace(2));
  }

  // Gets current test obj
  const currentTest = config.current;

  return currentTest.pushFailure.apply(currentTest, arguments);
}

function saveGlobal () {
  config.pollution = [];

  if (config.noglobals) {
    for (const key in globalThis) {
      if (hasOwn.call(globalThis, key)) {
        // In Opera sometimes DOM element ids show up here, ignore them
        if (/^qunit-test-output/.test(key)) {
          continue;
        }
        config.pollution.push(key);
      }
    }
  }
}

function checkPollution () {
  const old = config.pollution;

  saveGlobal();

  const newGlobals = diff(config.pollution, old);
  if (newGlobals.length > 0) {
    pushFailure('Introduced global variable(s): ' + newGlobals.join(', '));
  }

  const deletedGlobals = diff(old, config.pollution);
  if (deletedGlobals.length > 0) {
    pushFailure('Deleted global variable(s): ' + deletedGlobals.join(', '));
  }
}

let focused = false; // indicates that the "only" filter was used

function addTest (settings) {
  if (focused || config.currentModule.ignored) {
    return;
  }

  const newTest = new Test(settings);

  newTest.queue();
}

function addOnlyTest (settings) {
  if (config.currentModule.ignored) {
    return;
  }
  if (!focused) {
    config.queue.length = 0;
    focused = true;
  }

  const newTest = new Test(settings);

  newTest.queue();
}

// Will be exposed as QUnit.test
export function test (testName, callback) {
  addTest({ testName, callback });
}

function makeEachTestName (testName, argument) {
  return `${testName} [${argument}]`;
}

function runEach (data, eachFn) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      eachFn(data[i], i);
    }
  } else if (typeof data === 'object' && data !== null) {
    for (let key in data) {
      eachFn(data[key], key);
    }
  } else {
    throw new Error(
      `test.each() expects an array or object as input, but
found ${typeof data} instead.`
    );
  }
}

extend(test, {
  todo: function (testName, callback) {
    addTest({ testName, callback, todo: true });
  },
  skip: function (testName) {
    addTest({ testName, skip: true });
  },
  only: function (testName, callback) {
    addOnlyTest({ testName, callback });
  },
  each: function (testName, dataset, callback) {
    runEach(dataset, (data, testKey) => {
      addTest({
        testName: makeEachTestName(testName, testKey),
        callback,
        withData: true,
        stackOffset: 5,
        data
      });
    });
  }
});

test.todo.each = function (testName, dataset, callback) {
  runEach(dataset, (data, testKey) => {
    addTest({
      testName: makeEachTestName(testName, testKey),
      callback,
      todo: true,
      withData: true,
      stackOffset: 5,
      data
    });
  });
};
test.skip.each = function (testName, dataset) {
  runEach(dataset, (_, testKey) => {
    addTest({
      testName: makeEachTestName(testName, testKey),
      stackOffset: 5,
      skip: true
    });
  });
};

test.only.each = function (testName, dataset, callback) {
  runEach(dataset, (data, testKey) => {
    addOnlyTest({
      testName: makeEachTestName(testName, testKey),
      callback,
      withData: true,
      stackOffset: 5,
      data
    });
  });
};

// Forcefully release all processing holds.
function internalRecover (test) {
  test.pauses.forEach(pause => {
    pause.cancelled = true;
  });
  test.pauses.clear();
  internalStart(test);
}

// Release a processing hold, scheduling a resumption attempt if no holds remain.
function internalStart (test) {
  // Ignore if other async pauses still exist.
  if (test.pauses.size > 0) {
    return;
  }

  // Add a slight delay to allow more assertions etc.
  if (setTimeout) {
    clearTimeout(config.timeout);
    config.timeout = setTimeout(function () {
      if (test.pauses.size > 0) {
        return;
      }

      clearTimeout(config.timeout);
      config.timeout = null;

      config.blocking = false;
      config.pq.advance();
    });
  } else {
    config.blocking = false;
    config.pq.advance();
  }
}

function collectTests (module) {
  const tests = [].concat(module.tests);
  const modules = [...module.childModules];

  // Do a breadth-first traversal of the child modules
  while (modules.length) {
    const nextModule = modules.shift();
    tests.push.apply(tests, nextModule.tests);
    modules.push(...nextModule.childModules);
  }

  return tests;
}

// This returns true after all executable and skippable tests
// in a module have been proccessed, and informs 'suiteEnd'
// and moduleDone().
function allTestsExecuted (module) {
  return module.testsRun + module.testsIgnored === collectTests(module).length;
}

// This returns true during the last executable non-skipped test
// within a module, and informs the running of the 'after' hook
// for a given module. This runs only once for a given module,
// but must run during the last non-skipped test. When it runs,
// there may be non-zero skipped tests left.
function lastTestWithinModuleExecuted (module) {
  return module.testsRun === collectTests(module).filter(test => !test.skip).length - 1;
}

function incrementTestsRun (module) {
  module.testsRun++;
  while ((module = module.parentModule)) {
    module.testsRun++;
  }
}

function incrementTestsIgnored (module) {
  module.testsIgnored++;
  while ((module = module.parentModule)) {
    module.testsIgnored++;
  }
}
