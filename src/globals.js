import global from "global";

export const window = global.window;
export const console = global.console;
export const setTimeout = global.setTimeout;
export const clearTimeout = global.clearTimeout;

export const document = window && window.document;
export const navigator = window && window.navigator;
export const sessionStorage = window && window.sessionStorage;
