/* eslint-env node */
var livereload = require( "tiny-lr" );
var server;

module.exports = function( grunt ) {
	grunt.registerTask( "livereload", function() {
		if ( !server ) {
			var port = this.options().port;
			server = livereload();
			server.listen( port, function() {
				console.log( "Livereload server listening on port " + port );
			} );
		}

		server.changed( { body: { files: [ "file-path-does-not-matter.js" ] } } );
	} );
};
