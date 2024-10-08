import Assert from './assert.js';
import { runLoggingCallbacks } from './callbacks.js';
import config from './config.js';
import dump from './dump.js';
import { emit } from './events.js';
import { globalThis, setTimeout, clearTimeout, StringMap } from './globals.js';
import Logger from './logger.js';
import Promise from './promise.js';
import TestReport from './reports/test.js';
import { extractStacktrace, sourceFromStacktrace } from './stacktrace.js';
import {
  diff,
  errorString,
  extend,
  generateHash,
  hasOwn,
  inArray,
  performance
} from './utilities.js';

export default function Test (settings) {
  this.expected = null;
  this.assertions = [];
  this.module = config.currentModule;
  this.steps = [];
  // Track count in order to detect likely issue when upgrading.
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
  // A notable exception is test.each(), which overrides this.
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
  // This was once supported for internal use by QUnit.onUncaughtException(),
  // to render a "global error" if the uncaught error happened outside a test
  // and after the runEnd event. This was unstable and could be missed by CI.
  // (Meaning the CI would pass despite the late-failing test).
  // Ref https://github.com/qunitjs/qunit/issues/1377
  if (config._pq.finished) {
    throw new Error('Unexpected test after runEnd. https://qunitjs.com/api/QUnit/module/#E0001');
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
    // Skipped tests will fully ignore (and dereference for garbage collect) any sent callback
    this.callback = function () {};
    this.async = false;
    this.expected = 0;
  } else {
    this.assert = new Assert(this);
  }
}

Test.count = 0;

