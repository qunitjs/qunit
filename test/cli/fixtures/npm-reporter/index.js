function NPMReporter( runner ) {
	runner.on( "runEnd", this.onRunEnd );
}

NPMReporter.init = function( runner ) {
	return new NPMReporter( runner );
};

NPMReporter.prototype.onRunEnd = function() {
	console.log( "Run ended!" );
};

module.exports = NPMReporter;
