'use strict';

const fs = require('fs');
const path = require('path');

const q4000 = require('../test/benchmark/q4000.json');

// Deal with indentation etc later via eslint --fix (or `npm run lint-fix`).
const formatTest = (name) => `QUnit.test(${JSON.stringify(name)}, function (assert) {
  assert.true(true);
  assert.true(true);
});`;

function formatMembers (members) {
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
}

{
  const FILE = 'demos/q4000-qunit.js';
  const fullPath = path.join(__dirname, '..', FILE);

  fs.writeFileSync(fullPath, formatMembers(q4000));
  console.log('Written to ' + FILE);
}

{
  const FILE = 'docs/resources/q4000.html';
  const fullPath = path.join(__dirname, '..', FILE);

  const contents = fs.readFileSync(fullPath, 'utf8').replace(
    /<script>[^<]*?<\/script>/,
    `<script>\n${formatMembers(q4000)}\n</script>`
  );

  fs.writeFileSync(fullPath, contents);

  console.log('Written to ' + FILE);
}
