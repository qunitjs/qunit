if ( !location.search ) {
	location.replace( "?implicit&explicit=yes&array=A&array=B&escaped%20name&" +
		"module=urlParams&notrycatch&custom&customArray=a&customArray=b" );
}

QUnit.config.urlConfig.push( "custom", "customArray" );

// Don't change this module name without also changing the module parameter when loading this suite
QUnit.module( "urlParams", function() {
	QUnit.test( "parsing", function( assert ) {
		assert.ok( QUnit.urlParams, "urlParams property exists" );
		assert.strictEqual( QUnit.urlParams.implicit, true, "implicit true value" );
		assert.strictEqual( QUnit.urlParams.explicit, "yes", "explicit value" );
		assert.deepEqual( QUnit.urlParams.array, [ "A", "B" ], "multiple values" );
		assert.ok( QUnit.urlParams[ "escaped name" ], "escape sequences in name" );
	} );

	QUnit.module( "QUnit.config properties", function() {
		QUnit.test( "setting standard properties", function( assert ) {
			assert.strictEqual( QUnit.config.module, "urlParams", "module" );
			assert.strictEqual( QUnit.config.notrycatch, true, "notrycatch" );
		} );

		QUnit.test( "setting custom properties", function( assert ) {
			assert.strictEqual( QUnit.config.custom, true, "implicit boolean" );
			assert.deepEqual( QUnit.config.customArray, [ "a", "b" ], "multiple values" );
		} );

		QUnit.test( "ignoring non-config parameters", function( assert ) {
			assert.strictEqual( QUnit.config.implicit, undefined, "implicit boolean" );
			assert.strictEqual( QUnit.config.explicit, undefined, "explicit value" );
			assert.strictEqual( QUnit.config.array, undefined, "multiple values" );
			assert.strictEqual( QUnit.config[ "escaped name" ], undefined, "escaped name" );
		} );
	} );
} );
