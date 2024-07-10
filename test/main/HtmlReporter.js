/* eslint-env browser */
/* eslint-disable new-cap, no-new */
// Skip in non-browser environment
QUnit.module.if('HtmlReporter', typeof document !== 'undefined', {
  beforeEach: function () {
    this.normHTML = function (html) {
      var div = document.createElement('div');
      // For example:
      // * Firefox 45 (Win8.1) normalizes attribute order differently from Firefox 127 (macOS).
      // * IE 11 (Win10) will try to minimise escaping by using single quotes for values
      //   that contain double quotes.
      // * Safari 9.1 will serialize "<i>" tag as escaped entities in attributes, whereas other
      //   browsers specifically normalize in the other direction where "<i>" is a literal inside
      //   quoted attributes where escaping for "<" is redundant.
      div.innerHTML = html;
      return div.innerHTML;
    };
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
  assert.equal(testresult.textContent, 'AbortRunning...\u00A0', 'testresult text');

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
  assert.equal(display.textContent, 'Running test 1 of 4: B', 'display text');

  var testOutput = element.querySelector('#qunit-test-output-00A');
  assert.equal(
    testOutput.textContent,
    'A (1)' + 'Rerun' + '0 ms' + 'okay' + '@ 0 ms',
    'test output: name, count, duration, assert message, and assert runtime offset'
  );
});

QUnit.test.each('testresult-display [runEnd]', {
  '3ms': [3, '0.003 seconds'],
  '98ms': [98, '0.1 seconds'],
  '149ms': [149, '0.1 seconds'],
  '151ms': [151, '0.2 seconds'],
  // Support IE11: Number.toPrecision(0.850) is "0.9" in IE11 instead of "0.8"
  // like modern browsers. Test 849ms instead.
  '849ms': [849, '0.8 seconds'],
  '940ms': [940, '0.9 seconds'],
  '960ms': [960, '1 second'],
  '1010ms': [1010, '1 second'],
  '1090ms': [1090, '1 second'],
  '1590ms': [1590, '2 seconds']
}, function (assert, data) {
  var element = document.createElement('div');
  new QUnit.reporters.html(this.MockQUnit, {
    element: element,
    config: {
      urlConfig: []
    }
  });
  this.MockQUnit._do_mixed_run_half();
  this.MockQUnit.emit('runEnd', {
    testCounts: { total: 5, passed: 4, failed: 0, skipped: 1, todo: 0 },
    status: 'passed',
    runtime: data[0]
  });

  var display = element.querySelector('#qunit-testresult-display');
  assert.equal(
    display.textContent,
    '5 tests completed in ' + data[1] + '.4 passed, 1 skipped, 0 failed, and 0 todo.',
    'display text'
  );
});

QUnit.test('test-output trace', function (assert) {
  var element = document.createElement('div');
  new QUnit.reporters.html(this.MockQUnit, {
    element: element,
    config: {
      urlConfig: []
    }
  });

  this.MockQUnit.emit('runStart', { testCounts: { total: 1 } });
  this.MockQUnit.emit('begin', { modules: [] });
  this.MockQUnit.emit('testStart', { testId: '00A', name: 'A' });
  this.MockQUnit.emit('log', {
    testId: '00A',
    message: 'boo',
    result: false,
    actual: false,
    expected: true,
    source: 'bar@example.js\nfoo@example.js\n@foo.test.js',
    runtime: 1
  });
  this.MockQUnit.emit('testDone', {
    testId: '00A',
    name: 'A',
    source: '@foo.test.js',
    total: 1,
    passed: 1,
    failed: 0,
    runtime: 2
  });
  this.MockQUnit.emit('runEnd', {
    testCounts: { total: 1, passed: 0, failed: 1, skipped: 0, todo: 0 },
    status: 'failed',
    runtime: 2
  });

  var testOutput = element.querySelector('#qunit-test-output-00A');
  assert.strictEqual(
    testOutput.textContent,
    'A (1)' + 'Rerun' + '2 ms' + 'boo' + '@ 1 ms' +
      'Expected: true' +
      'Result: false' +
      'Source: bar@example.js\nfoo@example.js\n@foo.test.js' +
      'Source: @foo.test.js',
    'test output'
  );
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

QUnit.test('urlConfig', function (assert) {
  var element = document.createElement('div');
  new QUnit.reporters.html(this.MockQUnit, {
    element: element,
    config: {
      urlConfig: [
        'xid',
        {
          id: 'xmulti',
          label: 'Multi',
          tooltip: 'Escaped "><i>'
        },
        {
          id: 'xmenu',
          label: 'Menu',
          tooltip: 'My tooltip',
          value: ['a', 'b']
        },
        {
          id: 'xmenulabel',
          label: 'Menu',
          value: { a: 'AA', bbb: 'B' }
        },
        // Create UI for a built-in option
        'altertitle'
      ]
    }
  });
  this.MockQUnit._do_start_empty();

  var node = element.querySelector('.qunit-url-config');
  assert.strictEqual(node.innerHTML, this.normHTML(
    '<label for="qunit-urlconfig-xid" title=""><input id="qunit-urlconfig-xid" name="xid" type="checkbox" title="">xid</label>' +
      '<label for="qunit-urlconfig-xmulti" title="Escaped &quot;><i>"><input id="qunit-urlconfig-xmulti" name="xmulti" type="checkbox" title="Escaped &quot;><i>">Multi</label>' +
      '<label for="qunit-urlconfig-xmenu" title="My tooltip">Menu: <select id="qunit-urlconfig-xmenu" name="xmenu" title="My tooltip"><option></option><option value="a">a</option><option value="b">b</option></select></label>' +
      '<label for="qunit-urlconfig-xmenulabel" title="">Menu: <select id="qunit-urlconfig-xmenulabel" name="xmenulabel" title=""><option></option><option value="a">AA</option><option value="bbb">B</option></select></label>' +
      '<label for="qunit-urlconfig-altertitle" title=""><input id="qunit-urlconfig-altertitle" name="altertitle" type="checkbox" title="">altertitle</label>',
    'qunit-url-config HTML'
  ));
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

QUnit.test('module selector', function (assert) {
  var element = document.createElement('div');
  new QUnit.reporters.html(this.MockQUnit, {
    element: element,
    config: {
      urlConfig: []
    }
  });
  this.MockQUnit._do_start_empty();

  var node = element.querySelector('#qunit-modulefilter-search');
  assert.strictEqual(node.autocomplete, 'off', 'disables autocomplete');
});

QUnit.test('overall escaping', function (assert) {
  var element = document.createElement('div');
  new QUnit.reporters.html(this.MockQUnit, {
    element: element,
    config: {
      urlConfig: [
        {
          id: 'x',
          label: '<script id="oops-urlconfig">window.oops="urlconfig-x-label";</script>',
          tooltip: '<script id="oops-urlconfig">window.oops="urlconfig-x-tip";</script>',
          value: {
            '<script id="oops-urlconfig">window.oops="urlconfig-x-key";</script>': '<script id="oops-urlconfig">window.oops="urlconfig-y-label";</script>'
          }
        },
        {
          id: 'y',
          label: '<script id="oops-urlconfig">window.oops="urlconfig-y-label";</script>',
          tooltip: '<script id="oops-urlconfig">window.oops="urlconfig-y-tip";</script>',
          value: [
            '<script id="oops-urlconfig">window.oops="urlconfig-y-value";</script>'
          ]
        }
      ]
    }
  });

  this.MockQUnit.emit('runStart', { testCounts: { total: 1 } });
  this.MockQUnit.emit('begin', {
    modules: [
      { moduleId: 'FF1', name: "<script id='oops-module'>window.oops='module';</script>" }
    ]
  });
  this.MockQUnit.emit('testStart', {
    testId: '00A',
    module: "<script id='oops-module'>window.oops='module';</script>",
    name: "<script id='oops-test'>window.oops='test';</script>"
  });
  this.MockQUnit.emit('log', {
    testId: '00A',
    message: "<script id='oops-assertion'>window.oops='assertion-pass';</script>",
    result: true,
    runtime: 0
  });
  this.MockQUnit.emit('log', {
    testId: '00A',
    message: "<script id='oops-assertion'>window.oops='assertion-fail';</script>",
    result: false,
    actual: false,
    expected: true,
    runtime: 1
  });
  this.MockQUnit.emit('testDone', {
    testId: '00A',
    module: "<script id='oops-module'>window.oops='module';</script>",
    name: "<script id='oops-test'>window.oops='test';</script>",
    total: 2,
    passed: 1,
    failed: 1,
    runtime: 1
  });
  this.MockQUnit.emit('runEnd', {
    testCounts: { total: 1, passed: 0, failed: 1, skipped: 0, todo: 0 },
    status: 'failed',
    runtime: 2
  });

  var scriptTagsCount = element.querySelectorAll('script').length;
  assert.strictEqual(scriptTagsCount, 0, 'script elements');
  // This regex is imperfect as it will incorrectly match attribute values where
  // "<" doesn't need to be escaped. While we do escape it there for simplicity,
  // accessing innerHTML returns the browser's normalized HTML serialization.
  // As such, only run this to aid debugging if the above selector finds actual tags.
  var scriptTagMatch = scriptTagsCount ? element.innerHTML.match(/.{0,100}<script{0,100}/) : null;
  assert.deepEqual(scriptTagMatch, null, 'escape script tags');

  assert.strictEqual(window.oops, undefined, 'prevent eval');

  var testOutput = element.querySelector('#qunit-test-output-00A');
  assert.strictEqual(
    testOutput.textContent,
    "<script id='oops-module'>window.oops='module';</script>: <script id='oops-test'>window.oops='test';</script> (1, 1, 2)" +
      'Rerun' +
      '1 ms' +
      "<script id='oops-assertion'>window.oops='assertion-pass';</script>@ 0 ms" +
      "<script id='oops-assertion'>window.oops='assertion-fail';</script>@ 1 ms" +
      'Expected: true' +
      'Result: false',
    'formatting of test output'
  );

  var oopsUrlConfig = element.querySelector('#oops-urlconfig') || document.querySelector('#oops-urlconfig');
  var oopsModule = element.querySelector('#oops-module') || document.querySelector('#oops-module');
  var oopsTest = element.querySelector('#oops-test') || document.querySelector('#oops-test');
  var oopsAssertion = element.querySelector('#oops-assertion') || document.querySelector('#oops-assertion');
  assert.strictEqual(oopsUrlConfig, null, 'escape url config');
  assert.strictEqual(oopsModule, null, 'escape module name');
  assert.strictEqual(oopsTest, null, 'escape test name');
  assert.strictEqual(oopsAssertion, null, 'escape assertion message');
});
