'use strict';

const fs = require('fs');
const path = require('path');

const q3000 = require('../test/benchmark/q4000.json');

{
  const file = 'demos/q4000-qunit.js';

  // Deal with indentation etc later via eslint --fix (or `npm run lint-fix`).
  const formatTest = (name) => `QUnit.test(${JSON.stringify(name)}, function (assert) {
    assert.true(true);
    assert.true(true);
  });`;
  const formatMembers = (members) => {
    return members.map(member => {
      if (typeof member === 'string') {
        return formatTest(member);
      } else {
        const tests = formatMembers(member.members);
        return `QUnit.module(${JSON.stringify(member.name)}, function () {
          ${tests}
        });`;
      }
    }).join('\n\n');
  };
  fs.writeFileSync(path.join(__dirname, '..', file), formatMembers(q3000));
  console.log('Written to ' + file);
}
