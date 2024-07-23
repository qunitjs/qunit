import { inArray } from './utilities.js';
import config from './config.js';

const SUPPORTED_EVENTS = [
  'error',
  'runStart',
  'suiteStart',
  'testStart',
  'assertion',
  'testEnd',
  'suiteEnd',
  'runEnd'
];
const MEMORY_EVENTS = [
  'error',
  'runEnd'
];

/**
 * Emits an event with the specified data to all currently registered listeners.
 * Callbacks will fire in the order in which they are registered (FIFO). This
 * function is not exposed publicly; it is used by QUnit internals to emit
 * logging events.
 *
 * @private
 * @method emit
 * @param {string} eventName
 * @param {Object} data
 * @return {void}
 */
export function emit (eventName, data) {
  /* istanbul ignore if: private function */
  if (typeof eventName !== 'string') {
    throw new TypeError('eventName must be a string when emitting an event');
  }

  // Clone the callbacks in case one of them registers a new callback
  const originalCallbacks = config._event_listeners[eventName];
  const callbacks = originalCallbacks ? [...originalCallbacks] : [];

  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i](data);
  }

  if (inArray(eventName, MEMORY_EVENTS)) {
    config._event_memory[eventName] = data;
  }
}

export const prioritySymbol = {};

/**
 * Registers a callback as a listener to the specified event.
 *
 * @public
 * @method on
 * @param {string} eventName
 * @param {Function} callback
 * @param {Object} [priority] Internal parameter for PerfReporter
 * @return {void}
 */
export function on (eventName, callback, priority = null) {
  if (typeof eventName !== 'string') {
    throw new TypeError('eventName must be a string when registering a listener');
  }
  if (!inArray(eventName, SUPPORTED_EVENTS)) {
    const events = SUPPORTED_EVENTS.join(', ');
    throw new Error(`"${eventName}" is not a valid event; must be one of: ${events}.`);
  }
  if (typeof callback !== 'function') {
    throw new TypeError('callback must be a function when registering a listener');
  }
  /* istanbul ignore if: internal argument */
  if (priority && priority !== prioritySymbol) {
    throw new TypeError('invalid priority parameter');
  }

  const listeners = config._event_listeners[eventName] || (config._event_listeners[eventName] = []);

  // Don't register the same callback more than once
  if (!inArray(callback, listeners)) {
    if (priority === prioritySymbol) {
      listeners.unshift(callback);
    } else {
      listeners.push(callback);
    }

    if (config._event_memory[eventName] !== undefined) {
      callback(config._event_memory[eventName]);
    }
  }
}
