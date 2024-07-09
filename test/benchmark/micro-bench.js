/* global globalThis, QUnitFixtureEquiv, QUnit, console, require, process */

const Benchmark = typeof require === 'function' ? require('benchmark') : globalThis.Benchmark;
const suite = new Benchmark.Suite();
const filter = typeof process !== 'undefined' ? process.argv[2] : globalThis.location.search.slice(1);

// Check for correctness first, mainly for the return value,
// but also for any unexpected exceptions as Benchmark will tolerate
// uncaught exceptions as being benchmarkable behaviour.
for (const group of QUnitFixtureEquiv) {
  group.pairs.forEach((pair, i) => {
    const res = QUnit.equiv(pair.a, pair.b);
    if (res !== pair.equal) {
      throw new Error(`Unexpected return value in "${group.name}" at pairs[${i}]\n  Expected: ${pair.equal}\n  Actual: ${res}`);
    }
  });
}

if (!filter) {
  suite.add('QUnit.equiv', function () {
    for (const group of QUnitFixtureEquiv) {
      for (const pair of group.pairs) {
        QUnit.equiv(pair.a, pair.b);
      }
    }
  });
}

for (const group of QUnitFixtureEquiv) {
  if (!filter || group.name.includes(filter)) {
    suite.add(`QUnit.equiv (${group.name})`, function () {
      for (const pair of group.pairs) {
        QUnit.equiv(pair.a, pair.b);
      }
    });
  }
}

console.log('Running benchmark...');
suite.on('cycle', function (event) {
  console.log(String(event.target));
});
suite.on('complete', function () {
  console.log('Done!');
});
suite.run({ async: true });
