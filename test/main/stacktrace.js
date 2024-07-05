// Skip in environments without Error#stack support
(QUnit.stack() ? QUnit.module : QUnit.module.skip)('stacktrace', function () {
  function fooCurrent () {
    return QUnit.stack();
  }
  function fooParent () {
    return fooCurrent();
  }
  function fooMain () {
    return fooParent();
  }

  function barInternal () {
    return QUnit.stack(2);
  }
  function barPublic () {
    return barInternal();
  }
  function quuxCaller () {
    return barPublic();
  }

  function norm (str) {
    // Windows path
    return str.replace(/\\/g, '/');
  }

  function shorten (str) {
    return norm(str)
      // Remove browser-specific formatting and line numbers
      .replace(/^.*((?:foo|bar|quux)[A-z]+).*$/gm, '$1')
      // Remove anything below our entry point
      .replace(/(fooMain|quuxCaller)[\s\S\n]*/, '$1');
  }

  QUnit.test('QUnit.stack()', function (assert) {
    var simple = norm(QUnit.stack());
    assert.pushResult({
      result: simple.indexOf('/main/stacktrace.js') !== -1,
      actual: simple,
      message: 'include current file'
    });
    assert.pushResult({
      result: simple.indexOf('qunit.js') === -1,
      actual: simple,
      expected: 'NOT qunit.js',
      message: 'stacktrace cleaning stops before qunit.js'
    });

    var fooStack = shorten(fooMain()).split('\n');
    assert.deepEqual(fooStack, [
      'fooCurrent',
      'fooParent',
      'fooMain'
    ]);
  });

  QUnit.test('QUnit.stack(offset)', function (assert) {
    var barStack = shorten(quuxCaller()).split('\n');

    assert.deepEqual(barStack, ['quuxCaller']);
  });

  // Some browsers support 'stack' only when caught (see sourceFromStacktrace).
  // We do that for failed assertions, but for passing tests we omit
  // source details in these older browsers.
  var supportsUnthrownStack = !!(new Error().stack);
  (supportsUnthrownStack ? QUnit.module : QUnit.module.skip)('source details', function () {
    QUnit.test('QUnit.test()', function (assert) {
      var stack = norm(QUnit.config.current.stack);
      var line = stack.split('\n')[0];
      assert.pushResult({
        result: line.indexOf('/main/stacktrace.js') !== -1,
        expected: '/main/stacktrace.js',
        actual: stack,
        message: 'start at current file'
      });
    });

    QUnit.test.each('QUnit.test.each(list)', [0], function (assert) {
      var stack = norm(QUnit.config.current.stack);
      var line = stack.split('\n')[0];
      assert.pushResult({
        result: line.indexOf('/main/stacktrace.js') !== -1,
        expected: '/main/stacktrace.js',
        actual: stack,
        message: 'start at current file'
      });
    });

    QUnit.test.each('QUnit.test.each(object)', { a: 0 }, function (assert) {
      var stack = norm(QUnit.config.current.stack);
      var line = stack.split('\n')[0];
      assert.pushResult({
        result: line.indexOf('/main/stacktrace.js') !== -1,
        expected: '/main/stacktrace.js',
        actual: stack,
        message: 'start at current file'
      });
    });
  });
});
