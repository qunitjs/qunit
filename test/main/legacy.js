(function () {
  QUnit.module('legacy');

  function helper () {
    QUnit.assert.ok(true);
    QUnit.assert.notOk(false);
    QUnit.assert.true(true);
    QUnit.assert.false(false);
    QUnit.assert.equal('x', 'x');
    QUnit.assert.notEqual('x', 'y');
    QUnit.assert.strictEqual('x', 'x');
    QUnit.assert.deepEqual(['x'], ['x']);
    QUnit.assert.propEqual({ x: 1 }, { x: 1 });
    QUnit.assert.propContains({ x: 1, y: 2 }, { x: 1 });
    QUnit.assert.throws(function () {
      throw new Error('boo');
    }, /boo/);
    QUnit.assert.raises(function () {
      throw new Error('boo');
    }, /boo/);
    QUnit.assert.push(true, 1, 1, 'hi');
    QUnit.assert.pushResult({
      result: true,
      actual: 1,
      expected: 1,
      message: 'hello'
    });
  }

  QUnit.test('global QUnit.assert calls', function (assert) {
    assert.expect(14);
    helper();
  });

  QUnit.test('QUnit.test without assert arg', function () {
    QUnit.assert.true(true);
  });
}());
