QUnit.config.noglobals = true;

QUnit.test('adds global var', assert => {
  global.dummyGlobal = 'hello';
  assert.true(true);
});
