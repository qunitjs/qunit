import config from "./config";
import {
	extend,
	generateHash,
	now
} from "./utilities";
import {
	runLoggingCallbacks
} from "./logging";

import Promise from "../promise";
import {
	test
} from "../test";
import {
	globalSuite
} from "../core";
import {
	emit
} from "../events";
import {
	setTimeout
} from "../globals";

let priorityCount = 0;
let unitSampler;

// This is a queue of functions that are tasks within a single test.
// After tests are dequeued from config.queue they are expanded into
// a set of tasks in this queue.
const taskQueue = [];

/**
 * Advances the taskQueue to the next task. If the taskQueue is empty,
 * process the testQueue
 */
function advance() {
	advanceTaskQueue();

	if ( !taskQueue.length && !config.blocking && !config.current ) {
		advanceTestQueue();
	}
}

/**
 * Advances the taskQueue with an increased depth
 */
function advanceTaskQueue() {
	const start = now();
	config.depth = ( config.depth || 0 ) + 1;

	processTaskQueue( start );

	config.depth--;
}

/**
 * Process the first task on the taskQueue as a promise.
 * Each task is a function added by Test#queue() in /src/test.js
 */
function processTaskQueue( start ) {
	if ( taskQueue.length && !config.blocking ) {
		const elapsedTime = now() - start;

		if ( !setTimeout || config.updateRate <= 0 || elapsedTime < config.updateRate ) {
			const task = taskQueue.shift();
			Promise.resolve( task() ).then( function() {
				if ( !taskQueue.length ) {
					advance();
				} else {
					processTaskQueue( start );
				}
			} );
		} else {
			setTimeout( advance );
		}
	}
}

/**
 * Advance the testQueue to the next test to process. Call done() if testQueue completes.
 */
function advanceTestQueue() {
	if ( !config.blocking && !config.queue.length && config.depth === 0 ) {
		done();
		return;
	}

	const testTasks = config.queue.shift();
	addToTaskQueue( testTasks() );

	if ( priorityCount > 0 ) {
		priorityCount--;
	}

	advance();
}

/**
 * Enqueue the tasks for a test into the task queue.
 * @param {Array} tasksArray
 */
function addToTaskQueue( tasksArray ) {
	taskQueue.push( ...tasksArray );
}

/**
 * Return the number of tasks remaining in the task queue to be processed.
 * @return {number}
 */
function taskQueueLength() {
	return taskQueue.length;
}

/**
 * Adds a test to the TestQueue for execution.
 * @param {Function} testTasksFunc
 * @param {boolean} prioritize
 * @param {string} seed
 */
function addToTestQueue( testTasksFunc, prioritize, seed ) {
	if ( prioritize ) {
		config.queue.splice( priorityCount++, 0, testTasksFunc );
	} else if ( seed ) {
		if ( !unitSampler ) {
			unitSampler = unitSamplerGenerator( seed );
		}

		// Insert into a random position after all prioritized items
		const index = Math.floor( unitSampler() * ( config.queue.length - priorityCount + 1 ) );
		config.queue.splice( priorityCount + index, 0, testTasksFunc );
	} else {
		config.queue.push( testTasksFunc );
	}
}

/**
 * Creates a seeded "sample" generator which is used for randomizing tests.
 */
function unitSamplerGenerator( seed ) {

	// 32-bit xorshift, requires only a nonzero seed
	// https://excamera.com/sphinx/article-xorshift.html
	let sample = parseInt( generateHash( seed ), 16 ) || -1;
	return function() {
		sample ^= sample << 13;
		sample ^= sample >>> 17;
		sample ^= sample << 5;

		// ECMAScript has no unsigned number type
		if ( sample < 0 ) {
			sample += 0x100000000;
		}

		return sample / 0x100000000;
	};
}

/**
 * This function is called when the ProcessingQueue is done processing all
 * items. It handles emitting the final run events.
 */
function done() {

	// We have reached the end of the processing queue and are about to emit the
	// "runEnd" event after which reporters typically stop listening and exit
	// the process. First, check if we need to emit one final test.
	if ( config.stats.testCount === 0 && config.failOnZeroTests === true ) {
		let error;
		if ( config.filter && config.filter.length ) {
			error = new Error( `No tests matched the filter "${config.filter}".` );
		} else if ( config.module && config.module.length ) {
			error = new Error( `No tests matched the module "${config.module}".` );
		} else if ( config.moduleId && config.moduleId.length ) {
			error = new Error( `No tests matched the moduleId "${config.moduleId}".` );
		} else if ( config.testId && config.testId.length ) {
			error = new Error( `No tests matched the testId "${config.testId}".` );
		} else {
			error = new Error( "No tests were run." );
		}

		test( "global failure", extend( function( assert ) {
			assert.pushResult( {
				result: false,
				message: error.message,
				source: error.stack
			} );
		}, { validTest: true } ) );

		// We do need to call `advance()` in order to resume the processing queue.
		// Once this new test is finished processing, we'll reach `done` again, and
		// that time the above condition will evaluate to false.
		advance();
		return;
	}

	const storage = config.storage;

	const runtime = now() - config.started;
	const passed = config.stats.all - config.stats.bad;

	ProcessingQueue.finished = true;

	emit( "runEnd", globalSuite.end( true ) );
	runLoggingCallbacks( "done", {
		passed,
		failed: config.stats.bad,
		total: config.stats.all,
		runtime
	} ).then( () => {

		// Clear own storage items if all tests passed
		if ( storage && config.stats.bad === 0 ) {
			for ( let i = storage.length - 1; i >= 0; i-- ) {
				const key = storage.key( i );

				if ( key.indexOf( "qunit-test-" ) === 0 ) {
					storage.removeItem( key );
				}
			}
		}
	} );
}

const ProcessingQueue = {
	finished: false,
	add: addToTestQueue,
	advance,
	taskCount: taskQueueLength
};

export default ProcessingQueue;
