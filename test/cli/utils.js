const { getIgnoreList } = require( "../../src/cli/utils" );

QUnit.module( "getIgnoreList", function() {
	QUnit.test( "reads .gitignore", function( assert ) {
		const ignoreList = getIgnoreList( "test/cli/fixtures" );
		assert.deepEqual( ignoreList, [ "/abcd", "/efgh" ] );
	} );
} );
