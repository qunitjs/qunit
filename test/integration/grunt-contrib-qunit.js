const cp = require( "child_process" );
const path = require( "path" );
const DIR = path.join( __dirname, "grunt-contrib-qunit" );

QUnit.module( "grunt-contrib-qunit", {
	before: () => {

		// Let this be quick for re-runs
		cp.execSync( "npm install --prefer-offline --no-audit", { cwd: DIR, encoding: "utf8" } );
	}
} );

QUnit.test( "passing tests", assert => {
	assert.expect( 0 );
	cp.execSync( "npm test", { cwd: DIR } );
} );

QUnit.test.each( "failing tests", {
	"no-tests": [ "fail-no-tests", `Testing fail-no-tests.html F
>> global failure
>> Message: No tests were run.
>> Error: No tests were run.
>>   at done (file:)
>>   at advanceTestQueue (file:)
>>   at Object.advance (file:)
>>   at unblockAndAdvanceQueue (file:)` ]
}, ( assert, [ command, expected ] ) => {

	try {
		const ret = cp.execSync( "node_modules/.bin/grunt qunit:" + command, {
			cwd: DIR,
			encoding: "utf8"
		} );
		assert.equal( ret, null );
	} catch ( e ) {
		const actual = e.stdout.replace( / \(file:.*$/gm, " (file:)" );
		assert.pushResult( { result: actual.includes( expected ), actual, expected } );
		assert.true( e.status > 0, "non-zero exit code" );
	}
} );
