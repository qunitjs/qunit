QUnit.config.reorder = false;

var totalTests; var moduleContext; var moduleDoneContext; var testContext; var testDoneContext;
var beginModules;
var module1Test1; var module1Test2; var module2Test1; var module2Test2;
var module2Test3; var module2Test4; var module2Test5; var module2Test6;
var begin = 0;
var moduleStart = 0;
var moduleDone = 0;
var testStart = 0;
var testDone = 0;
var log = 0;
var module1begin = {
  name: 'logs1',
  moduleId: '3d2e1e96'
};
var module1Context = {
  name: 'logs1',
  tests: [
    (module1Test1 = {
      name: 'test1',
      testId: '646e9e25',
      skip: false
    }),
    (module1Test2 = {
      name: 'test2',
      testId: '646e9e26',
      skip: false
    })
  ]
};
var module2begin = {
  name: 'logs2',
  moduleId: 'd212d157'
};
var module2Context = {
  name: 'logs2',
  tests: [
    (module2Test1 = {
      name: 'test1',
      testId: '9954d966',
      skip: false
    }),
    (module2Test2 = {
      name: 'test2',
      testId: '9954d967',
      skip: false
    }),
    (module2Test3 = {
      name: 'a skipped test',
      testId: '3e797d3a',
      skip: true
    }),
    (module2Test4 = {
      name: 'test the log for the skipped test',
      testId: 'd3266148',
      skip: false
    }),
    (module2Test5 = {
      name: 'a todo test',
      testId: '77a47174',
      skip: false
    }),
    (module2Test6 = {
      name: 'test the log for the todo test',
      testId: '5f5ab826',
      skip: false
    })
  ]
};

QUnit.begin(function (args) {
  totalTests = args.totalTests;
  beginModules = args.modules;
  begin++;
});

QUnit.moduleStart(function (context) {
  moduleStart++;
  moduleContext = context;
});

QUnit.moduleDone(function (context) {
  moduleDone++;
  moduleDoneContext = context;
});

QUnit.testStart(function (context) {
  testStart++;
  testContext = context;
});

QUnit.testDone(function (context) {
  testDone++;
  testDoneContext = context;
});

QUnit.log(function () {
  log++;
});

QUnit.module(module1Context.name);

QUnit.test(module1Test1.name, function (assert) {
  assert.equal(
    typeof totalTests,
    'number',
    'QUnit.begin should pass total amount of tests to callback'
  );

  while (beginModules.length > 2) {
    beginModules.pop();
  }
  assert.propContains(
    beginModules,
    [module1begin, module2begin],
    'QUnit.begin details registered modules and their respective tests'
  );

  assert.equal(begin, 1, 'QUnit.begin calls');
  assert.equal(moduleStart, 1, 'QUnit.moduleStart calls');
  assert.equal(testStart, 1, 'QUnit.testStart calls');
  assert.equal(testDone, 0, 'QUnit.testDone calls');
  assert.equal(moduleDone, 0, 'QUnit.moduleDone calls');

  assert.strictEqual(testDoneContext, undefined, 'testDone context');
  assert.deepEqual(testContext, {
    module: module1Context.name,
    name: module1Test1.name,
    testId: module1Test1.testId,
    previousFailure: false
  }, 'test context');

  assert.strictEqual(moduleDoneContext, undefined, 'moduleDone context');
  assert.deepEqual(moduleContext, module1Context, 'module context');

  var logContext;
  QUnit.log(function (details) {
    if (details.message === 'example message') {
      logContext = details;
    }
  });
  assert.equal('foo', 'foo', 'example message');

  assert.closeTo(logContext.runtime, 25, 25, 'assertion runtime 0-50ms');
  assert.propContains(logContext, {
    name: module1Test1.name,
    module: module1Context.name,
    result: true,
    message: 'example message',
    actual: 'foo',
    expected: 'foo',
    negative: false,
    testId: module1Test1.testId,
    todo: false
  }, 'log event after equal(actual, expected, message)');

  QUnit.log(function (details) {
    if (details.actual === 'bar') {
      logContext = details;
    }
  });
  assert.equal('bar', 'bar');
  assert.propContains(logContext, {
    name: module1Test1.name,
    module: module1Context.name,
    result: true,
    message: undefined,
    actual: 'bar',
    expected: 'bar',
    negative: false,
    testId: module1Test1.testId,
    todo: false
  }, 'log event after equal(actual, expected)');

  assert.equal(log, 16, 'QUnit.log calls');
});

