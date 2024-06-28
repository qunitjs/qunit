import * as game from './game.js';

QUnit.module('game', (hooks) => {
  let board;

  hooks.beforeEach(() => {
    board = new game.Board(3, 3);
  });

  QUnit.module('Coord', () => {
    QUnit.test('constructor', (assert) => {
      const pos1 = new game.Coord();
      assert.propContains(pos1, { x: 0, y: 0 }, 'defaults');

      const pos2 = new game.Coord(5, 7);
      assert.propContains(pos2, { x: 5, y: 7 }, 'parameters');
    });
  });

  QUnit.module('Board', () => {
    QUnit.test('add', (assert) => {
      const alice = new game.Robot();
      board.add(alice);
      assert.propContains(board.find(alice), { x: 0, y: 0 }, 'add alice');

      const bob = new game.Robot();
      board.add(bob);
      assert.propContains(board.find(bob), { x: 0, y: 0 }, 'add bob');

      assert.throws(() => {
        board.add(bob);
      }, game.BoardObjectError, 'add second bob');
    });

    QUnit.test('find [absent]', (assert) => {
      const bob = new game.Robot();
      assert.false(board.find(bob));
    });

    QUnit.test('move', (assert) => {
      const alice = new game.Robot();
      board.add(alice);

      board.moveRight(alice);
      assert.propContains(board.find(alice), { x: 1, y: 0 }, 'move');

      board.moveRight(alice);
      assert.propContains(board.find(alice), { x: 2, y: 0 }, 'move again');

      board.moveRight(alice);
      assert.propContains(board.find(alice), { x: 0, y: 0 }, 'teleport back');

      const bob = new game.Robot();

      assert.throws(() => {
        board.moveRight(bob);
      }, board.BoardObjectError, 'not on board');
    });
  });
});
