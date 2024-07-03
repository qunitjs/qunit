/* eslint-env browser */
/* eslint-disable new-cap */
// Skip in non-browser environment
(typeof document !== 'undefined' ? QUnit.module : QUnit.module.skip)('HtmlReporter');

QUnit.test('appendFilteredTest() [testId]', function (assert) {
  var MockQUnit = {
    on: function (event, fn) {
      this.on[event] = fn;
    },
    emit: function (event, data) {
      this.on[event](data);
    },
    begin: function (fn) {
      this.on.begin = fn;
    },
    testStart: function (fn) {
      this.on.testStart = fn;
    },
    log: function (fn) {
      this.on.log = fn;
    },
    testDone: function (fn) {
      this.on.testDone = fn;
    }
  };
  var element = document.createElement('div');
  // eslint-disable-next-line no-unused-vars
  var rep = new QUnit.reporters.html(MockQUnit, {
    element: element,
    config: {
      urlConfig: [],
      testId: ['1aaa', '2bbb']
    }
  });

  MockQUnit.emit('runStart', { testCounts: {} });
  MockQUnit.emit('begin', { modules: [] });

  var filteredTest = element.querySelector('#qunit-filteredTest');
  assert.equal(
    filteredTest && filteredTest.textContent,
    'Rerunning selected tests: 1aaa, 2bbb Run all tests',
    'header indicates filtered tests, and link to clear filter'
  );
});
