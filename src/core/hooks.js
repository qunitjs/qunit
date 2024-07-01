import config from './config';

function makeAddGlobalHook (hookName) {
  return function addGlobalHook (callback) {
    if (!config._globalHooks[hookName]) {
      config._globalHooks[hookName] = [];
    }
    config._globalHooks[hookName].push(callback);
  };
}

export default {
  beforeEach: makeAddGlobalHook('beforeEach'),
  afterEach: makeAddGlobalHook('afterEach')
};
