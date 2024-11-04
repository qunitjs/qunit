# Benchmarks

## Setup

The default is to benchmark the local development version of QUnit.

* Install QUnit for development and generate the release artefact:
  ```
  qunit$ npm install
  qunit$ npm run build
  ```
* Link benchmark to local artefact.
  ```
  qunit/test/benchmark$ npm install
  ```
  NOTE: To benchmark a previous release of QUnit, you can edit
  `benchmark/package.json` and change `file:../..` to something like `2.19.1`.

## Micro benchmarks

Run all micro benchmarks in Node.js:

```
qunit/test/benchmark$ node micro.js
```

Run a subset of benchmarks in Node.js
```
qunit/test/benchmark$ node micro.js 'arrays'
```

In a browser:
* Start a static web server, e.g. using Python
  ```
  python3 -m http.server 4000
  ```
  or PHP:
  ```
  php -S localhost:4000
  ```
* Open <http://localhost:4000/test/benchmark/micro.html>

  Or, run a subset only via the query string:
  <http://localhost:4000/test/benchmark/micro.html?arrays>
* Check the console output.

Powered by [Benchmark.js](https://benchmarkjs.com/).
