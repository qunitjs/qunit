/**
 * game.js - An example project to demonstrate QUnit.
 *
 * @author Timo Tijhof, 2022
 * @license 0BSD
 * @license Public domain
 */

export class Robot {}

export class BoardObjectError extends Error {}
export class BoardMoveError extends Error {}

export class Coord {
  constructor (x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  clone () {
    return new Coord(this.x, this.y);
  }
}

export class Board {
  constructor (width, height) {
    this.xMax = width - 1;
    this.yMax = height - 1;
    this.objects = new Map();
  }

  add (object) {
    if (this.objects.has(object)) {
      throw new BoardObjectError('Object already on board');
    }
    this.objects.set(object, new Coord());
  }

  find (object) {
    const pos = this.objects.get(object);
    return pos ? pos.clone() : false;
  }

  moveUp (object) {
    const pos = this.objects.get(object);
    if (!pos) {
      throw new BoardObjectError('Object not on board');
    }
    const newPos = pos.clone();
    newPos.y = (newPos.y === 0) ? this.yMax : (newPos.y - 1);
    this.objects.set(object, this.normalizeCoord(newPos));
  }

  moveDown (object) {
    const pos = this.objects.get(object);
    if (!pos) {
      throw new BoardObjectError('Object not on board');
    }
    const newPos = pos.clone();
    newPos.y = (newPos.y === this.yMax) ? 0 : (newPos.y + 1);
    this.objects.set(object, newPos);
  }

  moveLeft (object) {
    const pos = this.objects.get(object);
    if (!pos) {
      throw new BoardObjectError('Object not on board');
    }
    const newPos = pos.clone();
    newPos.x = (newPos.x === 0) ? this.xMax : (newPos.x - 1);
    this.objects.set(object, newPos);
  }

  moveRight (object) {
    const pos = this.objects.get(object);
    if (!pos) {
      throw new BoardObjectError('Object not on board');
    }
    const newPos = pos.clone();
    newPos.x = (newPos.x === this.xMax) ? 0 : (newPos.x + 1);
    this.objects.set(object, newPos);
  }
}