function getModulesForStartEvent (startingModule) {
  let module = startingModule;
  const modules = [];

  while (module && module.testsRun === 0) {
    modules.push(module);
    module = module.parentModule;
  }

  // The above starts from the child and moves up to the parent.
  // Return this in reversed order, such that we start with top-most parent.
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
    const notStartedModules = getModulesForStartEvent(module);

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

    let promise;
    if (config.notrycatch) {
      promise = (this.withData)
        ? this.callback.call(this.testEnvironment, this.assert, this.data)
        : this.callback.call(this.testEnvironment, this.assert);
    } else {
      try {
        promise = (this.withData)
          ? this.callback.call(this.testEnvironment, this.assert, this.data)
          : this.callback.call(this.testEnvironment, this.assert);
      } catch (e) {
        this.pushFailure('Died on test #' + (this.assertions.length + 1) + ': '
          + (e.message || e) + '\n' + this.stack, extractStacktrace(e, 0));

        // Else next test will carry the responsibility
        saveGlobal();

        // Restart the tests if they're blocking
        if (config.blocking) {
          internalRecover(this);
        }
      }
    }

    this.resolvePromise(promise);

    // If the test has an async "pause" on it, but the timeout is 0, then we push a
    // failure as the test should be synchronous.
    if (this.timeout === 0 && this.pauses.size > 0) {
      pushFailure(
        'Test did not finish synchronously even though assert.timeout( 0 ) was used.',
        sourceFromStacktrace(2)
      );
    }
  },

  after: function () {
    checkPollution();
  },

  queueGlobalHook (hook, hookName) {
    const runGlobalHook = () => {
      config.current = this;

      let promise;
      if (config.notrycatch) {
        promise = hook.call(this.testEnvironment, this.assert);
      } else {
        try {
          promise = hook.call(this.testEnvironment, this.assert);
        } catch (error) {
          this.pushFailure(
            'Global ' + hookName + ' failed on ' + this.testName
              + ': ' + errorString(error),
            extractStacktrace(error, 0)
          );
          return;
        }
      }

      this.resolvePromise(promise, hookName);
    };
    return runGlobalHook;
  },

  queueHook (hook, hookName, hookOwner) {
    const runHook = () => {
      if (hookName === 'before' && hookOwner.testsRun !== 0) {
        return;
      }

      // The 'after' hook should only execute when there are no tests left and
      // when the 'after' and 'finish' tasks are the only tasks left to process
      if (hookName === 'after'
        && !lastTestWithinModuleExecuted(hookOwner)
        && (config.queue.length > 0 || config._pq.taskCount() > 2)) {
        return;
      }

      config.current = this;

      // before and after hooks are called with the owning module's testEnvironment
      const testEnvironment = (hookName === 'before' || hookName === 'after')
        ? hookOwner.testEnvironment
        : this.testEnvironment;

      let promise;
      if (config.notrycatch) {
        promise = hook.call(testEnvironment, this.assert);
      } else {
        try {
          promise = hook.call(testEnvironment, this.assert);
        } catch (error) {
          this.pushFailure(
            hookName + ' failed on ' + this.testName + ': '
              + (error.message || error), extractStacktrace(error, 0)
          );
          return;
        }
      }

      this.resolvePromise(promise, hookName);
    };
    return runHook;
  },

  // Currently only used for module level hooks, can be used to add global level ones
  hooks (handler) {
    const hooks = [];

    function processGlobalhooks (test) {
      if (
        (handler === 'beforeEach' || handler === 'afterEach')
        && config._globalHooks[handler]
      ) {
        for (let i = 0; i < config._globalHooks[handler].length; i++) {
          hooks.push(
            test.queueGlobalHook(config._globalHooks[handler][i], handler)
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
      this.pushFailure(`Expected assert.verifySteps() to be called before end of test after using assert.step(). Unverified steps: ${stepsList}`,
        this.stack
      );
    }

    if (config.requireExpects && this.expected === null) {
      this.pushFailure('Expected number of assertions to be defined, but expect() was not called.', this.stack);
    } else if (this.expected !== null && this.stepsCount && (this.expected === (this.assertions.length + this.stepsCount))) {
      this.pushFailure('Expected ' + this.expected + ' assertions, but ' + this.assertions.length + ' were run.\nIt looks like you are upgrading from QUnit 2. Steps no longer count as separate assertions. https://qunitjs.com/api/assert/expect/',
        this.stack
      );
    } else if (this.expected !== null && this.expected !== this.assertions.length) {
      this.pushFailure('Expected ' + this.expected + ' assertions, but ' + this.assertions.length + ' were run',
        this.stack
      );
    } else if (this.expected === null && !this.assertions.length) {
      this.pushFailure('Expected at least one assertion, but none were run - call expect(0) to accept zero assertions.', this.stack);
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
      // For legacy reasons, `config.stats` reflects raw assertion counts.
      // This means all failures add to the "bad" count, even an expected
      // failure inside a passing "todo" test.
      // See also https://qunitjs.com/api/callbacks/QUnit.done/
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

    // After emitting the event, we trim the assertion data to
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
      // TODO: Remove "assertions". It is no longer used as of QUnit 3.0.
      // It was only used to calculate assertions.length which is identical to "total".
      assertions: this.assertions,
      testId: this.testId,

      // Source of Test
      // generating stack trace is expensive, so using a getter will help defer this until we need it
      get source () { return test.stack; }
    }).then(function () {
      // Emit the `suiteEnd` event and `moduleDone` callbacks for modules
      // that are completed as of now.
      const completedModules = [];
      let parent = module;
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
    }).then(function () {
      config.current = undefined;
    });

    function logSuiteEnd (module) {
      // Empty `module.hooks` to ensure that anything referenced in these hooks
      // has been released to be garbage collected. Descendant modules that were
      // entirely skipped, e.g. due to filtering, will never have this method
      // called for them, but might have hooks with references that hold data in
      // memory (even if the hooks were never executed), so we empty the
      // hooks on all descendant modules here as well. This is safe because we
      // will never call this as long as any descendant modules still have tests
      // to run. This also means that for deeply nested modules, we might empty
      // the hooks on completed child modules multiple times. That's harmless.
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
          test.testEnvironment = extend({}, test.module.testEnvironment, false, true);
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

    const previousFailCount = config.storage
        && +config.storage.getItem('qunit-test-' + this.module.name + '-' + this.testName);

    // Prioritize previously failed tests, detected from storage
    const prioritize = config.reorder && !!previousFailCount;

    this.previousFailure = !!previousFailCount;

    config._pq.add(runTest, prioritize);
  },

  pushResult: function (resultInfo) {
    if (this !== config.current) {
      const message = (resultInfo && resultInfo.message) || '';
      const testName = (this && this.testName) || '';
      const error = 'Assertion occurred after test finished.\n'
        + '> Test: ' + testName + '\n'
        + '> Message: ' + message + '\n';

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

  pushFailure: function (message, source) {
    if (!(this instanceof Test)) {
      throw new Error('pushFailure() assertion outside test context, was '
        + sourceFromStacktrace(2));
    }

    this.pushResult({
      result: false,
      message: message || 'error',
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
        throw new Error('Unexpected release of async pause after tests finished.\n'
          + `> Test: ${test.testName} [async #${pauseId}]`);
      }
      if (config.current !== test) {
        throw new Error('Unexpected release of async pause during a different test.\n'
          + `> Test: ${test.testName} [async #${pauseId}]`);
      }
      if (pause.remaining <= 0) {
        throw new Error('Tried to release async pause that was already released.\n'
          + `> Test: ${test.testName} [async #${pauseId}]`);
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
      } else {
        Logger.warn(`QUnit.config.testTimeout was set to an an invalid value (${dump.typeOf(config.testTimeout)}). Using default. https://qunitjs.com/api/config/testTimeout/`);
        timeoutDuration = 3000;
      }

      if (timeoutDuration > 0) {
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
      }
    }

    return release;
  },

  resolvePromise: function (promise, phase) {
    if (promise !== undefined && promise !== null) {
      const test = this;
      if (typeof promise.then === 'function') {
        const resume = test.internalStop();
        const resolve = function () { resume(); };
        if (config.notrycatch) {
          promise.then(resolve);
        } else {
          const reject = function (error) {
            const message = 'Promise rejected '
              + (!phase ? 'during' : phase.replace(/Each$/, ''))
              + ' "' + test.testName + '": '
              + ((error && error.message) || error);
            test.pushFailure(message, extractStacktrace(error, 0));

            // Else next test will carry the responsibility
            saveGlobal();

            // Unblock
            internalRecover(test);
          };
          // Note that `promise` is a user-supplied thenable, not per-se a standard Promise.
          // This means it can be a "bad thenable" where calling then() can also throw.
          // This is not about a rejected Promise or throwing async function.
          // In those cases, `ret.then(, cb)` will not throw, but inform you via cb(err).
          // Instead, this is testing a bad Thenable implementation, where then() itself
          // throws an error. This is not possible with native Promise, but is possible with
          // custom Promise-compatible libraries.
          // We must catch this to avoid breaking the ProcessingQueue.
          // Promise.resolve() normalizes and catches even these internal errors and
          // sends them to reject.
          Promise.resolve(promise).then(resolve, reject);
        }
      }
    }
  },

  valid: function () {
    function moduleChainIdMatch (testModule, selectedId) {
      return (
        // undefined or empty array
        !selectedId || !selectedId.length
        || inArray(testModule.moduleId, selectedId) || (
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
    throw new Error('pushFailure() assertion outside test context, in '
      + sourceFromStacktrace(2));
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

// Characters to avoid in test names especially CLI/AP output:
// * x00-1F: e.g. NULL, backspace (\b), line breaks (\r\n), ESC.
// * x74: DEL.
// * xA0: non-breaking space.
//
// See https://en.wikipedia.org/wiki/ASCII#Character_order
//
// eslint-disable-next-line no-control-regex
const rNonObviousStr = /[\x00-\x1F\x7F\xA0]/;
function runEach (data, eachFn) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const value = data[i];

      // Create automatic labels for primitive data in arrays passed to test.each().
      // We want to avoid the default "example [0], example [1]" where possible since
      // these are not self-explanatory in results, and are also tedious to locate
      // the source of since the numerical key of an array isn't literally in the
      // code (you have to count).
      //
      // Design requirements:
      // * Unique. Each label must be unique and correspond 1:1 with a data value.
      //   This way each test name will hash to a unique testId with Rerun link,
      //   without having to rely on Test class enforcing uniqueness with invisible
      //   space hack.
      // * Unambigious. While technical uniqueness is a hard requirement above,
      //   we also want the labels to be obvious and unambiguous to humans.
      //   For example, abbrebating "foobar" and "foobaz" to "f" and "fo" is
      //   technically unique, but ambigious to humans which one is which.
      // * Short and readable. Where possible we omit the array index numbers
      //   so that in most cases, the value is simply shown as-is.
      //   We prefer "example [foo], example [bar]"
      //   over "example [0: foo], example [2: bar]".
      //   This also has the benefit of being stable and robust against e.g.
      //   re-ordering data or adding new items during development, without
      //   invalidating a previous filter or rerun link immediately.
      const valueType = typeof value;
      let testKey = i;
      if (valueType === 'string' && value.length <= 40 && !rNonObviousStr.test(value) && !/\s*\d+: /.test(value)) {
        testKey = value;
      } else if (valueType === 'string' || valueType === 'number' || valueType === 'boolean' || valueType === 'undefined' || value === null) {
        const valueForName = String(value);
        if (!rNonObviousStr.test(valueForName)) {
          testKey = i + ': ' + (valueForName.length <= 30
            ? valueForName
            : valueForName.slice(0, 29) + '…'
          );
        }
      }
      eachFn(value, testKey);
    }
  } else if (typeof data === 'object' && data !== null) {
    for (let key in data) {
      eachFn(data[key], key);
    }
  } else {
    throw new TypeError(
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
  if: function (testName, condition, callback) {
    addTest({ testName, callback, skip: !condition });
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
test.if.each = function (testName, condition, dataset, callback) {
  runEach(dataset, (data, testKey) => {
    addTest({
      testName: makeEachTestName(testName, testKey),
      callback,
      withData: true,
      stackOffset: 5,
      skip: !condition,
      data: condition ? data : undefined
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
      config._pq.advance();
    });
  } else {
    config.blocking = false;
    config._pq.advance();
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
