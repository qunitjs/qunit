var caught = [];

QUnit.on('error', function (e) {
  caught.push(e.message);
});

QUnit.begin(function () {
  return Promise.reject(new Error('begin'));
});

QUnit.moduleStart(function () {
  return Promise.reject(new Error('moduleStart'));
});

QUnit.testStart(function () {
  return Promise.reject(new Error('testStart'));
});

QUnit.done(function () {
  setTimeout(function () {
    console.log('Caught errors from ' + caught.join(', '));
  }, 100);
});

QUnit.done(function () {
  return Promise.reject(new Error('done'));
});

QUnit.test('one', function (assert) {
  assert.ok(true);
});

QUnit.module('example', function () {
  QUnit.test('two', function (assert) {
    assert.ok(true);
  });
});
