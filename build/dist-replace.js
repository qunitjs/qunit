// Helper used for JS files by rollup.config.js,
// and for CSS files by Gruntfile.js via preprocess()

const distVersion = require( "../package.json" ).version;

let distEpoch;
let distDate;
if ( /pre/.test( distVersion ) ) {

	// During development, insert a detailed timestamp.
	//
	// Format as 0000-00-00T00:00Z
	distDate = ( new Date() ).toISOString().replace( /:\d+\.\d+Z$/, "Z" );
} else {

	// Release builds should be deterministic and reproducible.
	// Use the date of the release prep commit via an environment variable
	// See RELEASE.md and <https://reproducible-builds.org/docs/source-date-epoch/>.
	//
	// Format as 0000-00-00
	distEpoch = process.env.SOURCE_DATE_EPOCH;
	if ( !/^\d{7,}$/.test( distEpoch ) ) {
		throw new Error( "SOURCE_DATE_EPOCH must be set to a UNIX timestamp" );
	}
	distDate = ( new Date( distEpoch * 1000 ) ).toISOString().replace( /T.+$/, "" );
}

const replacements = {

	// Embed version
	"@VERSION": distVersion,

	// Embed date
	"@DATE": distDate
};

function preprocess( code ) {
	for ( const [ find, replacement ] of Object.entries( replacements ) ) {
		code = code.replace( find, replacement );
	}
	return code;
}

module.exports = {
	replacements,
	preprocess
};
