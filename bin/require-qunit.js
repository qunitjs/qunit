const resolve = require( "resolve" );

// Depending on the exact usage, QUnit could be in one of several places, this
// function handles finding it.
module.exports = function requireQUnit() {
	try {

		// First we attempt to find QUnit relative to the current working directory.
		const localQUnitPath = resolve.sync( "qunitjs", { basedir: process.cwd() } );
		delete require.cache[ localQUnitPath ];
		return require( localQUnitPath );
	} catch ( e ) {
		try {

			// Second, we use the globally installed QUnit
			delete require.cache[ resolve.sync( "../qunit/qunit" ) ];
			return require( "../qunit/qunit" );
		} catch ( e ) {
			if ( e.code === "MODULE_NOT_FOUND" ) {

				// Finally, we use the local development version of QUnit
				delete require.cache[ resolve.sync( "../dist/qunit" ) ];
				return require( "../dist/qunit" );
			}

			throw e;
		}
	}
};
