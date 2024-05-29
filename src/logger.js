import { console } from './globals';

// Support: SpiderMonkey (mozjs 68+)
// The console object has a log method, but no warn method.

export default {
  warn: console
    ? (console.warn || console.log).bind(console)
    : function () {}
};
