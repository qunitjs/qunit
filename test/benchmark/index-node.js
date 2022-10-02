/* eslint-env node */

global.QUnit = require('qunit');

if (process.argv[2] === 'fast-deep-equal') {
  const fde = require('fast-deep-equal/es6');
  const accept = process.argv[3]
    ? (name) => name.includes(process.argv[3])
    : (name) => !/map|set/i.test(name);
  global.QUnitBenchInject = function (hook, group, suite) {
    if (hook === 'accept') {
      return accept(group.name);
    }
    if (hook === 'test') {
      group.pairs.forEach((pair, i) => {
        const res = fde(pair.a, pair.b);
        if (res !== pair.equal) {
          console.log(pair);
          throw new Error(`Unexpected fast-deep-equal return in "${group.name}" at pairs[${i}]\n  Expected: ${pair.equal}\n  Actual: ${res}`);
        }
      });
    }
    if (hook === 'add') {
      suite.add(`fast-deep-equal (${group.name})`, function () {
        for (const pair of group.pairs) {
          fde(pair.a, pair.b);
        }
      });
    }
  };
}

require('./fixture-equiv.js');
require('./bench.js');
