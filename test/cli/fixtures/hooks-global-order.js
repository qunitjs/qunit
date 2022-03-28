function callback (label) {
  return function () {
    console.warn(`HOOK: ${QUnit.config.current.testName} @ ${label}`);
  };
}

QUnit.hooks.beforeEach(callback('global beforeEach-1'));
QUnit.hooks.beforeEach(callback('global beforeEach-2'));
QUnit.hooks.afterEach(callback('global afterEach-1'));
QUnit.hooks.afterEach(callback('global afterEach-2'));

QUnit.test('A1', assert => {
  assert.true(true);
});

QUnit.module('B', hooks => {
  hooks.before(callback('B before'));
  hooks.beforeEach(callback('B beforeEach'));
  hooks.afterEach(callback('B afterEach'));
  hooks.after(callback('B after'));

  QUnit.test('B1', assert => {
    assert.true(true);
  });

  QUnit.test('B2', assert => {
    assert.true(true);
  });

  QUnit.module('BC', hooks => {
    hooks.before(callback('BC before'));
    hooks.beforeEach(callback('BC beforeEach'));
    hooks.afterEach(callback('BC afterEach'));
    hooks.after(callback('BC after'));

    QUnit.test('BC1', assert => {
      assert.true(true);
    });

    QUnit.test('BC2', assert => {
      assert.true(true);
    });

    QUnit.module('BCD', hooks => {
      hooks.before(callback('BCD before'));
      hooks.beforeEach(callback('BCD beforeEach'));
      hooks.afterEach(callback('BCD afterEach'));
      hooks.after(callback('BCD after'));

      QUnit.test('BCD1', assert => {
        assert.true(true);
      });
    });
  });
});
