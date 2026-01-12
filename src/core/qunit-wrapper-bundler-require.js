/* eslint-env node */

// In a single bundler invocation, if different parts or dependencies
// of a project mix ESM and CJS, avoid a split-brain state by making
// sure "import" and "require" re-use the same instance via this wrapper.
//
// Bundlers generally allow requiring an ESM file from CommonJS.
const { QUnit } = require('./esm/qunit.module.js');
module.exports = QUnit;
