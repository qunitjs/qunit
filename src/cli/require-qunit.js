// Depending on the exact usage, QUnit could be in one of several places, this
// function handles finding it.
module.exports = function requireQUnit( resolve = require.resolve ) {
	try {

		// For:
		//
		// - QUnit is installed as local dependency and invoked normally
		//   within the current project, e.g. via `npm test`, `npm run …`,
		//   or `node_modules/.bin/qunit`.
		//   The below will lead to the same package directory that
		//   the CLI command belonged to.
		//
		// - QUnit is installed both as local dependency in the current project,
		//   and also globally installed via npm by the end-user.
		//   If the user (accidentally) ran the CLI command from their global
		//   install, then we prefer to stil use the qunit library file from the
		//   current project's dependency.
		// eslint-disable-next-line node/no-missing-require
		const localQUnitPath = resolve( "qunit", {

			// Support: Node 10. Explicitly check "node_modules" to avoid a bug.
			// Fixed in Node 12+. See https://github.com/nodejs/node/issues/35367.
			paths: [ process.cwd() + "/node_modules", process.cwd() ]
		} );
		delete require.cache[ localQUnitPath ];
		return require( localQUnitPath );
	} catch ( e ) {
		if ( e.code === "MODULE_NOT_FOUND" ) {

			// For:
			//
			// - QUnit is installed globally via npm by the end-user, and the
			//   the user ran this global CLI command in a project directory that
			//   does not have a qunit dependency installed.
			//   Use the library file relative to the global CLI command in that case.
			//
			// - We are running a local command from within the source directory
			//   of the QUnit project itself (e.g. qunit Git repository).
			//   Use the library file relative to this command, within the source directory.
			//
			// eslint-disable-next-line node/no-missing-require, node/no-unpublished-require
			delete require.cache[ resolve( "../../qunit/qunit" ) ];
			// eslint-disable-next-line node/no-missing-require, node/no-unpublished-require
			return require( "../../qunit/qunit" );
		}

		throw e;
	}
};
