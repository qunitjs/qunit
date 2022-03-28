/* eslint-env browser */
QUnit.module('Web Worker');

// Support: IE 9
/* eslint-disable compat/compat */
var testMethod = window.Worker ? 'test' : 'skip';

QUnit[testMethod]('main tests', function (assert) {
  assert.expect(1);
  var done = assert.async();
  var worker = new Worker('webWorker-worker.js');

  worker.onmessage = function (event) {
    assert.equal(event.data.status, 'passed', 'runEnd.status');
    done();
  };
});
