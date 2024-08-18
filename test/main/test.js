QUnit.module('test', function () {
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
    var failure = false;
    var values = [
      // initial value (see unshift below)
      // initial value (see unshift below)
      '<b>ar</b>',
      '<p>bc</p>',
      undefined
    ];
    var originalValue;

    hooks.before(function () {
      originalValue = QUnit.config.fixture;
      values.unshift(originalValue);
      values.unshift(originalValue);

      var customFixtureNode = document.createElement('span');
      customFixtureNode.setAttribute('id', 'qunit-fixture');
      customFixtureNode.setAttribute('data-baz', 'huzzah!');
      values.push(customFixtureNode);
    });

    hooks.beforeEach(function (assert) {
      assert.fixtureEquals = function fixtureEquals (options) {
        var expectedTagName = options.tagName || 'div';
        var expectedAttributes = options.attributes || {};
        var expectedContent = options.content || '';

        var element = document.getElementById('qunit-fixture');

        this.pushResult({
          result: element.tagName === expectedTagName.toUpperCase(),
          actual: element.tagName.toLowerCase(),
          expected: expectedTagName,
          message: 'tagName'
        });

        var actualAttributes = {};

        for (var i = 0, l = element.attributes.length; i < l; i++) {
          actualAttributes[element.attributes[i].name] = element.attributes[i].value;
        }

        this.deepEqual(actualAttributes, expectedAttributes, 'attributes');
        this.strictEqual(element.innerHTML, expectedContent, 'contents');
      };

      assert.hasFailingAssertions = function () {
        for (var i = 0; i < this.test.assertions.length; i++) {
          if (!this.test.assertions[i].result) {
            return true;
          }
        }

        return false;
      };
    });

    // Set QUnit.config.fixture for the next test, propagating failures to recover the sequence
    hooks.afterEach(function (assert) {
      failure = failure || assert.hasFailingAssertions();
      if (failure) {
        assert.true(false, 'prior failure');
        QUnit.config.fixture = originalValue;
      } else {
        QUnit.config.fixture = values.shift();
      }
    });

    QUnit.test('setup', function (assert) {
      assert.equal(values.length, 6, 'proper sequence');

      // setup for next test
      document.getElementById('qunit-fixture').innerHTML = 'foo';
    });

    QUnit.test('automatically reset', function (assert) {
      assert.fixtureEquals({
        tagName: 'div',
        attributes: { id: 'qunit-fixture' },
        content: originalValue.innerHTML
      });
      assert.equal(values.length, 5, 'proper sequence');

      // setup for next test
      document.getElementById('qunit-fixture').setAttribute('data-foo', 'blah');
    });

    QUnit.test('automatically reset after attribute value mutation', function (assert) {
      assert.fixtureEquals({
        tagName: 'div',
        attributes: { id: 'qunit-fixture' },
        content: originalValue.innerHTML
      });
      assert.equal(values.length, 4, 'proper sequence');
    });

    QUnit.test('user-specified string', function (assert) {
      assert.fixtureEquals({
        tagName: 'div',
        attributes: { id: 'qunit-fixture' },
        content: '<b>ar</b>'
      });
      assert.equal(values.length, 3, 'proper sequence');

      // setup for next test
      document.getElementById('qunit-fixture').setAttribute('data-foo', 'blah');
    });

    QUnit.test('user-specified string automatically resets attribute value mutation', function (assert) {
      assert.fixtureEquals({
        tagName: 'div',
        attributes: { id: 'qunit-fixture' },
        content: '<p>bc</p>'
      });
      assert.equal(values.length, 2, 'proper sequence');

      // setup for next test
      document.getElementById('qunit-fixture').innerHTML = 'baz';
    });

    QUnit.test('disabled', function (assert) {
      assert.fixtureEquals({
        tagName: 'div',
        attributes: { id: 'qunit-fixture' },
        content: 'baz'
      });
      assert.equal(values.length, 1, 'proper sequence');
    });

    QUnit.test('user-specified DOM node', function (assert) {
      assert.fixtureEquals({
        tagName: 'span',
        attributes: {
          id: 'qunit-fixture',
          'data-baz': 'huzzah!'
        },
        content: ''
      });
      assert.equal(values.length, 0, 'proper sequence');
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

  QUnit.test('assert.pushResult()', function (assert) {
    var detail;
    QUnit.log(function (data) {
      detail = data;
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

  QUnit.test('assert.push()', function (assert) {
    var detail;
    QUnit.log(function (data) {
      detail = data;
    });

    assert.testForPush(10, 20, 'hello');

    assert.propContains(detail, {
      result: true,
      actual: 10,
      expected: 20,
      message: 'hello',
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
