// Helper to set the QUnit release version in various places.
//
// See also RELEASE.md.
//
// Inspired by <https://github.com/jquery/jquery-release>.

const fs = require('fs');
const path = require('path');

const Repo = {
  setFiles (version) {
    if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)) {
      throw new Error('Invalid or missing version argument');
    }
    {
      const file = 'bower.json';
      console.log(`Updating ${file}...`);
      const filePath = path.join(__dirname, '..', file);
      const json = fs.readFileSync(filePath, 'utf8');
      const packageIndentation = json.match(/\n([\t\s]+)/)[1];
      const data = JSON.parse(json);

      data.version = version;

      fs.writeFileSync(
        filePath,
        JSON.stringify(data, null, packageIndentation) + '\n'
      );
    }
    {
      const file = 'package.json';
      console.log(`Updating ${file}...`);
      const filePath = path.join(__dirname, '..', file);
      const json = fs.readFileSync(filePath, 'utf8');
      const packageIndentation = json.match(/\n([\t\s]+)/)[1];
      const data = JSON.parse(json);

      data.version = version;
      data.author.url = data.author.url.replace('main', version);

      fs.writeFileSync(
        filePath,
        JSON.stringify(data, null, packageIndentation) + '\n'
      );
    }
  }
};

const version = process.argv[2];

try {
  Repo.setFiles(version);
} catch (e) {
  console.error(e.toString());
  process.exit(1);
}
