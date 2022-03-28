QUnit.module('modules with async hooks', hooks => {
  hooks.before(async assert => { assert.step('before'); });
  hooks.beforeEach(async assert => { assert.step('beforeEach'); });
  hooks.afterEach(async assert => { assert.step('afterEach'); });

  hooks.after(assert => {
    assert.verifySteps([
      'before',
      'beforeEach',
      'afterEach'
    ]);
  });

  QUnit.test('all hooks', assert => {
    assert.expect(4);
  });
});

QUnit.module('before/beforeEach/afterEach/after', {
  before: async assert => { assert.step('before'); },
  beforeEach: async assert => { assert.step('beforeEach'); },
  afterEach: async assert => { assert.step('afterEach'); },
  after: async assert => {
    assert.verifySteps([
      'before',
      'beforeEach',
      'afterEach'
    ]);
  }
});

QUnit.test('async hooks order', assert => {
  assert.expect(4);
});
