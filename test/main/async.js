/* global setTimeout */
QUnit.module('assert.async', function () {
  QUnit.test('single call synchronously', function (assert) {
    var done;

    assert.expect(1);
    done = assert.async();

    assert.true(true);
    done();
  });

  QUnit.test('single call', function (assert) {
    var done = assert.async();

    assert.expect(1);
    setTimeout(function () {
      assert.true(true);
      done();
    });
  });

  QUnit.test('multiple calls', function (assert) {
    var done = assert.async(4);

    assert.expect(4);
    setTimeout(function () {
      assert.true(true);
      done();
    });
    setTimeout(function () {
      assert.true(true);
      done();
    });
    setTimeout(function () {
      assert.true(true);
      done();
    });
    setTimeout(function () {
      assert.true(true);
      done();
    });
  });

  QUnit.test('parallel calls', function (assert) {
    var done1 = assert.async();
    var done2 = assert.async();

    assert.expect(2);
    setTimeout(function () {
      assert.true(true);
      done1();
    });
    setTimeout(function () {
      assert.true(true);
      done2();
    });
  });

  QUnit.test('parallel calls of differing speeds', function (assert) {
    var done1 = assert.async();
    var done2 = assert.async();

    assert.expect(2);
    setTimeout(function () {
      assert.true(true);
      done1();
    });
    setTimeout(function () {
      assert.true(true);
      done2();
    }, 100);
  });

  QUnit.test('waterfall calls', function (assert) {
    var done2;
    var done1 = assert.async();

    assert.expect(2);
    setTimeout(function () {
      assert.true(true, 'first');
      done1();
      done2 = assert.async();
      setTimeout(function () {
        assert.true(true, 'second');
        done2();
      });
    });
  });

  QUnit.test('waterfall calls of differing speeds', function (assert) {
    var done2;
    var done1 = assert.async();

    assert.expect(2);
    setTimeout(function () {
      assert.true(true, 'first');
      done1();
      done2 = assert.async();
      setTimeout(function () {
        assert.true(true, 'second');
        done2();
      }, 100);
    });
  });

  QUnit.test('fails if called more than once', function (assert) {
    // Having an outer async flow in this test avoids the need to manually modify QUnit internals
    // in order to avoid post-`done` assertions causing additional failures
    var done = assert.async();

    assert.expect(1);

    var overDone = assert.async();
    overDone();

    assert.throws(function () {
      overDone();
    }, /Tried to release async pause that was already released/);

    done();
  });

  QUnit.test('fails if called more than specified count', function (assert) {
    // Having an outer async flow in this test avoids the need to manually modify QUnit internals
    // in order to avoid post-`done` assertions causing additional failures
    var done = assert.async();

    assert.expect(1);

    var overDone = assert.async(3);
    overDone();
    overDone();
    overDone();

    assert.throws(function () {
      overDone();
    }, /Tried to release async pause that was already released/);

    done();
  });

  (function () {
    var previousTestDone;

    QUnit.test('errors if called after test finishes - part 1', function (assert) {
      assert.expect(0);
      previousTestDone = assert.async();
      previousTestDone();
    });

    QUnit.test('errors if called after test finishes - part 2', function (assert) {
      assert.throws(
        previousTestDone,
        /Unexpected release of async pause during a different test.\n> Test: errors if called after test finishes - part 1/
      );
    });
  }());

  QUnit.module('overcalled in before hook', {
    before: function (assert) {
      // Having an outer async flow in this test avoids the need to manually modify QUnit
      // internals in order to avoid post-`done` assertions causing additional failures
      var done = assert.async();

      var overDone = assert.async();
      overDone();

      assert.throws(function () {
        overDone();
      }, /Tried to release async pause that was already released/);

      done();
    }
  }, function () {
    QUnit.test('test', function () {});
  });

  QUnit.module('overcalled in beforeEach hook', {
    beforeEach: function (assert) {
      // Having an outer async flow in this test avoids the need to manually modify QUnit
      // internals in order to avoid post-`done` assertions causing additional failures
      var done = assert.async();

      var overDone = assert.async();
      overDone();

      assert.throws(function () {
        overDone();
      }, /Tried to release async pause that was already released/);

      done();
    }
  }, function () {
    QUnit.test('test', function () {});
  });

  QUnit.module('overcalled in afterEach hook', {
    afterEach: function (assert) {
      // Having an outer async flow in this test avoids the need to manually modify QUnit
      // internals in order to avoid post-`done` assertions causing additional failures
      var done = assert.async();

      var overDone = assert.async();
      overDone();

      assert.throws(function () {
        overDone();
      }, /Tried to release async pause that was already released/);

      done();
    }
  }, function () {
    QUnit.test('test', function () {});
  });

  QUnit.module('overcalled in after hook', {
    after: function (assert) {
      // Having an outer async flow in this test avoids the need to manually modify QUnit
      // internals in order to avoid post-`done` assertions causing additional failures
      var done = assert.async();

      var overDone = assert.async();
      overDone();

      assert.throws(function () {
        overDone();
      }, /Tried to release async pause that was already released/);

      done();
    }
  }, function () {
    QUnit.test('test', function () {});
  });

  QUnit.module('in before hook', {
    before: function (assert) {
      var done = assert.async();
      var testContext = this;
      setTimeout(function () {
        testContext.state = 'before';
        done();
      });
    }
  }, function () {
    QUnit.test('call order', function (assert) {
      assert.equal(this.state, 'before', 'called before test callback');
    });
  });

  QUnit.module('in beforeEach hook', {
    beforeEach: function (assert) {
      var done = assert.async();
      var testContext = this;
      setTimeout(function () {
        testContext.state = 'beforeEach';
        done();
      });
    }
  }, function () {
    QUnit.test('call order', function (assert) {
      assert.equal(this.state, 'beforeEach', 'called before test callback');
    });
  });

  QUnit.module('in afterEach hook', {
    afterEach: function (assert) {
      assert.equal(this.state, 'done', 'called after test callback');
      assert.true(true, 'called before expected assert count is validated');
    }
  }, function () {
    QUnit.test('call order', function (assert) {
      assert.expect(2);
      var done = assert.async();
      var testContext = this;
      setTimeout(function () {
        testContext.state = 'done';
        done();
      });
    });
  });

  QUnit.module('in after hook', {
    after: function (assert) {
      assert.equal(this.state, 'done', 'called after test callback');
      assert.true(true, 'called before expected assert count is validated');
    }
  }, function () {
    QUnit.test('call order', function (assert) {
      assert.expect(2);
      var done = assert.async();
      var testContext = this;
      setTimeout(function () {
        testContext.state = 'done';
        done();
      });
    });
  });

  QUnit.module('assertions after final assert.async callback', {
    before: function (assert) {
      assert.async()();
      assert.true(true, 'before');
    },

    beforeEach: function (assert) {
      assert.async()();
      assert.true(true, 'beforeEach');
    },

    afterEach: function (assert) {
      assert.async()();
      assert.true(true, 'afterEach');
    },

    after: function (assert) {
      assert.async()();
      assert.true(true, 'after');
    }
  });

  QUnit.test('in any hook still pass', function (assert) {
    assert.expect(5);
    assert.true(true, 'test callback');
  });
});
