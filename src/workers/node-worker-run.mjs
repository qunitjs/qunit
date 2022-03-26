import { parentPort } from 'worker_threads';
import workerRun from './worker-run.mjs';
import QUnitRun from '../cli/run.js';

workerRun({
  handleInitData(initData) {
    return QUnitRun(initData.imports, {
      requires: [],
      noReporter: true
    });
  },
  globalPort: parentPort
});

