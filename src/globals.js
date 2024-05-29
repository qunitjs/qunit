// We don't use global-this-polyfill [1], because it modifies
// the globals scope by default. QUnit must not affect the host context
// as developers may test their project may be such a polyfill, and/or
// they may intentionally test their project with and without certain
// polyfills and we must not affect that. It also uses an obscure
// mechanism that seems to sometimes causes a runtime error in older
// browsers (specifically Safari and IE versions that support
// Object.defineProperty but then report _T_ as undefined).
// [1] https://github.com/ungap/global-this/blob/v0.4.4/esm/index.js
//
// Another way is `Function('return this')()`, but doing so relies
// on eval which will cause a CSP error on some servers.
//
// Instead, simply check the four options that already exist
// in all supported environments.
function getGlobalThis () {
  if (typeof globalThis !== 'undefined') {
    // For SpiderMonkey, modern browsers, and recent Node.js
    // eslint-disable-next-line no-undef
    return globalThis;
  }
  if (typeof self !== 'undefined') {
    // For web workers
    // eslint-disable-next-line no-undef
    return self;
  }
  if (typeof window !== 'undefined') {
    // For document context in browsers
    return window;
  }
  if (typeof global !== 'undefined') {
    // For Node.js
    // eslint-disable-next-line no-undef
    return global;
  }
  throw new Error('Unable to locate global object');
}

// This avoids a simple `export const` assignment as that would lead Rollup
// to change getGlobalThis and use the same (generated) variable name there.
const g = getGlobalThis();
export { g as globalThis };

// These optional globals are undefined in one or more environments:
// modern browser, old browser, Node.js, SpiderMonkey.
// Calling code must check these for truthy-ness before use.
export const console = g.console;
export const setTimeout = g.setTimeout;
export const clearTimeout = g.clearTimeout;
export const process = g.process;
export const window = g.window;
export const document = window && window.document;
export const navigator = window && window.navigator;

export const localSessionStorage = (function () {
  const x = 'qunit-test-string';
  try {
    g.sessionStorage.setItem(x, x);
    g.sessionStorage.removeItem(x);
    return g.sessionStorage;
  } catch (e) {
    return undefined;
  }
}());

// Basic fallback for ES6 Map
// Support: Safari 7; Map is undefined
// Support: iOS 8; `new Map(iterable)` is not supported
//
// Fallback for ES7 Map#keys
// Support: IE 11; Map#keys is undefined
export const StringMap = typeof g.Map === 'function' &&
  typeof g.Map.prototype.keys === 'function' &&
  typeof g.Symbol === 'function' &&
  typeof g.Symbol.iterator === 'symbol'
  ? g.Map
  : function StringMap (input) {
    let store = Object.create(null);
    let hasOwn = Object.prototype.hasOwnProperty;
    this.has = function (strKey) {
      return hasOwn.call(store, strKey);
    };
    this.get = function (strKey) {
      return store[strKey];
    };
    this.set = function (strKey, val) {
      if (!hasOwn.call(store, strKey)) {
        this.size++;
      }
      store[strKey] = val;
      return this;
    };
    this.delete = function (strKey) {
      if (hasOwn.call(store, strKey)) {
        delete store[strKey];
        this.size--;
      }
    };
    this.forEach = function (callback) {
      for (let strKey in store) {
        callback(store[strKey], strKey);
      }
    };
    this.keys = function () {
      return Object.keys(store);
    };
    this.clear = function () {
      store = Object.create(null);
      this.size = 0;
    };
    this.size = 0;

    if (input) {
      input.forEach((val, strKey) => {
        this.set(strKey, val);
      });
    }
  };

// Basic fallback for ES6 Set
// Support: IE 11, `new Set(iterable)` parameter not yet implemented
// Test for Set#values() which came after Set(iterable).
export const StringSet = typeof g.Set === 'function' &&
  typeof g.Set.prototype.values === 'function'
  ? g.Set
  : function (input) {
    const set = Object.create(null);

    if (Array.isArray(input)) {
      input.forEach(item => {
        set[item] = true;
      });
    }

    return {
      add (value) {
        set[value] = true;
      },
      has (value) {
        return value in set;
      },
      get size () {
        return Object.keys(set).length;
      }
    };
  };
