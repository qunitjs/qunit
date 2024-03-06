const fs = require('fs');

const cdnLinks = [

  // Match qunit-VERSION.js, qunit-VERSION.css, qunit-VERSION.{css.js}
  'qunit-VERSION'
];
const files = {
  'docs/index.md': [
    'vVERSION',
    'blob/VERSION/History.md',
    ...cdnLinks
  ],
  'docs/intro.md': [...cdnLinks],
  'docs/resources/example-add.html': [...cdnLinks],
  'docs/resources/example-index.html': [...cdnLinks]
};

const version = process.argv[2];
if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error('Invalid or missing version argument');
}

for (const [file, patterns] of Object.entries(files)) {
  console.log(`... updating ${file}`);
  for (let pattern of patterns) {
    const replacement = pattern.replace('VERSION', version);
    pattern = pattern.replace('VERSION', '\\d+\\.\\d+\\.\\d+');
    const find = new RegExp(`\\b${pattern}\\b`, 'g');
    const content = fs.readFileSync(file, 'utf8').toString();
    fs.writeFileSync(
      file,
      content.replace(find, replacement),
      'utf8'
    );
  }
}

console.log('Done!');
