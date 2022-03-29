// Skip in environments without Error#stack support
(QUnit.stack() ? QUnit.module : QUnit.module.skip)('stacktrace', function () {
  function fooCurrent () {
    return QUnit.stack();
  }
  function fooParent () {
    return fooCurrent();
  }

  function fooInternal () {
    return QUnit.stack(2);
  }
  function fooPublic () {
    return fooInternal();
  }
  function barCaller () {
    return fooPublic();
  }

  function norm (str) {
    // CRLF
    return str.replace(/\\/g, '/');
  }

  QUnit.test('QUnit.stack()', function (assert) {
    var simple = norm(QUnit.stack());
    assert.pushResult({
      result: simple.indexOf('/main/stacktrace.js') !== -1,
      actual: simple,
      message: 'current file'
    });

    var nested = norm(fooParent());
    assert.pushResult({
      result: nested.indexOf('fooCurrent') !== -1,
      actual: nested,
      message: 'include current function'
    });
    assert.pushResult({
      result: nested.indexOf('fooParent') !== -1,
      actual: nested,
      message: 'include parent function'
    });
  });

  QUnit.test('QUnit.stack(offset)', function (assert) {
    var stack = norm(barCaller());
    var line = stack.split('\n')[0];

    assert.pushResult({
      result: line.indexOf('/main/stacktrace.js') !== -1,
      actual: line,
      message: 'current file'
    });
    assert.pushResult({
      result: line.indexOf('barCaller') !== -1,
      actual: line,
      message: 'start at offset'
    });
    assert.pushResult({
      result: stack.indexOf('fooInternal') === -1,
      actual: stack,
      message: 'skip internals'
    });
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
