/**
 * This test file verifies the execution order of events emitted
 * by QUnit when there are active module filters and test filters.
 */

// These are "module1", "module3", "module4" and "verify"
QUnit.config.moduleId = ['1cf055b9', '46b9bb3b', 'db9e6dfc', 'c056c5ed'];
QUnit.config.filter = '!SKIPME';
QUnit.config.reorder = false;

var invokedHooks = [];
var done = false;

function callback (name) {
  return function (details) {
    if (done) {
      return;
    }

    invokedHooks.push(name + ': ' + details.name);
  };
}

QUnit.on('suiteStart', callback('suiteStart'));
QUnit.on('testStart', callback('testStart'));
QUnit.on('testEnd', callback('testEnd'));
QUnit.on('suiteEnd', callback('suiteEnd'));

QUnit.on('suiteEnd', function (details) {
  if (!done && details.name === 'module4') {
    done = true;
  }
});

// matches module filter
QUnit.module('module1', function () {
  QUnit.test('test 1.1', function (assert) {
    assert.true(true);
  });
  QUnit.test('test 1.2', function (assert) {
    assert.true(true);
  });
});

// skipped by module filter
QUnit.module('module2', function () {
  QUnit.test('test 2.1', function (assert) {
    assert.true(false);
  });
  QUnit.test('test 2.2', function (assert) {
    assert.true(false);
  });
});

// matches module filter
QUnit.module('module3', function () {
  QUnit.test('test 3.1', function (assert) {
    assert.true(true);
  });

  // skipped by test filter
  QUnit.test('test 3.2 SKIPME', function (assert) {
    assert.true(false);
  });
});

// matches module filter
QUnit.module('module4', function () {
  QUnit.module('module4-inner', function () {
    QUnit.test('test 4.1', function (assert) {
      assert.true(true);
    });

    // skipped by test filter
    QUnit.test('test 4.2 SKIPME', function (assert) {
      assert.true(false);
    });
  });
});

// matches module filter
QUnit.module('verify', function () {
  QUnit.test('events with active filters', function (assert) {
    assert.deepEqual(invokedHooks, [
      'suiteStart: module1',
      'testStart: test 1.1',
      'testEnd: test 1.1',
      'testStart: test 1.2',
      'testEnd: test 1.2',
      'suiteEnd: module1',

      'suiteStart: module3',
      'testStart: test 3.1',
      'testEnd: test 3.1',
      'suiteEnd: module3',

      'suiteStart: module4',
      'suiteStart: module4-inner',
      'testStart: test 4.1',
      'testEnd: test 4.1',
      'suiteEnd: module4-inner',
      'suiteEnd: module4'
    ]);
  });
});
