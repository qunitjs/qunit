// Depending on the exact usage, QUnit could be in one of several places, this
// function handles finding it.
module.exports = function requireQUnit( resolve = require.resolve ) {
	try {

		// First we attempt to find QUnit relative to the current working directory.
		const localQUnitPath = resolve( "qunit", {

			// Support: Node 10. Explicitly check "node_modules" to avoid a bug.
			// Fixed in Node 12+. See https://github.com/nodejs/node/issues/35367.
			paths: [ process.cwd() + "/node_modules", process.cwd() ]
		} );
		delete require.cache[ localQUnitPath ];
		return require( localQUnitPath );
	} catch ( e ) {
		try {

			// Second, we use the globally installed QUnit
			delete require.cache[ resolve( "../../qunit/qunit" ) ];
			// eslint-disable-next-line node/no-missing-require, node/no-unpublished-require
			return require( "../../qunit/qunit" );
		} catch ( e ) {
			if ( e.code === "MODULE_NOT_FOUND" ) {

				// Finally, we use the local development version of QUnit
				delete require.cache[ resolve( "../../dist/qunit" ) ];
				// eslint-disable-next-line node/no-missing-require, node/no-unpublished-require
				return require( "../../dist/qunit" );
			}

			throw e;
		}
	}
};
