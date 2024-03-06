const fs = require('fs');
const { keyword } = require('./npm-search.js');

(async function main () {
  let plugins = await keyword('qunit-plugin');
  plugins = plugins.map((plugin) => ({
    name: plugin.name,
    description: plugin.description,
    date: plugin.date
  })).sort((a, b) => a.name < b.name ? -1 : 1);
  fs.writeFileSync('./docs/_data/plugins.json', JSON.stringify(plugins, null, 2) + '\n');
  console.log('Done!');
}());
