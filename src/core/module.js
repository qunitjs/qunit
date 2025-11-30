import config from './config.js';
import SuiteReport from './reports/suite.js';
import { extend, generateHash, isAsyncFunction } from './utilities.js';

export const globalSuiteReport = new SuiteReport();

// This also pushes the unnamed module to config.modules.
// It is important that we not push this into the moduleStack,
// since it is not meant to be a parent to any other modules.
export const unnamedModule = createModule('', {}, {}, globalSuiteReport);

function isParentModuleInQueue () {
  const modulesInQueue = config.modules
    .filter(module => !module.ignored)
    .map(module => module.moduleId);
  return config._moduleStack.some(module => modulesInQueue.includes(module.moduleId));
}

/**
 * This does:
 * - Create a module object
 * - Link it to and from a parent module (if one is on the stack)
 * - Link it to a parent SuiteReport (if one is on the stack)
 * - Push it to `config.modules`
 *
 * It does NOT push it to config._moduleStack. That's only relevant for
 * scoped modules, and is the responsibility of processModule().
 *
 * @param {string} name
 * @param {Object} testEnvironment
 * @param {Object} modifiers
 * @param {SuiteReport} suiteReport Force the report, for use by the initial unnamedModule
 * @return {Object}
 */
function createModule (name, testEnvironment, modifiers, suiteReport) {
  const parentModule = config._moduleStack.length
    ? config._moduleStack[config._moduleStack.length - 1]
    : null;
  const moduleName = parentModule !== null ? [parentModule.name, name].join(' > ') : name;

  const skip = (parentModule !== null && parentModule.skip) || modifiers.skip;
  const todo = (parentModule !== null && parentModule.todo) || modifiers.todo;

  const module = {
    name: moduleName,
    parentModule: parentModule,
    hooks: {
      before: [],
      beforeEach: [],
      afterEach: [],
      after: []
    },
    testEnvironment: extend(
      // Live inheritence as of QUnit 3. https://github.com/qunitjs/qunit/pull/1762
      (parentModule ? Object.create(parentModule.testEnvironment || {}) : {}),
      testEnvironment
    ),
    tests: [],
    moduleId: generateHash(moduleName),
    testsRun: 0,
    testsIgnored: 0,
    childModules: [],
    suiteReport: suiteReport || new SuiteReport(
      name,
      parentModule ? parentModule.suiteReport : globalSuiteReport
    ),

    // Initialised by test.js when the module start executing,
    // i.e. before the first test in this module (or a child).
    stats: null,

    // Pass along `skip` and `todo` properties from parent module, in case
    // there is one, to childs. And use own otherwise.
    // This property will be used to mark own tests and tests of child suites
    // as either `skipped` or `todo`.
    skip: skip,
    todo: skip ? false : todo,
    ignored: modifiers.ignored || false
  };

  if (parentModule) {
    parentModule.childModules.push(module);
  }

  config.modules.push(module);

  return module;
}

function setHookFromEnvironment (environment, hooks, name) {
  const potentialHook = environment[name];
  if (typeof potentialHook === 'function') {
    hooks[name].push(potentialHook);
  }
  delete environment[name];
}

function makeSetHook (module, hookName) {
  return function setHook (callback) {
    if (config.currentModule !== module) {
      throw new Error(`Cannot add ${hookName} hook outside the containing module. Called on "${module.name}", instead of expected "${config.currentModule.name}". https://qunitjs.com/api/QUnit/module/#E0002`);
    }
    module.hooks[hookName].push(callback);
  };
}

function processModule (name, options, scope, modifiers = {}) {
  if (typeof options === 'function') {
    scope = options;
    options = undefined;
  }

  if (isAsyncFunction(scope)) {
    throw new TypeError('QUnit.module() callback must not be async. For async module setup, use hooks. https://qunitjs.com/api/QUnit/module/#hooks');
  }

  const module = createModule(name, options, modifiers);

  // Transfer any initial hooks from the options object to the 'hooks' object
  const testEnvironment = module.testEnvironment;
  const hooks = module.hooks;
  setHookFromEnvironment(testEnvironment, hooks, 'before');
  setHookFromEnvironment(testEnvironment, hooks, 'beforeEach');
  setHookFromEnvironment(testEnvironment, hooks, 'afterEach');
  setHookFromEnvironment(testEnvironment, hooks, 'after');

  const moduleFns = {
    before: makeSetHook(module, 'before'),
    beforeEach: makeSetHook(module, 'beforeEach'),
    afterEach: makeSetHook(module, 'afterEach'),
    after: makeSetHook(module, 'after')
  };

  const prevModule = config.currentModule;
  config.currentModule = module;

  if (typeof scope === 'function') {
    config._moduleStack.push(module);

    try {
      const cbReturnValue = scope.call(module.testEnvironment, moduleFns);
      if (cbReturnValue && typeof cbReturnValue.then === 'function') {
        throw new TypeError('QUnit.module() callback must not be async. For async module setup, use hooks. https://qunitjs.com/api/QUnit/module/#hooks');
      }
    } finally {
      // If the module closure threw an uncaught error during the load phase,
      // we let this bubble up to global error handlers. But, not until after
      // we teardown internal state to ensure correct module nesting.
      // Ref https://github.com/qunitjs/qunit/issues/1478.
      config._moduleStack.pop();
      config.currentModule = module.parentModule || prevModule;
    }
  }
}

/**
 * Clear the SuiteReport tree of all tests and leave only current module as child suite
 *
 * This should be called before defining the first module.only() or test.only()
 * because otherwise:
 * - `runEnd.testCounts` is too high.
 * - UI (HtmlReporter) and TAP (TapReporter) display totals too high.
 * - Test runners like QTap might timeout because the TAP plan
 *   would be printed as "1..9" even if only 2 tests are run,
 *   which means tap-finished will wait for 3-9.
 */
export function clearSuiteReports (currentModule) {
  let childSuite = null;
  let suiteReport = currentModule.suiteReport;
  while (suiteReport) {
    suiteReport.tests.length = 0;
    const i = suiteReport.childSuites.indexOf(childSuite);
    if (i === -1) {
      suiteReport.childSuites.length = 0;
    } else {
      // Reduce in-place to just currentModule.suiteReport or its intermediary
      suiteReport.childSuites.splice(0, i);
      suiteReport.childSuites.splice(1);
    }

    if (suiteReport === globalSuiteReport) {
      suiteReport = null;
    } else {
      childSuite = suiteReport;
      currentModule = currentModule.parentModule;
      suiteReport = (currentModule && currentModule.suiteReport) || globalSuiteReport;
    }
  }
}

let focused = false; // indicates that the "only" filter was used

export function module (name, options, scope) {
  const ignored = focused && !isParentModuleInQueue();

  processModule(name, options, scope, { ignored });
}

module.only = function (...args) {
  if (!focused) {
    // Upon the first module.only() call,
    // delete any and all previously registered modules and tests.
    config.modules.length = 0;
    config.queue.length = 0;
    clearSuiteReports(config.currentModule);

    // Ignore any tests declared after this block within the same
    // module parent. https://github.com/qunitjs/qunit/issues/1645
    config.currentModule.ignored = true;
  }

  focused = true;
  processModule(...args);
};

module.skip = function (name, options, scope) {
  if (focused) {
    return;
  }

  processModule(name, options, scope, { skip: true });
};

module.if = function (name, condition, options, scope) {
  if (focused) {
    return;
  }

  processModule(name, options, scope, { skip: !condition });
};

module.todo = function (name, options, scope) {
  if (focused) {
    return;
  }

  processModule(name, options, scope, { todo: true });
};
