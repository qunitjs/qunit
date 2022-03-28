try {
  QUnit.module('module 1', () => {
    QUnit.test('test in module 1', assert => {
      assert.true(true);
    });
  });
} catch (e) {

  // Ignore
}

try {
  QUnit.module('module 2', () => {
    // trigger an error in executeNow
    undefined();

    QUnit.test('test in module  2', assert => {
      assert.true(true);
    });
  });
} catch (e) {

  // Ignore
}

try {
  QUnit.module('module 3', () => {
    QUnit.test('test in module 3', assert => {
      assert.true(true);
    });
  });
} catch (e) {

  // Ignore
}
