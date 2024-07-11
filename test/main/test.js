QUnit.module('test', function () {
  function normHTML (html) {
    var div = document.createElement('div');
    // Normalize to account for HTML5/XHTML differences, and cross-browser differences
    div.innerHTML = html;
    return div.innerHTML;
  }

  QUnit.test('read and change assert.expect() count', function (assert) {
    assert.expect(2);
    assert.true(true);
    var expected = assert.expect();
    assert.equal(expected, 2);
    assert.expect(expected + 1);
    assert.true(true);
  });

  QUnit.module.if('fixture management', typeof document !== 'undefined', function (hooks) {
    /* global document */
    var originalFixture;
    var originalOuterHTML;
    var customFixtureNode;
    var nextFixtureConfig;
    var fixture;

    hooks.before(function () {
      originalFixture = QUnit.config.fixture;
      originalOuterHTML = originalFixture.outerHTML;

      customFixtureNode = document.createElement('span');
      customFixtureNode.setAttribute('id', 'qunit-fixture');
      customFixtureNode.setAttribute('data-baz', 'huzzah!');
    });

    hooks.beforeEach(function () {
      fixture = document.getElementById('qunit-fixture');
    });

    hooks.afterEach(function () {
      QUnit.config.fixture = nextFixtureConfig;
      nextFixtureConfig = null;
    });

    hooks.after(function () {
      QUnit.config.fixture = originalFixture;
    });

    QUnit.test('default [change children]', function (assert) {
      assert.strictEqual(fixture.outerHTML, originalOuterHTML, 'reset children');

      // setup for for next test
      fixture.innerHTML = 'foo';
      nextFixtureConfig = originalFixture;
    });

    QUnit.test('default [change attributes]', function (assert) {
      assert.strictEqual(fixture.outerHTML, originalOuterHTML, 'reset children');

      // setup for next test
      fixture.setAttribute('data-foo', 'blah');
      nextFixtureConfig = originalFixture;
    });

    QUnit.test('default [reset attributes]', function (assert) {
      assert.equal(fixture.outerHTML, originalOuterHTML, 'reset attributes');

      nextFixtureConfig = '<b>apple</b>';
    });

    QUnit.test('string [set content]', function (assert) {
      assert.equal(fixture.outerHTML, normHTML('<div id="qunit-fixture"><b>apple</b></div>'), 'set content');

      // setup for next test
      fixture.setAttribute('data-foo', 'blah');
      nextFixtureConfig = '<p>banana</p>';
    });

    QUnit.test('string [reset parent attributes]', function (assert) {
      // When fixture specifies HTML string content,
      // we still clean up parent attributes as well.
      assert.equal(fixture.outerHTML, normHTML('<div id="qunit-fixture"><p>banana</p></div>'), 'reset attributes');

      // setup for next test
      fixture.innerHTML = 'baz';
      nextFixtureConfig = undefined;
    });

    QUnit.test('undefined [preserve]', function (assert) {
      assert.equal(fixture.outerHTML, normHTML('<div id="qunit-fixture">baz</div>'), 'unchanged');

      // setup for next test
      nextFixtureConfig = customFixtureNode;
    });

    QUnit.test('Live DOM node', function (assert) {
      assert.equal(fixture.tagName.toUpperCase(), 'SPAN', 'replace tagName');
      assert.equal(fixture.getAttribute('data-baz'), 'huzzah!', 'replace attributes');
    });
  });

  QUnit.module('arguments', function (hooks) {
    var testArgs;
    var todoArgs;
    hooks.after(function (assert) {
      assert.strictEqual(testArgs, 1, 'test() callback args');
      assert.strictEqual(todoArgs, 1, 'test.todo() callback args');
    });

    QUnit.test('test() callback', function (assert) {
      testArgs = arguments.length;
      assert.true(true);
    });
    QUnit.test.todo('test.todo() callback', function (assert) {
      // Captured and asserted later since todo() is expected to fail
      todoArgs = arguments.length;
      assert.true(false);
    });
  });

  QUnit.module('custom assertions');

  QUnit.assert.mod2 = function (value, expected, message) {
    var actual = value % 2;
    this.pushResult({
      result: actual === expected,
      actual: actual,
      expected: expected,
      message: message
    });
  };

  QUnit.assert.testForPush = function (value, expected, message) {
    this.push(true, value, expected, message, false);
  };

  QUnit.test('mod2', function (assert) {
    var detail;
    QUnit.log(function (data) {
      if (data.message === 'three') {
        detail = data;
      }
    });

    assert.mod2(2, 0, 'two');
    assert.mod2(3, 1, 'three');

    assert.propContains(detail, {
      result: true,
      actual: 1,
      expected: 1,
      message: 'three',
      negative: false
    });
  });

  QUnit.module('aliases');

  ['todo', 'skip', 'only'].forEach(function (flavor) {
    QUnit.test('test.' + flavor, function (assert) {
      assert.strictEqual(typeof QUnit.test[flavor], 'function');
      assert.strictEqual(QUnit[flavor], QUnit.test[flavor]);
    });
  });

  QUnit.module('test.skip', {
    beforeEach: function (assert) {
      // Skip test hooks for skipped tests
      assert.true(false, 'skipped function');
      throw 'Error';
    },
    afterEach: function (assert) {
      assert.true(false, 'skipped function');
      throw 'Error';
    }
  });

  QUnit.skip('skip blocks are skipped', function (assert) {
    // This test callback won't run, even with broken code
    assert.expect(1000);
    throw 'Error';
  });

  QUnit.skip('skip without function');

  QUnit.module('missing callbacks');

  QUnit.test('QUnit.test without a callback logs a descriptive error', function (assert) {
    assert.throws(function () {
      // eslint-disable-next-line qunit/no-nested-tests
      QUnit.test('should throw an error');
    }, /You must provide a callback to QUnit.test\("should throw an error"\)/);
  });

  QUnit.test('QUnit.todo without a callback logs a descriptive error', function (assert) {
    assert.throws(function () {
      QUnit.todo('should throw an error');
    }, /You must provide a callback to QUnit.todo\("should throw an error"\)/);
  });

  (function () {
    var previousTestAssert;
    var firstTestName = 'assertions after test finishes throws an error - part 1';

    QUnit.module('bad assertion context');

    QUnit.test(firstTestName, function (assert) {
      assert.expect(0);
      previousTestAssert = assert;
    });

    QUnit.test('assertions after test finishes throws an error - part 2', function (assert) {
      var error = 'Assertion occurred after test finished.\n' +
        '> Test: ' + firstTestName + '\n' +
        '> Message: message here\n';

      assert.throws(function () {
        previousTestAssert.true(true, 'message here');
      }, new Error(error), 'error contains test name and assertion message');
    });
  }());
});
