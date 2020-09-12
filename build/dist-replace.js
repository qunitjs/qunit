// Used for JS files by rollup.config.js
// Used for CSS files by Gruntfile.js via preprocess()
const replacements = {

	// Embed version
	"@VERSION": require( "../package.json" ).version,

	// Embed date (yyyy-mm-ddThh:mmZ)
	"@DATE": ( new Date() ).toISOString().replace( /:\d+\.\d+Z$/, "Z" )
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
