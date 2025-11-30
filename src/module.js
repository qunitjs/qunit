import Logger from './logger';
import config from './core/config';
import SuiteReport from './reports/suite';
import { extend, generateHash } from './core/utilities';

const moduleStack = [];

export const runSuite = new SuiteReport();

function isParentModuleInQueue () {
  const modulesInQueue = config.modules
    .filter(module => !module.ignored)
    .map(module => module.moduleId);
  return moduleStack.some(module => modulesInQueue.includes(module.moduleId));
}

function createModule (name, testEnvironment, modifiers) {
  const parentModule = moduleStack.length ? moduleStack.slice(-1)[0] : null;
  const moduleName = parentModule !== null ? [parentModule.name, name].join(' > ') : name;
  const parentSuite = parentModule ? parentModule.suiteReport : runSuite;

  const skip = (parentModule !== null && parentModule.skip) || modifiers.skip;
  const todo = (parentModule !== null && parentModule.todo) || modifiers.todo;

  const env = {};
  if (parentModule) {
    extend(env, parentModule.testEnvironment);
  }
  extend(env, testEnvironment);

  const module = {
    name: moduleName,
    parentModule: parentModule,
    hooks: {
      before: [],
      beforeEach: [],
      afterEach: [],
      after: []
    },
    testEnvironment: env,
    tests: [],
    moduleId: generateHash(moduleName),
    testsRun: 0,
    testsIgnored: 0,
    childModules: [],
    suiteReport: new SuiteReport(name, parentSuite),

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

function setHookFromEnvironment (hooks, environment, name) {
  const potentialHook = environment[name];
  if (typeof potentialHook === 'function') {
    hooks[name].push(potentialHook);
  }
  delete environment[name];
}

function makeSetHook (module, hookName) {
  return function setHook (callback) {
    if (config.currentModule !== module) {
      Logger.warn('The `' + hookName + '` hook was called inside the wrong module (`' +
        config.currentModule.name + '`). ' +
        'Instead, use hooks provided by the callback to the containing module (`' +
        module.name + '`). ' +
        'This will become an error in QUnit 3.0.');
    }
    module.hooks[hookName].push(callback);
  };
}

function processModule (name, options, scope, modifiers = {}) {
  if (typeof options === 'function') {
    scope = options;
    options = undefined;
  }

  const module = createModule(name, options, modifiers);

  // Transfer any initial hooks from the options object to the 'hooks' object
  const testEnvironment = module.testEnvironment;
  const hooks = module.hooks;

  setHookFromEnvironment(hooks, testEnvironment, 'before');
  setHookFromEnvironment(hooks, testEnvironment, 'beforeEach');
  setHookFromEnvironment(hooks, testEnvironment, 'afterEach');
  setHookFromEnvironment(hooks, testEnvironment, 'after');

  const moduleFns = {
    before: makeSetHook(module, 'before'),
    beforeEach: makeSetHook(module, 'beforeEach'),
    afterEach: makeSetHook(module, 'afterEach'),
    after: makeSetHook(module, 'after')
  };

  const prevModule = config.currentModule;
  config.currentModule = module;

  if (typeof scope === 'function') {
    moduleStack.push(module);

    try {
      const cbReturnValue = scope.call(module.testEnvironment, moduleFns);
      if (cbReturnValue && typeof cbReturnValue.then === 'function') {
        Logger.warn('Returning a promise from a module callback is not supported. ' +
          'Instead, use hooks for async behavior. ' +
          'This will become an error in QUnit 3.0.');
      }
    } finally {
      // If the module closure threw an uncaught error during the load phase,
      // we let this bubble up to global error handlers. But, not until after
      // we teardown internal state to ensure correct module nesting.
      // Ref https://github.com/qunitjs/qunit/issues/1478.
      moduleStack.pop();
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

    if (suiteReport === runSuite) {
      suiteReport = null;
    } else {
      childSuite = suiteReport;
      currentModule = currentModule.parentModule;
      suiteReport = (currentModule && currentModule.suiteReport) || runSuite;
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
