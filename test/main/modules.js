/* global setTimeout */
QUnit.module('QUnit.module', function () {
  var hasOwn = Object.prototype.hasOwnProperty;
  function flat (obj) {
    var str = [];
    for (var key in obj) {
      var prefix = !hasOwn.call(obj, key) ? '%' : '';
      str.push(prefix + key + '=' + obj[key]);
    }
    return str.join(' ') || '(empty)';
  }

  var actual = {};
  var expected = {
    'parent with children': [
      // parent > child > one
      // parent > child > two
      'parent-before: (empty)',
      'child-before: beforeP=1',
      'parent-beforeEach: beforeP=1 beforeC=1',
      'child-beforeEach: beforeP=1 beforeC=1 beforeEach=P',
      'child-test: beforeP=1 beforeC=1 beforeEach=PC',
      'child-afterEach: beforeP=1 beforeC=1 beforeEach=PC tester=1',
      'parent-afterEach: beforeP=1 beforeC=1 beforeEach=PC tester=1 afterEach=C',
      'parent-beforeEach: beforeP=1 beforeC=1',
      'child-beforeEach: beforeP=1 beforeC=1 beforeEach=P',
      'child-test: beforeP=1 beforeC=1 beforeEach=PC',
      'child-afterEach: beforeP=1 beforeC=1 beforeEach=PC tester=2',
      'parent-afterEach: beforeP=1 beforeC=1 beforeEach=PC tester=2 afterEach=C',
      'child-after: beforeP=1 beforeC=1 beforeEach=PC tester=2 afterEach=CP',
      'parent-after: beforeP=1 beforeC=1 beforeEach=PC tester=2 afterEach=CP afterC=1'
    ],
    // FIXME: https://github.com/qunitjs/qunit/issues/1328
    // - parent test missing own state if there is a child module before the test.
    // - last test state presists into after()
    'parent with trailing test': [
      // parent > child > one
      // parent > two
      'parent-before: (empty)',
      'child-before: beforeP=1',
      'parent-beforeEach: beforeP=1 beforeC=1',
      'child-beforeEach: beforeP=1 beforeC=1 beforeEach=P',
      'child-test: beforeP=1 beforeC=1 beforeEach=PC',
      'child-afterEach: beforeP=1 beforeC=1 beforeEach=PC tester=1',
      'parent-afterEach: beforeP=1 beforeC=1 beforeEach=PC tester=1 afterEach=C',
      'child-after: beforeP=1 beforeC=1 beforeEach=PC tester=1 afterEach=CP',
      'parent-beforeEach: (empty)',
      'parent-test: beforeEach=P',
      'parent-afterEach: beforeEach=P tester=2',
      'parent-after: beforeEach=P tester=2 afterEach=P'
    ],

    // FIXME: https://github.com/qunitjs/qunit/issues/1328
    // child is missing parent state if there is an initial test before the child module.
    'parent with initial test': [
      // parent > one
      // parent > child > two
      'parent-before: (empty)',
      'parent-beforeEach: beforeP=1',
      'parent-test: beforeP=1 beforeEach=P',
      'parent-afterEach: beforeP=1 beforeEach=P tester=1',
      'child-before: (empty)',
      'parent-beforeEach: beforeC=1',
      'child-beforeEach: beforeC=1 beforeEach=P',
      'child-test: beforeC=1 beforeEach=PC',
      'child-afterEach: beforeC=1 beforeEach=PC tester=2',
      'parent-afterEach: beforeC=1 beforeEach=PC tester=2 afterEach=C',
      'child-after: beforeC=1 beforeEach=PC tester=2 afterEach=CP',
      'parent-after: beforeC=1 beforeEach=PC tester=2 afterEach=CP afterC=1'
    ],

    // Confirm each step waits for the previous before restoring/saving testEnvironment
    // Should be identical to 'parent with initial test'
    'async test': [
      // parent > one
      // parent > child > two
      'parent-before: (empty)',
      'parent-beforeEach: beforeP=1',
      'parent-test: beforeP=1 beforeEach=P',
      'parent-afterEach: beforeP=1 beforeEach=P tester=1',
      'child-before: (empty)',
      'parent-beforeEach: beforeC=1',
      'child-beforeEach: beforeC=1 beforeEach=P',
      'child-test: beforeC=1 beforeEach=PC',
      'child-afterEach: beforeC=1 beforeEach=PC tester=2',
      'parent-afterEach: beforeC=1 beforeEach=PC tester=2 afterEach=C',
      'child-after: beforeC=1 beforeEach=PC tester=2 afterEach=CP',
      'parent-after: beforeC=1 beforeEach=PC tester=2 afterEach=CP afterC=1'
    ],
    'multiple hooks': [

      'parent-before: (empty)',
      'parent-before: beforeP=1',
      'child-before: beforeP=12',
      'child-before: beforeP=12 beforeC=1',
      'parent-beforeEach: beforeP=12 beforeC=12',
      'parent-beforeEach: beforeP=12 beforeC=12 beforeEach=P1',
      'child-beforeEach: beforeP=12 beforeC=12 beforeEach=P1P2',
      'child-beforeEach: beforeP=12 beforeC=12 beforeEach=P1P2C1',
      'child-test: beforeP=12 beforeC=12 beforeEach=P1P2C1C2',
      'child-afterEach: beforeP=12 beforeC=12 beforeEach=P1P2C1C2 tester=2',
      'child-afterEach: beforeP=12 beforeC=12 beforeEach=P1P2C1C2 tester=2 afterEach=C2',
      'parent-afterEach: beforeP=12 beforeC=12 beforeEach=P1P2C1C2 tester=2 afterEach=C2C1',
      'parent-afterEach: beforeP=12 beforeC=12 beforeEach=P1P2C1C2 tester=2 afterEach=C2C1P2',
      'child-after: beforeP=12 beforeC=12 beforeEach=P1P2C1C2 tester=2 afterEach=C2C1P2P1',
      'child-after: beforeP=12 beforeC=12 beforeEach=P1P2C1C2 tester=2 afterEach=C2C1P2P1 afterC=2',
      'parent-after: beforeP=12 beforeC=12 beforeEach=P1P2C1C2 tester=2 afterEach=C2C1P2P1 afterC=21',
      'parent-after: beforeP=12 beforeC=12 beforeEach=P1P2C1C2 tester=2 afterEach=C2C1P2P1 afterC=21 afterP=2'
    ]
  };

  QUnit.module('parent with children', function (hooks) {
    var x = actual['parent with children'] = [];

    hooks.before(function () {
      x.push('parent-before: ' + flat(this));
      this.beforeP = (this.beforeP || '') + '1';
    });
    hooks.beforeEach(function () {
      x.push('parent-beforeEach: ' + flat(this));
      this.beforeEach = (this.beforeEach || '') + 'P';
    });
    hooks.afterEach(function () {
      x.push('parent-afterEach: ' + flat(this));
      this.afterEach = (this.afterEach || '') + 'P';
    });
    hooks.after(function () {
      x.push('parent-after: ' + flat(this));
      this.afterP = (this.afterP || '') + '1';
    });

    QUnit.module('child', function (hooks) {
      hooks.before(function () {
        x.push('child-before: ' + flat(this));
        this.beforeC = (this.beforeC || '') + '1';
      });
      hooks.beforeEach(function () {
        x.push('child-beforeEach: ' + flat(this));
        this.beforeEach = (this.beforeEach || '') + 'C';
      });
      hooks.afterEach(function () {
        x.push('child-afterEach: ' + flat(this));
        this.afterEach = (this.afterEach || '') + 'C';
      });
      hooks.after(function () {
        x.push('child-after: ' + flat(this));
        this.afterC = (this.afterC || '') + '1';
      });

      QUnit.test('one', function (assert) {
        x.push('child-test: ' + flat(this));
        this.tester = '1';
        assert.true(true);
      });
      QUnit.test('two', function (assert) {
        x.push('child-test: ' + flat(this));
        this.tester = '2';
        assert.true(true);
      });
    });
  });

  QUnit.module('parent with trailing test', function (hooks) {
    var x = actual['parent with trailing test'] = [];

    hooks.before(function () {
      x.push('parent-before: ' + flat(this));
      this.beforeP = (this.beforeP || '') + '1';
    });
    hooks.beforeEach(function () {
      x.push('parent-beforeEach: ' + flat(this));
      this.beforeEach = (this.beforeEach || '') + 'P';
    });
    hooks.afterEach(function () {
      x.push('parent-afterEach: ' + flat(this));
      this.afterEach = (this.afterEach || '') + 'P';
    });
    hooks.after(function () {
      x.push('parent-after: ' + flat(this));
      this.afterP = (this.afterP || '') + '1';
    });

    QUnit.module('child', function (hooks) {
      hooks.before(function () {
        x.push('child-before: ' + flat(this));
        this.beforeC = (this.beforeC || '') + '1';
      });
      hooks.beforeEach(function () {
        x.push('child-beforeEach: ' + flat(this));
        this.beforeEach = (this.beforeEach || '') + 'C';
      });
      hooks.afterEach(function () {
        x.push('child-afterEach: ' + flat(this));
        this.afterEach = (this.afterEach || '') + 'C';
      });
      hooks.after(function () {
        x.push('child-after: ' + flat(this));
        this.afterC = (this.afterC || '') + '1';
      });

      QUnit.test('one', function (assert) {
        x.push('child-test: ' + flat(this));
        this.tester = '1';
        assert.true(true);
      });
    });

    QUnit.test('two', function (assert) {
      x.push('parent-test: ' + flat(this));
      this.tester = '2';
      assert.true(true);
    });
  });

  QUnit.module('parent with initial test', function (hooks) {
    var x = actual['parent with initial test'] = [];

    hooks.before(function () {
      x.push('parent-before: ' + flat(this));
      this.beforeP = (this.beforeP || '') + '1';
    });
    hooks.beforeEach(function () {
      x.push('parent-beforeEach: ' + flat(this));
      this.beforeEach = (this.beforeEach || '') + 'P';
    });
    hooks.afterEach(function () {
      x.push('parent-afterEach: ' + flat(this));
      this.afterEach = (this.afterEach || '') + 'P';
    });
    hooks.after(function () {
      x.push('parent-after: ' + flat(this));
      this.afterP = (this.afterP || '') + '1';
    });

    QUnit.test('one', function (assert) {
      x.push('parent-test: ' + flat(this));
      this.tester = '1';
      assert.true(true);
    });

    QUnit.module('child', function (hooks) {
      hooks.before(function () {
        x.push('child-before: ' + flat(this));
        this.beforeC = (this.beforeC || '') + '1';
      });
      hooks.beforeEach(function () {
        x.push('child-beforeEach: ' + flat(this));
        this.beforeEach = (this.beforeEach || '') + 'C';
      });
      hooks.afterEach(function () {
        x.push('child-afterEach: ' + flat(this));
        this.afterEach = (this.afterEach || '') + 'C';
      });
      hooks.after(function () {
        x.push('child-after: ' + flat(this));
        this.afterC = (this.afterC || '') + '1';
      });

      QUnit.test('two', function (assert) {
        x.push('child-test: ' + flat(this));
        this.tester = '2';
        assert.true(true);
      });
    });
  });

  QUnit.module('async test', function (hooks) {
    var x = actual['async test'] = [];

    hooks.before(function (assert) {
      x.push('parent-before: ' + flat(this));
      var done = assert.async();
      setTimeout(function () {
        this.beforeP = (this.beforeP || '') + '1';
        done();
      }.bind(this));
    });
    hooks.beforeEach(function (assert) {
      x.push('parent-beforeEach: ' + flat(this));
      var done = assert.async();
      setTimeout(function () {
        this.beforeEach = (this.beforeEach || '') + 'P';
        done();
      }.bind(this));
    });
    hooks.afterEach(function (assert) {
      x.push('parent-afterEach: ' + flat(this));
      var done = assert.async();
      setTimeout(function () {
        this.afterEach = (this.afterEach || '') + 'P';
        done();
      }.bind(this));
    });
    hooks.after(function (assert) {
      x.push('parent-after: ' + flat(this));
      var done = assert.async();
      setTimeout(function () {
        this.afterP = (this.afterP || '') + '1';
        done();
      }.bind(this));
    });

    QUnit.test('one', function (assert) {
      x.push('parent-test: ' + flat(this));
      var done = assert.async();
      setTimeout(function () {
        this.tester = '1';
        done();
      }.bind(this));
      assert.true(true);
    });

    QUnit.module('child', function (hooks) {
      hooks.before(function (assert) {
        x.push('child-before: ' + flat(this));
        var done = assert.async();
        setTimeout(function () {
          this.beforeC = (this.beforeC || '') + '1';
          done();
        }.bind(this));
      });
      hooks.beforeEach(function (assert) {
        x.push('child-beforeEach: ' + flat(this));
        var done = assert.async();
        setTimeout(function () {
          this.beforeEach = (this.beforeEach || '') + 'C';
          done();
        }.bind(this));
      });
      hooks.afterEach(function (assert) {
        x.push('child-afterEach: ' + flat(this));
        var done = assert.async();
        setTimeout(function () {
          this.afterEach = (this.afterEach || '') + 'C';
          done();
        }.bind(this));
      });
      hooks.after(function (assert) {
        x.push('child-after: ' + flat(this));
        var done = assert.async();
        setTimeout(function () {
          this.afterC = (this.afterC || '') + '1';
          done();
        }.bind(this));
      });

      QUnit.test('two', function (assert) {
        x.push('child-test: ' + flat(this));
        assert.true(true);
        var done = assert.async();
        setTimeout(function () {
          this.tester = '2';
          done();
        }.bind(this));
      });
    });
  });

  QUnit.module('multiple hooks', function (hooks) {
    var x = actual['multiple hooks'] = [];

    hooks.before(function () {
      x.push('parent-before: ' + flat(this));
      this.beforeP = (this.beforeP || '') + '1';
    });
    hooks.before(function () {
      x.push('parent-before: ' + flat(this));
      this.beforeP = (this.beforeP || '') + '2';
    });
    hooks.beforeEach(function () {
      x.push('parent-beforeEach: ' + flat(this));
      this.beforeEach = (this.beforeEach || '') + 'P1';
    });
    hooks.beforeEach(function () {
      x.push('parent-beforeEach: ' + flat(this));
      this.beforeEach = (this.beforeEach || '') + 'P2';
    });
    hooks.afterEach(function () {
      x.push('parent-afterEach: ' + flat(this));
      this.afterEach = (this.afterEach || '') + 'P1';
    });
    hooks.afterEach(function () {
      x.push('parent-afterEach: ' + flat(this));
      this.afterEach = (this.afterEach || '') + 'P2';
    });
    hooks.after(function () {
      x.push('parent-after: ' + flat(this));
      this.afterP = (this.afterP || '') + '1';
    });
    hooks.after(function () {
      x.push('parent-after: ' + flat(this));
      this.afterP = (this.afterP || '') + '2';
    });

    QUnit.module('child', function (hooks) {
      hooks.before(function () {
        x.push('child-before: ' + flat(this));
        this.beforeC = (this.beforeC || '') + '1';
      });
      hooks.before(function () {
        x.push('child-before: ' + flat(this));
        this.beforeC = (this.beforeC || '') + '2';
      });
      hooks.beforeEach(function () {
        x.push('child-beforeEach: ' + flat(this));
        this.beforeEach = (this.beforeEach || '') + 'C1';
      });
      hooks.beforeEach(function () {
        x.push('child-beforeEach: ' + flat(this));
        this.beforeEach = (this.beforeEach || '') + 'C2';
      });
      hooks.afterEach(function () {
        x.push('child-afterEach: ' + flat(this));
        this.afterEach = (this.afterEach || '') + 'C1';
      });
      hooks.afterEach(function () {
        x.push('child-afterEach: ' + flat(this));
        this.afterEach = (this.afterEach || '') + 'C2';
      });
      hooks.after(function () {
        x.push('child-after: ' + flat(this));
        this.afterC = (this.afterC || '') + '1';
      });
      hooks.after(function () {
        x.push('child-after: ' + flat(this));
        this.afterC = (this.afterC || '') + '2';
      });

      QUnit.test('two', function (assert) {
        x.push('child-test: ' + flat(this));
        this.tester = '2';
        assert.true(true);
      });
    });
  });

  QUnit.test.each('verify', Object.keys(expected), function (assert, key) {
    assert.deepEqual(actual[key], expected[key]);
  });

  QUnit.module('module with initial skip', function (hooks) {
    var x = [];
    hooks.before(function () {
      x.push('before');
    });

    QUnit.skip('one');

    QUnit.test('two', function (assert) {
      assert.deepEqual(x, ['before'], 'hooks.before() runs on first unskipped test');
    });
  });

  QUnit.module('module with trailing skip', function (hooks) {
    hooks.after(function (assert) {
      assert.true(true);
    });

    QUnit.test('one', function (assert) {
      assert.expect(0);
      // hooks.after() does not run on first test
    });

    QUnit.test('two', function (assert) {
      assert.expect(1);
      // hooks.after() runs on last unskipped test
    });

    QUnit.skip('three');
  });

  QUnit.module('module with only skips', function (hooks) {
    hooks.before(function (assert) {
      assert.true(false, 'should not occur');
    });
    hooks.after(function (assert) {
      assert.true(false, 'should not occur');
    });

    QUnit.skip('one');
  });

  QUnit.module('set testEnvironment via options', {
    foo: 'foo',
    beforeEach: function (assert) {
      assert.deepEqual(this.foo, 'foo');
      this.foo = 'bar';
    },
    afterEach: function (assert) {
      assert.deepEqual(this.foo, 'foobar');
    }
  });

  QUnit.test('example', function (assert) {
    assert.expect(3);
    assert.deepEqual(this.foo, 'bar');
    this.foo = 'foobar';
  });

  QUnit.module('nested modules with testEnvironment options', { foo: 1 }, function () {
    // scope sees context
    this.foo++;
    QUnit.module('child', { bar: 1 }, function () {
    // child scope inherits parent context
      var foo = this.foo;
      var bar = this.bar;
      QUnit.test('example', function (assert) {
        assert.strictEqual(foo, 2, 'foo');
        assert.strictEqual(bar, 1, 'bar');
      });
    });
  });

  QUnit.module('nested modules', function () {
    QUnit.module('first outer', {
      afterEach: function (assert) {
        assert.true(true, 'first outer module afterEach called');
      },
      beforeEach: function (assert) {
        assert.true(true, 'first outer beforeEach called');
      }
    }, function () {
      QUnit.module('first inner', {
        afterEach: function (assert) {
          assert.true(true, 'first inner module afterEach called');
        },
        beforeEach: function (assert) {
          assert.true(true, 'first inner module beforeEach called');
        }
      }, function () {
        QUnit.test('in module, before-/afterEach called in out-in-out order', function (assert) {
          var module = assert.test.module;
          assert.equal(module.name,
            'QUnit.module > nested modules > first outer > first inner');
          assert.expect(5);
        });
      });

      QUnit.test('test after nested module is processed', function (assert) {
        var module = assert.test.module;
        assert.equal(module.name, 'QUnit.module > nested modules > first outer');
        assert.expect(3);
      });

      QUnit.module('second inner');

      QUnit.test('test after non-nesting module declared', function (assert) {
        var module = assert.test.module;
        assert.equal(module.name, 'QUnit.module > nested modules > first outer > second inner');
        assert.expect(3);
      });
    });

    QUnit.module('second outer');

    QUnit.test('test after all nesting modules processed and new module declared', function (assert) {
      var module = assert.test.module;
      assert.equal(module.name, 'QUnit.module > nested modules > second outer');
    });
  });

  QUnit.test('modules with nested functions does not spread beyond', function (assert) {
    assert.equal(assert.test.module.name, 'QUnit.module');
  });

  QUnit.module('contained suite arguments', function (hooks) {
    QUnit.test('hook functions', function (assert) {
      assert.strictEqual(typeof hooks.beforeEach, 'function');
      assert.strictEqual(typeof hooks.afterEach, 'function');
    });

    QUnit.module('outer hooks', function (hooks) {
      var beforeEach = hooks.beforeEach;
      var afterEach = hooks.afterEach;

      beforeEach(function (assert) {
        assert.true(true, 'beforeEach called');
      });

      afterEach(function (assert) {
        assert.true(true, 'afterEach called');
      });

      QUnit.test('call hooks', function (assert) {
        assert.expect(2);
      });

      QUnit.module('stacked inner hooks', function (hooks) {
        var beforeEach = hooks.beforeEach;
        var afterEach = hooks.afterEach;

        beforeEach(function (assert) {
          assert.true(true, 'nested beforeEach called');
        });

        afterEach(function (assert) {
          assert.true(true, 'nested afterEach called');
        });

        QUnit.test('call hooks', function (assert) {
          assert.expect(4);
        });
      });
    });
  });

  QUnit.module('improper hook creation', function (hooks) {
    QUnit.module('child', function (innerHooks) {
      var outerHookRan = false;
      var innerHookRan = false;
      var beforeEachErrorMessage = null;

      try {
        hooks.beforeEach(function () {
          outerHookRan = true;
        });
      } catch (e) {
        beforeEachErrorMessage = e.message;
      }

      innerHooks.beforeEach(function () {
        innerHookRan = true;
      });

      QUnit.test('create hook on parent module', function (assert) {
        assert.strictEqual(beforeEachErrorMessage,
          'Cannot add beforeEach hook outside the containing module. Called on "QUnit.module > improper hook creation", instead of expected "QUnit.module > improper hook creation > child". https://qunitjs.com/api/QUnit/module/#E0002',
          'beforeEachErrorMessage'
        );
        assert.false(outerHookRan, 'outerHookRan');
        assert.true(innerHookRan, 'innerHookRan');
      });
    });

    QUnit.test('create hook during test', function (assert) {
      assert.throws(function () {
        hooks.beforeEach(function () { });
      }, /Cannot add beforeEach hook outside the containing module/);
    });
  });

  QUnit.module('disallow async module callback', function () {
    var caught;
    try {
      QUnit.module('with thenable callback', function () {
        return { then: function () {} };
      });
    } catch (e) {
      caught = e;
    }

    QUnit.test('thenable callback function errored', function (assert) {
      assert.true(caught instanceof TypeError);
      assert.strictEqual(caught.message, 'QUnit.module() callback must not be async. For async module setup, use hooks. https://qunitjs.com/api/QUnit/module/#hooks');
    });
  });
});
