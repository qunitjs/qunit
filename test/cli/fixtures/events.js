/**
 * This test file verifies the execution order and contents of events emitted
 * by QUnit after the test run finishes.
 */

function removeUnstableProperties (obj) {
  if (typeof obj === 'object') {
    if ('runtime' in obj) {
      // Stub out non-deterministic property
      obj.runtime = 0;
    }
    delete obj.stack;
    for (let key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach(removeUnstableProperties);
      } else if (typeof obj[key] === 'object') {
        removeUnstableProperties(obj[key]);
      }
    }
  }
  return obj;
}

function callback (name) {
  return function (details) {
    console.warn('EVENT: ' + name);
    removeUnstableProperties(details);
    console.warn(JSON.stringify(details, null, 2));
  };
}

QUnit.on('runStart', callback('runStart'));
QUnit.on('suiteStart', callback('suiteStart'));
QUnit.on('testStart', callback('testStart'));
QUnit.on('assertion', callback('assertion1'));
QUnit.on('assertion', callback('assertion2'));
QUnit.on('testEnd', callback('testEnd'));
QUnit.on('suiteEnd', callback('suiteEnd'));
QUnit.on('runEnd', callback('runEnd'));

QUnit.module('Events', function () {
  QUnit.module('Nested', function () {
    QUnit.todo('test1', function (assert) {
      assert.true(false, 'failing assertion');
    });
  });

  QUnit.test('test2', function (assert) {
    assert.true(true, 'passing assertion');
  });

  QUnit.skip('test3');
});
