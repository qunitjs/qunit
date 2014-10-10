function Suite( name ) {
	this.name = name;
	this.parent = currentSuite;
	this.beforeEach = [];
	this.afterEach = [];
}

Suite.prototype.getSuiteHierarchy = function() {
	var suite = this,
		suites = [ suite ];
	while ( ( suite = suite.parent ) ) {
		suites.push( suite );
	}
	return suites;
};

Suite.prototype.getFullName = function() {
	var i,
		name = "",
		allSuites = this.getSuiteHierarchy();

	// Iterate the loop in reverse to start at the root suite
	for ( i = allSuites.length; i--; ) {
		if ( allSuites[ i ].name ) {
			name += allSuites[ i ].name + " ";
		}
	}
	return name.slice( 0, -1 );
};

function wrapSuiteHook( hookFn, suiteMeta ) {
	return function( assert ) {
		assert.suite = suiteMeta;
		return hookFn.call( this, assert );
	};
}

Suite.prototype.hooks = function( handler ) {
	var i, j, callbackCount, callbacks, suiteMeta,
		isAfterEach = handler === "afterEach",
		callbackList = [],
		allSuites = this.getSuiteHierarchy();

	// Iterate the loop in reverse to start at the root suite
	for ( i = allSuites.length; i--; ) {

		// Provide consumers with useful temporal suite metadata along the way during execution
		suiteMeta = {
			name: allSuites[ i ].name,
			fullName: allSuites[ i ].getFullName(),
			depth: allSuites.length - i - 1
		};

		callbacks = allSuites[ i ][ handler ];

		// If "afterEach", reverse a copy of the sub-array to ensure the suite-level order is as
		// expected after the later `test.hooks( "afterEach" ).reverse()` call is finished
		if ( isAfterEach ) {
			callbacks = callbacks.slice().reverse();
		}

		for ( j = 0, callbackCount = callbacks.length; j < callbackCount; j++ ) {
			callbackList.push( wrapSuiteHook( callbacks[ j ], suiteMeta ) );
		}
	}

	return callbackList;
};
