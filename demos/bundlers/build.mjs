import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import webpack from 'webpack';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const tmpDir = path.join(dirname, 'tmp');

const inputs = [
  `${dirname}/test/import-default.js`,
  `${dirname}/test/import-named.js`,
  `${dirname}/test/import-indirect.js`,
  `${dirname}/test/require-default.cjs`,
  `${dirname}/test/require-indirect.cjs`
];

const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
<title>{{title}}</title>
<link rel="stylesheet" href="../node_modules/qunit/qunit/qunit.css">
{{scriptTag}}
</head>
<body>
<div id="qunit"></div>
</body>
</html>
`;

// Rollup configuration
const rollupOutputs = [
  {
    dir: tmpDir,
    entryFileNames: '[name].[format].mjs',
    format: 'es'
  },
  {
    dir: tmpDir,
    entryFileNames: '[name].[format].js',
    format: 'cjs'
  },
  {
    dir: tmpDir,
    entryFileNames: '[name].[format].js',
    format: 'iife'
  },
  {
    dir: tmpDir,
    entryFileNames: '[name].[format].js',
    format: 'umd',
    // For ".cjs" input files, Rollup assumes there are exports
    // (it doesn't look for module.exports). When combined with the UMD
    // output format, this means Rollup requires a name for UMD's
    // global variable. There are no exports in our input, so this
    // is merely storing an unused and empty object.
    name: 'UNUSED'
  }
];
async function * buildRollup () {
  const plugins = [commonjs(), resolve()];

  for (const input of inputs) {
    const bundle = await rollup({
      input,
      plugins,
      // Ignore "output.name" warning for require-default.iife.js
      onwarn: () => {}
    });

    for (const outputOptions of rollupOutputs) {
      const { output } = await bundle.write(outputOptions);
      const fileName = output[0].fileName;
      yield fileName;
    }
  }
}

// https://webpack.js.org/api/node/#webpack
async function * buildWebpack () {
  for (const input of inputs) {
    const config = {
      entry: input,
      output: {
        filename: path.basename(input).replace(/\.(cjs|js)$/, '.webpack.js'),
        path: tmpDir
      }
    };
    await new Promise((resolve, reject) => {
      webpack(config, (err, stats) => {
        if (err || stats.hasErrors()) {
          reject(err);
          return;
        }
        resolve();
      });
    });
    yield config.output.filename;
  }
}

await (async function main () {
  // Clean up
  fs.rmSync(tmpDir, { force: true, recursive: true });

  const gRollup = buildRollup();
  const gWebpack = buildWebpack();

  for await (const fileName of gRollup) {
    console.log('... built ' + fileName);

    if (fileName.endsWith('.cjs.js')) {
      // Skip the CJS output format when testing in browsers
      // (depends on require+module.exports). These are
      // tested in Node.js by /demos/bundlers.js instead.
      continue;
    }

    const html = htmlTemplate
      .replace('{{title}}', fileName)
      .replace('{{scriptTag}}', (
        fileName.endsWith('.mjs')
          ? `<script src="./${fileName}" type="module"></script>`
          : `<script src="./${fileName}"></script>`
      ));

    fs.writeFileSync(
      `${tmpDir}/test-${fileName.replace(/\.(js|mjs)$/, '')}.html`,
      html
    );
  }
  for await (const fileName of gWebpack) {
    console.log('... built ' + fileName);

    const html = htmlTemplate
      .replace('{{title}}', fileName)
      .replace('{{scriptTag}}', (
          `<script src="./${fileName}"></script>`
      ));

    fs.writeFileSync(
      `${tmpDir}/test-${fileName.replace('.js', '')}.html`,
      html
    );
  }
}());
