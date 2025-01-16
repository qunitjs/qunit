import { console } from './globals.js';

// Support IE 9: No console object, unless the developer tools are not open.

// Support IE 9: Function#bind is supported, but no console.log.bind().

// Support: SpiderMonkey (mozjs 68+)
// The console object has a log method, but no warn method.

export default {
  warn: console
    ? Function.prototype.bind.call(console.warn || console.log, console)
    : function () {}
};
