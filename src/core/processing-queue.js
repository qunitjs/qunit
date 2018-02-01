import config from "./config";
import {
	defined,
	generateHash,
	now
} from "./utilities";
import {
	runLoggingCallbacks
} from "./logging";

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

/**
 * Advances the taskQueue to the next task. If the taskQueue is empty,
 * process the testQueue
 */
function advance() {
	advanceTaskQueue();

	if ( !config.queue.length ) {
		advanceTestQueue();
	}
}

/**
 * Advances the taskQueue to the next task if it is ready and not empty.
 */
function advanceTaskQueue() {
	const start = now();
	config.depth = ( config.depth || 0 ) + 1;

	while ( config.queue.length && !config.blocking ) {
		const elapsedTime = now() - start;

		if ( !defined.setTimeout || config.updateRate <= 0 || elapsedTime < config.updateRate ) {
			const task = config.queue.shift();
			task();
		} else {
			setTimeout( advance );
			break;
		}
	}

	config.depth--;
}

/**
 * Advance the testQueue to the next test to process. Call done() if testQueue completes.
 */
function advanceTestQueue() {
	if ( !config.blocking && !config.testQueue.length && config.depth === 0 ) {
		done();
		return;
	}

	const testTasks = config.testQueue.shift();
	addToTaskQueue( testTasks() );
	advance();
}

/**
 * Enqueue the tasks for a test into the task queue.
 * @param {Array} tasksArray
 */
function addToTaskQueue( tasksArray ) {
	config.queue.push( ...tasksArray );
}

/**
 * Adds a tests to the TestQueue for execution.
 * @param {Array} testTasksArray
 * @param {Boolean} prioritize
 * @param {String} seed
 */
function addToTestQueue( testTasksArray, prioritize, seed ) {
	if ( prioritize ) {
		config.testQueue.splice( priorityCount++, 0, testTasksArray );
	} else if ( seed ) {
		if ( !unitSampler ) {
			unitSampler = unitSamplerGenerator( seed );
		}

		// Insert into a random position after all prioritized items
		const index = Math.floor( unitSampler() * ( config.testQueue.length - priorityCount + 1 ) );
		config.testQueue.splice( priorityCount + index, 0, testTasksArray );
	} else {
		config.testQueue.push( testTasksArray );
	}
}

/**
 * Creates a seeded "sample" generator which is used for randomizing tests.
 */
function unitSamplerGenerator( seed ) {

	// 32-bit xorshift, requires only a nonzero seed
	// http://excamera.com/sphinx/article-xorshift.html
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
	const storage = config.storage;

	ProcessingQueue.finished = true;

	const runtime = now() - config.started;
	const passed = config.stats.all - config.stats.bad;

	emit( "runEnd", globalSuite.end( true ) );
	runLoggingCallbacks( "done", {
		passed,
		failed: config.stats.bad,
		total: config.stats.all,
		runtime
	} );

	// Clear own storage items if all tests passed
	if ( storage && config.stats.bad === 0 ) {
		for ( let i = storage.length - 1; i >= 0; i-- ) {
			const key = storage.key( i );

			if ( key.indexOf( "qunit-test-" ) === 0 ) {
				storage.removeItem( key );
			}
		}
	}
}

const ProcessingQueue = {
	finished: false,
	add: addToTestQueue,
	advance
};

export default ProcessingQueue;
