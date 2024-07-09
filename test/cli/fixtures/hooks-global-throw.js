QUnit.hooks.beforeEach(function (assert) {
  if (assert.test.testName === 'global hook throws') {
    throw new Error('banana');
  } else if (assert.test.testName === 'global hook rejects') {
    return Promise.reject(new Error('banana'));
  } else if (assert.test.testName === 'global hook with bad thenable') {
    return {
      then: function () {
        throw new Error('global brocoli');
      }
    };
  }
});

QUnit.hooks.afterEach(function (assert) {
  if (assert.test.testName === 'global hook throws') {
    throw new Error('apple');
  } else if (assert.test.testName === 'global hook rejects') {
    return Promise.reject(new Error('apple'));
  } else if (assert.test.testName === 'global hook with bad thenable') {
    return {
      then: function () {
        throw new Error('global artichoke');
      }
    };
  }
});

QUnit.test('global hook throws', function (assert) {
  assert.true(true);
});

QUnit.test('global hook rejects', function (assert) {
  assert.true(true);
});

// See "bad thenable" in /src/test.js#resolvePromise
QUnit.test('global hook with bad thenable', function (assert) {
  assert.true(true);
});
