import { window, localSessionStorage } from "../globals";
import { extend } from "./utilities";

/**
 * Config object: Maintain internal state
 * Later exposed as QUnit.config
 * `config` initialized at top of scope
 */
const config = {

	// The queue of tests to run
	queue: [],

	// Block until document ready
	blocking: true,

	// By default, run previously failed tests first
	// very useful in combination with "Hide passed tests" checked
	reorder: true,

	// By default, modify document.title when suite is done
	altertitle: true,

	// HTML Reporter: collapse every test except the first failing test
	// If false, all failing tests will be expanded
	collapse: true,

	// By default, scroll to top of the page when suite is done
	scrolltop: true,

	// Depth up-to which object will be dumped
	maxDepth: 5,

	// When enabled, all tests must call expect()
	requireExpects: false,

	// Placeholder for user-configurable form-exposed URL parameters
	urlConfig: [],

	// Set of all modules.
	modules: [],

	// The first unnamed module
	currentModule: {
		name: "",
		tests: [],
		childModules: [],
		testsRun: 0,
		unskippedTestsRun: 0,
		hooks: {
			before: [],
			beforeEach: [],
			afterEach: [],
			after: []
		}
	},

	callbacks: {},

	// The storage module to use for reordering tests
	storage: localSessionStorage
};

// take a predefined QUnit.config and extend the defaults
var globalConfig = window && window.QUnit && window.QUnit.config;

// only extend the global config if there is no QUnit overload
if ( window && window.QUnit && !window.QUnit.version ) {
	extend( config, globalConfig );
}

// Push a loose unnamed module to the modules collection
config.modules.push( config.currentModule );

export default config;
