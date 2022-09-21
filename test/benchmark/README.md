# Benchmark for QUnit internals

## Usage

The default is to benchmark the local development version of QUnit.

1. Install QUnit for development and generate the release artefact:
   * `qunit$ npm ci`
   * `qunit$ npm run build`
2. Link benchmark to local artefact.
   NOTE: Alternatively, you can edit benchmark/package.json
   and change `file:../..` to something like `2.19.1` to
   benchmark older versions of QUnit.
   * `qunit/test/benchmark$ npm install`
3. Run the benchmark
   * In Node.js:
     `qunit/test/benchmark$ node index-node.js`
   * In a browser:
     * Start a static web server, e.g. using Python
       `qunit$ python3 -m http.server 4000`
       or PHP:
       `php -S localhost:4000`
     * Open <http://localhost:4000/test/benchmark/index-browser.html>
     * Check the console output.

Powered by [Benchmark.js](https://benchmarkjs.com/).
