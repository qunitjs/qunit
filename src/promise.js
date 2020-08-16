import _Promise from "es6-promise";

export default typeof Promise !== "undefined" ? Promise : _Promise;
