// regular expression (case-sensitive), inverted
if ( !location.search ) {
	location.replace( "?filter=!/Foo|bar/" );
}

QUnit.module( "filter" );

QUnit.test( "config parsed", function( assert ) {
	assert.strictEqual( QUnit.config.filter, "!/Foo|bar/" );
} );
QUnit.test( "interface", function( assert ) {
	var node = document.getElementById( "qunit-filter-input" );
	assert.strictEqual( node.nodeName, "INPUT" );
	assert.strictEqual( node.value, "!/Foo|bar/" );
} );

QUnit.test( "foo test", function( assert ) {
	assert.true( true );
} );

QUnit.test( "Foo test", function( assert ) {
	assert.true( false, "Foo is excluded" );
} );

QUnit.test( "bar test", function( assert ) {
	assert.true( false, "bar is excluded" );
} );

QUnit.test( "Bar test", function( assert ) {
	assert.true( true );
} );
