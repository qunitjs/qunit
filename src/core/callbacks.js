import config from './config.js';
import Promise from './promise.js';

export function createRegisterCallbackFunction (key) {
  // Initialize key collection of callback
  if (typeof config.callbacks[key] === 'undefined') {
    config.callbacks[key] = [];
  }

  return function registerCallback (callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('Callback parameter must be a function');
    }
    config.callbacks[key].push(callback);
  };
}

export function runLoggingCallbacks (key, arg) {
  const callbacks = config.callbacks[key];

  // Handling 'log' callbacks separately. Unlike the other callbacks,
  // the log callback is not controlled by the processing queue,
  // but rather used by asserts. Hence to promisfy the 'log' callback
  // would mean promisfying each step of a test
  if (key === 'log') {
    callbacks.map(callback => callback(arg));
    return;
  }

  // ensure that each callback is executed serially
  let promiseChain = Promise.resolve();
  callbacks.forEach(callback => {
    promiseChain = promiseChain.then(() => {
      return Promise.resolve(callback(arg));
    });
  });
  return promiseChain;
}
