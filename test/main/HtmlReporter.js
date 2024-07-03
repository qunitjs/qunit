/* eslint-env browser */
/* eslint-disable new-cap, no-new */
// Skip in non-browser environment
(typeof document !== 'undefined' ? QUnit.module : QUnit.module.skip)('HtmlReporter', {
  beforeEach: function () {
    this.MockQUnit = {
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
      },
      _do_start_empty: function () {
        this.emit('runStart', { testCounts: { total: 0 } });
        this.emit('begin', { modules: [] });
      },
      // The first 1.5 test.
      _do_mixed_run_half: function () {
        this.emit('runStart', { testCounts: { total: 4 } });
        this.emit('begin', { modules: [] });

        this.emit('testStart', { testId: '00A', name: 'A' });
        this.emit('log', {
          testId: '00A',
          result: true,
          runtime: 0
        });
        this.emit('testDone', { testId: '00A', name: 'A', total: 1, passed: 1, failed: 0, runtime: 0 });

        this.emit('testStart', { testId: '00B', name: 'B' });
        this.emit('log', {
          testId: '00B',
          result: true,
          runtime: 1
        });
      },
      _do_mixed_run_full: function () {
        this._do_mixed_run_half();
        this.emit('testDone', { testId: '00B', name: 'B', total: 1, passed: 1, failed: 0, runtime: 1 });

        this.emit('testStart', { testId: '00C', name: 'C' });
        this.emit('log', {
          testId: '00C',
          result: false,
          actual: false,
          expected: true,
          runtime: 1
        });
        this.emit('testDone', { testId: '00C', name: 'C', total: 1, passed: 0, failed: 1, runtime: 1 });

        this.emit('testStart', { testId: '00D', name: 'D' });
        this.emit('log', {
          testId: '00D',
          result: false,
          actual: false,
          expected: true,
          runtime: 0
        });
        this.emit('testDone', { testId: '00D', name: 'D', total: 1, passed: 0, failed: 1, runtime: 0 });

        this.emit('testStart', { testId: '00E', name: 'E' });
        this.emit('testDone', { testId: '00E', name: 'E', total: 0, passed: 0, failed: 0, skipped: true });

        this.emit('runEnd', {
          testCounts: { total: 5, passed: 2, failed: 2, skipped: 1, todo: 0 },
          status: 'failed',
          runtime: 3
        });
      }
    };
  }
});

QUnit.test('testresult-display [begin]', function (assert) {
  var element = document.createElement('div');
  new QUnit.reporters.html(this.MockQUnit, {
    element: element,
    config: {
      urlConfig: []
    }
  });
  this.MockQUnit._do_start_empty();

  var testresult = element.querySelector('#qunit-testresult');
  assert.equal(testresult.className, 'result', 'testresult class');
  assert.equal(testresult.textContent, 'Running...\u00A0Abort', 'testresult text');
  var display = element.querySelector('#qunit-testresult-display');
  assert.equal(display.className, '', 'display class');
  assert.equal(display.textContent, 'Running...\u00A0', 'display text');
});

QUnit.test('testresult-display [testStart]', function (assert) {
  var element = document.createElement('div');
  new QUnit.reporters.html(this.MockQUnit, {
    element: element,
    config: {
      urlConfig: []
    }
  });
  this.MockQUnit._do_mixed_run_half();

  var testresult = element.querySelector('#qunit-testresult');
  assert.equal(testresult.className, 'result', 'testresult class');
  var display = element.querySelector('#qunit-testresult-display');
  assert.equal(display.className, 'running', 'display class');
  assert.equal(display.textContent, '1 / 4 tests completed.Running: B', 'display text');
});

QUnit.test('appendFilteredTest() [testId]', function (assert) {
  var element = document.createElement('div');
  new QUnit.reporters.html(this.MockQUnit, {
    element: element,
    config: {
      urlConfig: [],
      testId: ['1aaa', '2bbb']
    }
  });
  this.MockQUnit._do_start_empty();

  var filteredTest = element.querySelector('#qunit-filteredTest');
  assert.equal(
    filteredTest && filteredTest.textContent,
    'Rerunning selected tests: 1aaa, 2bbb Run all tests',
    'header indicates filtered tests, and link to clear filter'
  );
});

QUnit.test('hidepassed', function (assert) {
  var element = document.createElement('div');
  new QUnit.reporters.html(this.MockQUnit, {
    element: element,
    config: {
      hidepassed: true,
      urlConfig: ['hidepassed']
    }
  });
  this.MockQUnit._do_mixed_run_full();

  // Of the 5 tests, hide 2 passed and 1 skipped, show 2 failed.
  var tests = element.querySelector('#qunit-tests');
  assert.strictEqual(tests && tests.children.length, 2, 'test items');

  // Toolbar
  var node = element.querySelector('#qunit-urlconfig-hidepassed');
  assert.strictEqual(node.nodeName, 'INPUT');
  assert.strictEqual(node.checked, true);
});

QUnit.test('filter', function (assert) {
  var element = document.createElement('div');
  new QUnit.reporters.html(this.MockQUnit, {
    element: element,
    config: {
      urlConfig: [],
      filter: '!/Foo|bar/'
    }
  });
  this.MockQUnit._do_start_empty();

  // Toolbar
  var node = element.querySelector('#qunit-filter-input');
  assert.strictEqual(node.nodeName, 'INPUT');
  assert.strictEqual(node.value, '!/Foo|bar/');
});
