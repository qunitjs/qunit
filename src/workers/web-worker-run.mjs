import workerRun from './worker-run.mjs';

workerRun({
  parentPort: null,
  handleInitData: (initData) => {
    return import('/node_modules/qunit/qunit/qunit.js').then(function() {
      return Promise.all(initData.imports.map((importFile) => Promise.resolve(import(importFile))))
    });
  }
});
