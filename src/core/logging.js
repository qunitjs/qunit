import config from './config.js';
import Promise from '../promise.js';

// Register logging callbacks
export function registerLoggingCallbacks (obj) {
  const callbackNames = ['begin', 'done', 'log', 'testStart', 'testDone',
    'moduleStart', 'moduleDone'];

  function registerLoggingCallback (key) {
    return function loggingCallback (callback) {
      if (typeof callback !== 'function') {
        throw new Error('Callback parameter must be a function');
      }
      config.callbacks[key].push(callback);
    };
  }

  for (let i = 0; i < callbackNames.length; i++) {
    const key = callbackNames[i];

    // Initialize key collection of logging callback
    if (typeof config.callbacks[key] === 'undefined') {
      config.callbacks[key] = [];
    }

    obj[key] = registerLoggingCallback(key);
  }
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
