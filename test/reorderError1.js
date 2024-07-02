/* eslint-env browser */
QUnit.module('Test call count - first case');
QUnit.test.if(
  'does not skip tests after reordering',
  !!window.sessionStorage,
  function (assert) {
    assert.equal(window.totalCount, 3);
  }
);
