/* global require, globalThis, QUnitFixtureEquiv, QUnitBenchInject, QUnit, console */

const Benchmark = typeof require === 'function' ? require('benchmark') : globalThis.Benchmark;
const suite = new Benchmark.Suite();
const inject = typeof QUnitBenchInject === 'function' ? QUnitBenchInject : function () {};
const equiv = QUnit.equiv;

// Check for correctness first, mainly for the return value,
// but also for any unexpected exceptions as Benchmark will tolerate
// uncaught exceptions as being benchmarkable behaviour.
for (const group of QUnitFixtureEquiv) {
  if (inject('accept', group) === false) {
    continue;
  }
  group.pairs.forEach((pair, i) => {
    const res = equiv(pair.a, pair.b);
    if (res !== pair.equal) {
      throw new Error(`Unexpected return value in "${group.name}" at pairs[${i}]\n  Expected: ${pair.equal}\n  Actual: ${res}`);
    }
  });
  inject('test', group);
}

if (inject('accept', { name: '' }) !== false) {
  suite.add('QUnit.equiv', function () {
    for (const group of QUnitFixtureEquiv) {
      for (const pair of group.pairs) {
        equiv(pair.a, pair.b);
      }
    }
  });
}

for (const group of QUnitFixtureEquiv) {
  if (inject('accept', group) === false) {
    continue;
  }
  inject('add', group, suite);
  suite.add(`QUnit.equiv (${group.name})`, function () {
    for (const pair of group.pairs) {
      equiv(pair.a, pair.b);
    }
  });
}

console.log('Running benchmark...');
suite.on('cycle', function (event) {
  console.log(String(event.target));
});
suite.on('complete', function () {
  console.log('Done!');
});
suite.run({ async: true });
