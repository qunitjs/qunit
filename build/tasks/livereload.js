/* eslint-env node */
var livereload = require( "tiny-lr" );
var server;

module.exports = function( grunt ) {
	grunt.registerTask( "livereload", function() {
		if ( !server ) {
			server = livereload();
			server.listen( 35729, function() {
				console.log( "Livereload server listening on port 35729" );
			} );
		}

		server.changed( { body: { files: [ "qunit.js" ] } } );
	} );
};
