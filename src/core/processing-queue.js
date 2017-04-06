import config from "./config";
import {
	defined,
	generateHash,
	now,
	objectType
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
 * Advances the ProcessingQueue to the next item if it is ready.
 * @param {Boolean} last
 */
function advance() {
	const start = now();
	config.depth = ( config.depth || 0 ) + 1;

	while ( config.queue.length && !config.blocking ) {
		const elapsedTime = now() - start;

		if ( !defined.setTimeout || config.updateRate <= 0 || elapsedTime < config.updateRate ) {
			if ( priorityCount > 0 ) {
				priorityCount--;
			}

			config.queue.shift()();
		} else {
			setTimeout( advance, 13 );
			break;
		}
	}

	config.depth--;

	if ( !config.blocking && !config.queue.length && config.depth === 0 ) {
		done();
	}
}

function addToQueueImmediate( callback ) {
	if ( objectType( callback ) === "array" ) {
		while ( callback.length ) {
			addToQueueImmediate( callback.pop() );
		}

		return;
	}

	config.queue.unshift( callback );
	priorityCount++;
}

/**
 * Adds a function to the ProcessingQueue for execution.
 * @param {Function|Array} callback
 * @param {Boolean} priority
 * @param {String} seed
 */
function addToQueue( callback, prioritize, seed ) {
	if ( prioritize ) {
		config.queue.splice( priorityCount++, 0, callback );
	} else if ( seed ) {
		if ( !unitSampler ) {
			unitSampler = unitSamplerGenerator( seed );
		}

		// Insert into a random position after all prioritized items
		const index = Math.floor( unitSampler() * ( config.queue.length - priorityCount + 1 ) );
		config.queue.splice( priorityCount + index, 0, callback );
	} else {
		config.queue.push( callback );
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
	add: addToQueue,
	addImmediate: addToQueueImmediate,
	advance
};

export default ProcessingQueue;
