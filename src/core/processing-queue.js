import config from './config';
import { extend, generateHash, performance } from './utilities';
import { runLoggingCallbacks } from './logging';

import Promise from '../promise';
import { runSuite } from '../module';
import { emit } from '../events';
import { setTimeout } from '../globals';

/**
 * Creates a seeded "sample" generator which is used for randomizing tests.
 */
function unitSamplerGenerator (seed) {
  // 32-bit xorshift, requires only a nonzero seed
  // https://excamera.com/sphinx/article-xorshift.html
  let sample = parseInt(generateHash(seed), 16) || -1;
  return function () {
    sample ^= sample << 13;
    sample ^= sample >>> 17;
    sample ^= sample << 5;

    // ECMAScript has no unsigned number type
    if (sample < 0) {
      sample += 0x100000000;
    }

    return sample / 0x100000000;
  };
}

class ProcessingQueue {
  /**
   * @param {Function} test Reference to the QUnit.test() method
   */
  constructor (test) {
    this.test = test;
    this.priorityCount = 0;
    this.unitSampler = null;

    // This is a queue of functions that are tasks within a single test.
    // After tests are dequeued from config.queue they are expanded into
    // a set of tasks in this queue.
    this.taskQueue = [];

    this.finished = false;
  }

  /**
   * Advances the taskQueue to the next task. If the taskQueue is empty,
   * process the testQueue
   */
  advance () {
    this.advanceTaskQueue();

    if (!this.taskQueue.length && !config.blocking && !config.current) {
      this.advanceTestQueue();
    }
  }

  /**
   * Advances the taskQueue with an increased depth
   */
  advanceTaskQueue () {
    const start = performance.now();
    config.depth = (config.depth || 0) + 1;

    this.processTaskQueue(start);

    config.depth--;
  }

  /**
   * Process the first task on the taskQueue as a promise.
   * Each task is a function added by Test#queue() in /src/test.js
   */
  processTaskQueue (start) {
    if (this.taskQueue.length && !config.blocking) {
      const elapsedTime = performance.now() - start;

      if (!setTimeout || config.updateRate <= 0 || elapsedTime < config.updateRate) {
        const task = this.taskQueue.shift();
        Promise.resolve(task()).then(() => {
          if (!this.taskQueue.length) {
            this.advance();
          } else {
            this.processTaskQueue(start);
          }
        });
      } else {
        setTimeout(() => {
          this.advance();
        });
      }
    }
  }

  /**
   * Advance the testQueue to the next test to process. Call done() if testQueue completes.
   */
  advanceTestQueue () {
    if (!config.blocking && !config.queue.length && config.depth === 0) {
      this.done();
      return;
    }

    const testTasks = config.queue.shift();
    this.addToTaskQueue(testTasks());

    if (this.priorityCount > 0) {
      this.priorityCount--;
    }

    this.advance();
  }

  /**
   * Enqueue the tasks for a test into the task queue.
   * @param {Array} tasksArray
   */
  addToTaskQueue (tasksArray) {
    this.taskQueue.push(...tasksArray);
  }

  /**
   * Return the number of tasks remaining in the task queue to be processed.
   * @return {number}
   */
  taskCount () {
    return this.taskQueue.length;
  }

  /**
   * Adds a test to the TestQueue for execution.
   * @param {Function} testTasksFunc
   * @param {boolean} prioritize
   */
  add (testTasksFunc, prioritize) {
    if (prioritize) {
      config.queue.splice(this.priorityCount++, 0, testTasksFunc);
    } else if (config.seed) {
      if (!this.unitSampler) {
        this.unitSampler = unitSamplerGenerator(config.seed);
      }

      // Insert into a random position after all prioritized items
      const index = Math.floor(this.unitSampler() * (config.queue.length - this.priorityCount + 1));
      config.queue.splice(this.priorityCount + index, 0, testTasksFunc);
    } else {
      config.queue.push(testTasksFunc);
    }
  }

  /**
   * This function is called when the ProcessingQueue is done processing all
   * items. It handles emitting the final run events.
   */
  done () {
    // We have reached the end of the processing queue and are about to emit the
    // "runEnd" event after which reporters typically stop listening and exit
    // the process. First, check if we need to emit one final test.
    if (config.stats.testCount === 0 && config.failOnZeroTests === true) {
      let error;
      if (config.filter && config.filter.length) {
        error = new Error(`No tests matched the filter "${config.filter}".`);
      } else if (config.module && config.module.length) {
        error = new Error(`No tests matched the module "${config.module}".`);
      } else if (config.moduleId && config.moduleId.length) {
        error = new Error(`No tests matched the moduleId "${config.moduleId}".`);
      } else if (config.testId && config.testId.length) {
        error = new Error(`No tests matched the testId "${config.testId}".`);
      } else {
        error = new Error('No tests were run.');
      }

      this.test('global failure', extend(function (assert) {
        assert.pushResult({
          result: false,
          message: error.message,
          source: error.stack
        });
      }, { validTest: true }));

      // We do need to call `advance()` in order to resume the processing queue.
      // Once this new test is finished processing, we'll reach `done` again, and
      // that time the above condition will evaluate to false.
      this.advance();
      return;
    }

    const storage = config.storage;

    const runtime = Math.round(performance.now() - config.started);
    const passed = config.stats.all - config.stats.bad;

    this.finished = true;

    emit('runEnd', runSuite.end(true));
    runLoggingCallbacks('done', {
      // @deprecated since 2.19.0 Use done() without `details` parameter,
      // or use `QUnit.on('runEnd')` instead. Parameter to be replaced in
      // QUnit 3.0 with test counts.
      passed,
      failed: config.stats.bad,
      total: config.stats.all,
      runtime
    }).then(() => {
      // Clear own storage items if all tests passed
      if (storage && config.stats.bad === 0) {
        for (let i = storage.length - 1; i >= 0; i--) {
          const key = storage.key(i);

          if (key.indexOf('qunit-test-') === 0) {
            storage.removeItem(key);
          }
        }
      }
    });
  }
}

export default ProcessingQueue;
