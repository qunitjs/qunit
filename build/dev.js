const fs = require('fs');
const http = require('http');
const path = require('path');

const rollup = require('rollup');
const kleur = require('kleur');
const watch = require('node-watch');
const { loadConfigFile } = require('rollup/dist/loadConfigFile.js');

const { preprocess } = require('./dist-replace.js');

const server = http.createServer((req, res) => {
  const MIME_MAP = {
    '.txt': 'text/plain; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.html': 'text/html',
    '.xhtml': 'application/xhtml+xml',
    '.js': 'text/javascript; charset=UTF-8',
    '.mjs': 'text/javascript; charset=UTF-8'
  };
  try {
    const requestedPath = path.join(
      process.cwd(),

      // * Strip query parameters via URL.pathname.
      // * Remove ".." via path.normalize before path.join().
      //   Note most browers already resolve ".." before sending the request.
      //   Keep as safeguard to avoid access outside process.cwd().
      path.normalize(new URL(req.url, 'file:').pathname)
    );
    if (fs.existsSync(requestedPath)) {
      res.setHeader('Content-Type', MIME_MAP[path.extname(requestedPath)] || MIME_MAP['.txt']);
      return res.end(fs.readFileSync(requestedPath));
    }
    res.statusCode = 404;
    res.end(`Not found: ${req.url}.`);
  } catch (e) {
    res.statusCode = 500;
    res.end(`Unexpected error: ${e.message}.`);
  }
});

server.listen(4000);

function relativeOutput (output = []) {
  return output.map(o => path.relative(process.cwd(), o)).join(', ');
}

function inputToOutput (input, output) {
  return `${input} -> ${relativeOutput(output)}`;
}

function errorString (err) {
  let str = kleur.bold(
    (err.plugin ? `(plugin ${err.plugin}) ` : '') + err.toString()
  );
  str += '\n' + (err.loc ? `${err.loc.file} ${err.loc.line}:${err.loc.column}` : err.id);
  str += `\n${kleur.grey(err.frame)}`;
  str += `\n${kleur.grey(err.stack)}`;
  return str;
}

async function startRollupWatch () {
  const configFile = path.resolve(process.cwd(), 'rollup.config.js');
  const { options, warnings } = await loadConfigFile(configFile);

  console.log(kleur.grey(`[rollup] We currently have ${warnings.count} warnings`));
  warnings.flush();

  const watcher = rollup.watch(options);

  watcher.on('event', event => {
    const { code, result } = event;
    if (code === 'BUNDLE_START') {
      const { input, output } = event;
      console.log('[rollup] Start', inputToOutput(input, output));
    } else if (code === 'BUNDLE_END') {
      const { duration, input, output } = event;
      console.log('[rollup] End', inputToOutput(input, output), `in ${duration}ms`);
    } else if (code === 'ERROR') {
      console.error(errorString(event.error));
    }
    if (result) {
      result.close();
    }
  });
}

async function startCssWatch () {
  const baseDir = process.cwd();
  const cssInputFile = path.resolve(baseDir, 'src/core/qunit.css');
  const cssOutputFile = path.resolve(baseDir, 'qunit/qunit.css');

  function copyCss () {
    const contents = preprocess(fs.readFileSync(cssInputFile, 'utf8'));
    fs.writeFileSync(cssOutputFile, contents);
    console.log('[css] Copied processed stylesheet to qunit/qunit.css');
  }

  const watcher = watch(cssInputFile, {
    persistent: true,
    delay: 0
  }, (event, fullpath) => {
    console.log(`[css] File ${event}: ${path.relative(baseDir, fullpath)}`);
    copyCss();
  });

  watcher.on('ready', () => {
    copyCss();
  });
}

(async function main () {
  try {
    await startRollupWatch();
    await startCssWatch();
  } catch (err) {
    // Handle generic script error from before watcher starts
    console.error(err);

    // Watcher didn't get created so no reason to keep the process.
    // It doesn't exit automatically because the http server is alive.
    process.exit(1);
  }
}());
