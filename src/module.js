import config from './core/config.js';
import SuiteReport from './reports/suite.js';
import { extend, generateHash, isAsyncFunction } from './core/utilities.js';

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

  let env = {};
  if (parentModule) {
    env = Object.create(parentModule.testEnvironment || {});
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
        throw new TypeError('QUnit.module() callback must not be async. For async module setup, use hooks. https://qunitjs.com/api/QUnit/module/#hooks');
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

let focused = false; // indicates that the "only" filter was used

export function module (name, options, scope) {
  const ignored = focused && !isParentModuleInQueue();

  processModule(name, options, scope, { ignored });
}

module.only = function (...args) {
  if (!focused) {
    // Upon the first module.only() call,
    // delete any and all previously registered modules and tests.
    //
    // TODO: This does not clear SuiteReport, which means the empty modules are
    // left behind and wrongly reported as "skipped" (skipped == total), and
    // deleted tests wrongly count toward runEnd.testCounts as passing test
    // (this.getFailedAssertions().length === 0).
    // This is why /test/cli/fixtures/only-test-only-module-mix.tap.txt reports
    // 1..3 instead of 1..1.
    config.modules.length = 0;
    config.queue.length = 0;

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

module.todo = function (name, options, scope) {
  if (focused) {
    return;
  }

  processModule(name, options, scope, { todo: true });
};
