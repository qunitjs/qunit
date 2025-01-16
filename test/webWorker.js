/* eslint-env browser */
QUnit.module('Web Worker');

QUnit.test('main tests', function (assert) {
  assert.timeout(10000);
  var done = assert.async();
  // eslint-disable-next-line compat/compat -- Test skipped in IE9
  var worker = new Worker('webWorker-worker.js');

  worker.onmessage = function (event) {
    assert.equal(event.data.status, 'passed', 'runEnd.status');
    done();
  };
});
