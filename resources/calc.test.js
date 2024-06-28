import * as calc from './calc.js';

QUnit.module('calc', () => {
  QUnit.test('add', (assert) => {
    assert.equal(calc.add(1, 2), 3);
    assert.equal(calc.add(2, 3), 5);
    assert.equal(calc.add(5, -1), 4, 'negative');
  });

  QUnit.test('substract', (assert) => {
    assert.equal(calc.substract(3, 2), 1);
    assert.equal(calc.substract(5, 3), 2);
    assert.equal(calc.substract(5, -1), 6, 'negative');
  });

  QUnit.test('multiply', (assert) => {
    assert.equal(calc.multiply(7, 2), 14);
  });

  QUnit.test('square', (assert) => {
    assert.equal(calc.square(5), 25);
    assert.equal(calc.square(7), 49);
    assert.equal(calc.square(-8), 64, 'negative');
  });
});
