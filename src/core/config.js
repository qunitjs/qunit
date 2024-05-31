import { globalThis, process, localSessionStorage } from '../globals';
import { extend } from './utilities';

/**
 * Config object: Maintain internal state
 * Later exposed as QUnit.config
 * `config` initialized at top of scope
 */
const config = {
  // HTML Reporter: Modify document.title when suite is done
  altertitle: true,

  autostart: true,

  // HTML Reporter: collapse every test except the first failing test
  // If false, all failing tests will be expanded
  collapse: true,

  // TODO: Make explicit in QUnit 3.
  // current: undefined,

  // whether or not to fail when there are zero tests
  // defaults to `true`
  failOnZeroTests: true,

  // Select by pattern or case-insensitive substring match against "moduleName: testName"
  filter: '',

  // TODO: Make explicit in QUnit 3.
  // fixture: undefined,

  // Depth up-to which object will be dumped
  maxDepth: 5,

  // Select case-insensitive match of the module name
  module: undefined,

  // HTML Reporter: Select module/test by array of internal IDs
  moduleId: undefined,

  // By default, run previously failed tests first
  // very useful in combination with "Hide passed tests" checked
  reorder: true,

  // When enabled, all tests must call expect()
  requireExpects: false,

  // By default, scroll to top of the page when suite is done
  scrolltop: true,

  // TODO: Make explicit in QUnit 3.
  // seed: undefined,

  // The storage module to use for reordering tests
  storage: localSessionStorage,

  testId: undefined,

  // The updateRate controls how often QUnit will yield the main thread
  // between tests. This is mainly for the benefit of the HTML Reporter,
  // so that the browser can visually paint DOM changes with test results.
  // This also helps avoid causing browsers to prompt a warning about
  // long-running scripts.
  updateRate: 1000,

  // HTML Reporter: List of URL parameters that are given visual controls
  urlConfig: [],

  // Internal: The first unnamed module
  //
  // By being defined as the intial value for currentModule, it is the
  // receptacle and implied parent for any global tests. It is as if we
  // called `QUnit.module( "" );` before any other tests were defined.
  //
  // If we reach begin() and no tests were put in it, we dequeue it as if it
  // never existed, and in that case never expose it to the events and
  // callbacks API.
  //
  // When global tests are defined, then this unnamed module will execute
  // as any other module, including moduleStart/moduleDone events etc.
  //
  // Since this module isn't explicitly created by the user, they have no
  // access to add hooks for it. The hooks object is defined to comply
  // with internal expectations of test.js, but they will be empty.
  // To apply hooks, place tests explicitly in a QUnit.module(), and use
  // its hooks accordingly.
  //
  // For global hooks that apply to all tests and all modules, use QUnit.hooks.
  //
  // NOTE: This is *not* a "global module". It is not an ancestor of all modules
  // and tests. It is merely the parent for any tests defined globally,
  // before the first QUnit.module(). As such, the events for this unnamed
  // module will fire as normal, right after its last test, and *not* at
  // the end of the test run.
  //
  // NOTE: This also should probably also not become a global module, unless
  // we keep it out of the public API. For example, it would likely not
  // improve the user interface and plugin behaviour if all modules became
  // wrapped between the start and end events of this module, and thus
  // needlessly add indentation, indirection, or other visible noise.
  // Unit tests for the callbacks API would detect that as a regression.
  currentModule: {
    name: '',
    tests: [],
    childModules: [],
    testsRun: 0,
    testsIgnored: 0,
    hooks: {
      before: [],
      beforeEach: [],
      afterEach: [],
      after: []
    }
  },

  // Internal: Exposed to make resets easier
  // Ref https://github.com/qunitjs/qunit/pull/1598
  globalHooks: {},

  // Internal: ProcessingQueue singleton, created in /src/core.js
  pq: null,

  // Internal: Used for runtime measurement to runEnd event and QUnit.done.
  started: 0,

  // Internal state
  _runStarted: false,
  _deprecated_timeout_shown: false,
  blocking: true,
  callbacks: {},
  modules: [],
  queue: [],
  stats: { all: 0, bad: 0, testCount: 0 }
};

function readFlatPreconfigBoolean (val, dest) {
  if (typeof val === 'boolean' || (typeof val === 'string' && val !== '')) {
    config[dest] = (val === true || val === 'true');
  }
}

function readFlatPreconfigNumber (val, dest) {
  if (typeof val === 'number' || (typeof val === 'string' && /^[0-9]+$/.test(val))) {
    config[dest] = +val;
  }
}

function readFlatPreconfigString (val, dest) {
  if (typeof val === 'string' && val !== '') {
    config[dest] = val;
  }
}

function readFlatPreconfigStringArray (val, dest) {
  if (typeof val === 'string' && val !== '') {
    config[dest] = [val];
  }
}

function readFlatPreconfig (obj) {
  readFlatPreconfigBoolean(obj.qunit_config_altertitle, 'altertitle');
  readFlatPreconfigBoolean(obj.qunit_config_autostart, 'autostart');
  readFlatPreconfigBoolean(obj.qunit_config_collapse, 'collapse');
  readFlatPreconfigBoolean(obj.qunit_config_failonzerotests, 'failOnZeroTests');
  readFlatPreconfigString(obj.qunit_config_filter, 'filter');
  readFlatPreconfigString(obj.qunit_config_fixture, 'fixture');
  readFlatPreconfigBoolean(obj.qunit_config_hidepassed, 'hidepassed');
  readFlatPreconfigNumber(obj.qunit_config_maxdepth, 'maxDepth');
  readFlatPreconfigString(obj.qunit_config_module, 'module');
  readFlatPreconfigStringArray(obj.qunit_config_moduleid, 'moduleId');
  readFlatPreconfigBoolean(obj.qunit_config_noglobals, 'noglobals');
  readFlatPreconfigBoolean(obj.qunit_config_notrycatch, 'notrycatch');
  readFlatPreconfigBoolean(obj.qunit_config_reorder, 'reorder');
  readFlatPreconfigBoolean(obj.qunit_config_requireexpects, 'requireExpects');
  readFlatPreconfigBoolean(obj.qunit_config_scrolltop, 'scrolltop');
  readFlatPreconfigString(obj.qunit_config_seed, 'seed');
  readFlatPreconfigStringArray(obj.qunit_config_testid, 'testId');
  readFlatPreconfigNumber(obj.qunit_config_testtimeout, 'testTimeout');
}

if (process && 'env' in process) {
  readFlatPreconfig(process.env);
}
readFlatPreconfig(globalThis);

// Apply a predefined QUnit.config object
//
// Ignore QUnit.config if it is a QUnit distribution instead of preconfig.
// That means QUnit was loaded twice! (Use the same approach as export.js)
const preConfig = globalThis && globalThis.QUnit && !globalThis.QUnit.version && globalThis.QUnit.config;
if (preConfig) {
  extend(config, preConfig);
}

// Push a loose unnamed module to the modules collection
config.modules.push(config.currentModule);

export default config;
