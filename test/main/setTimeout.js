(function () {
  // eslint-disable-next-line no-undef
  var global = typeof globalThis !== 'undefined' ? globalThis : window;
  QUnit.module('Support for mocked setTimeout', {
    beforeEach: function () {
      this.setTimeout = global.setTimeout;
      global.setTimeout = function () {};
    },

    afterEach: function () {
      global.setTimeout = this.setTimeout;
    }
  });

  QUnit.test('test one', function (assert) {
    assert.true(true);
  });

  QUnit.test('test two', function (assert) {
    assert.true(true);
  });
}());
