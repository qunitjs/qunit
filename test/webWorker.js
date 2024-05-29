/* eslint-env browser */
QUnit.module('Web Worker');

QUnit.test('main tests', function (assert) {
  assert.expect(1);
  var done = assert.async();
  var worker = new Worker('webWorker-worker.js');

  worker.onmessage = function (event) {
    assert.equal(event.data.status, 'passed', 'runEnd.status');
    done();
  };
});
