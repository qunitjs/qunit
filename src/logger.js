import { console } from "./globals";

// Support: IE 9
// Detect if the console object exists and no-op otherwise.
// This allows support for IE 9, which doesn't have a console
// object if the developer tools are not open.

// Support: SpiderMonkey (mozjs 68+)
// The console object has a log method, but no warn method.

export default {
	warn: console ? ( console.warn || console.log ).bind( console ) : function() {}
};
