import { console } from "./globals";

// Detect if the console doesn't exist and no-op in that case.
// This allows support for IE 9, which doesn't have a console
// object if the developer tools are not open.

export default {
	warn: console ? console.warn.bind( console ) : function() {}
};