QUnit.test(module1Test2.name, function (assert) {
  assert.equal(begin, 1, 'QUnit.begin calls');
  assert.equal(moduleStart, 1, 'QUnit.moduleStart calls');
  assert.equal(testStart, 2, 'QUnit.testStart calls');
  assert.equal(testDone, 1, 'QUnit.testDone calls');
  assert.equal(moduleDone, 0, 'QUnit.moduleDone calls');

  assert.closeTo(testDoneContext.runtime, 500, 500, 'test runtime 0-1000ms');
  assert.true(testDoneContext.assertions instanceof Array, 'testDone context: assertions');

  delete testDoneContext.runtime;
  delete testDoneContext.source;
  // TODO: more tests for testDoneContext.assertions
  delete testDoneContext.assertions;
  assert.deepEqual(testDoneContext, {
    module: module1Context.name,
    name: module1Test1.name,
    failed: 0,
    passed: 17,
    total: 17,
    testId: module1Test1.testId,
    skipped: false,
    todo: false
  }, 'testDone context');
  assert.deepEqual(testContext, {
    module: module1Context.name,
    name: module1Test2.name,
    testId: module1Test2.testId,
    previousFailure: false
  }, 'test context');
  assert.strictEqual(moduleDoneContext, undefined, 'moduleDone context');
  assert.deepEqual(moduleContext, module1Context, 'module context');

  assert.equal(log, 28, 'QUnit.log calls');
});

QUnit.module(module2Context.name);

QUnit.test(module2Test1.name, function (assert) {
  assert.equal(begin, 1, 'QUnit.begin calls');
  assert.equal(moduleStart, 2, 'QUnit.moduleStart calls');
  assert.equal(testStart, 3, 'QUnit.testStart calls');
  assert.equal(testDone, 2, 'QUnit.testDone calls');
  assert.equal(moduleDone, 1, 'QUnit.moduleDone calls');

  assert.deepEqual(testContext, {
    module: module2Context.name,
    name: module2Test1.name,
    testId: module2Test1.testId,
    previousFailure: false
  }, 'test context');

  assert.closeTo(moduleDoneContext.runtime, 2500, 2500, 'module runtime 0-5000ms');

  delete moduleDoneContext.runtime;
  assert.deepEqual(moduleDoneContext, {
    name: module1Context.name,
    tests: module1Context.tests,
    failed: 0,
    passed: 29,
    total: 29
  }, 'moduleDone context');
  assert.deepEqual(moduleContext, module2Context, 'module context');

  assert.equal(log, 38, 'QUnit.log calls');
});

QUnit.test(module2Test2.name, function (assert) {
  assert.equal(begin, 1, 'QUnit.begin calls');
  assert.equal(moduleStart, 2, 'QUnit.moduleStart calls');
  assert.equal(testStart, 4, 'QUnit.testStart calls');
  assert.equal(testDone, 3, 'QUnit.testDone calls');
  assert.equal(moduleDone, 1, 'QUnit.moduleDone calls');

  assert.deepEqual(testContext, {
    module: module2Context.name,
    name: module2Test2.name,
    testId: module2Test2.testId,
    previousFailure: false
  }, 'test context');
  assert.deepEqual(moduleContext, module2Context, 'module context');

  assert.equal(log, 46, 'QUnit.log calls');
});

QUnit.skip(module2Test3.name);

QUnit.test(module2Test4.name, function (assert) {
  delete testDoneContext.source;

  assert.deepEqual(testDoneContext, {
    assertions: [],
    module: module2Context.name,
    name: module2Test3.name,
    failed: 0,
    passed: 0,
    total: 0,
    skipped: true,
    todo: false,
    testId: module2Test3.testId,
    runtime: 0
  }, 'testDone context');
});

QUnit.todo(module2Test5.name, function (assert) {
  assert.true(false);
  assert.true(true);
});

QUnit.test(module2Test6.name, function (assert) {
  delete testDoneContext.runtime;
  delete testDoneContext.duration;
  delete testDoneContext.source;
  delete testDoneContext.assertions;

  assert.deepEqual(testDoneContext, {
    module: module2Context.name,
    name: module2Test5.name,
    failed: 1,
    passed: 1,
    total: 2,
    skipped: false,
    todo: true,
    testId: module2Test5.testId
  }, 'testDone context');
});
