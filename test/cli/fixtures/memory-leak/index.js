/* globals gc */

const v8 = require('v8');

// Hold explicit references as well so that V8 will consistently
// not be able to GC them until we ask it to. This allows us to
// verify that our heap logic works correctly by asserting both
// presence and absence.
const foos = new Set();
class Foo {
  constructor () {
    this.id = `FooNum${foos.size}`;
    foos.add(this);
  }

  getId () {
    return this.id.slice(0, -1);
  }
}

function streamToString (stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

QUnit.module('some nested module', function (hooks) {
  let foo1, foo2;

  hooks.beforeEach(function () {
    foo1 = new Foo();
  });

  hooks.afterEach(function (assert) {
    foo2 = new Foo();
    assert.equal(foo1.getId(), 'FooNum');
    assert.equal(foo2.getId(), 'FooNum');
  });

  QUnit.test('can call method on foo', function (assert) {
    assert.equal(foo1.getId(), 'FooNum');
  });

  QUnit.module('child module', function (hooks) {
    let foo3;

    hooks.beforeEach(function () {
      foo3 = foo1;
    });

    QUnit.test('child test', function (assert) {
      assert.ok(foo3);
    });
  });
});

QUnit.module('later thing', function () {
  QUnit.test('has released all foos', async function (assert) {
    // The snapshot is expected to contain entries like this:
    // > "FooNum<integer>"
    // It is important that the regex uses \d and that the above
    // comment doesn't include a number, as otherwise we will also
    // get matches for the memory of this function's source code.
    const reHeap = /^.*FooNum\d.*$/gm;

    let snapshot = await streamToString(v8.getHeapSnapshot());
    let matches = snapshot.match(reHeap) || [];
    assert.notEqual(matches.length, 0, 'the before heap');

    snapshot = matches = null;
    assert.notEqual(foos.size, 0, 'foos in Set');

    // Comment out the below to test the failure mode
    foos.clear();

    // Requires `--expose-gc` flag to function properly.
    gc();

    snapshot = await streamToString(v8.getHeapSnapshot());
    matches = snapshot.match(reHeap);
    assert.strictEqual(matches, null, 'the after heap');
  });
});
