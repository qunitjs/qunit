(function() {
var reporter, _log,
	vReporter, _vLog,
	logs = [],
	vLogs = [];

QUnit.config.reorder = false;

reporter = QUnit.console();
_log = reporter.log;

reporter.log = function() {
	logs.push.apply( logs, arguments );
	_log.apply( reporter, arguments );
};

vReporter = QUnit.console( true );
_vLog = vReporter.log;

vReporter.log = function() {
	vLogs.push.apply( vLogs, arguments );
	_vLog.apply( vReporter, arguments );
};

QUnit.module( "console reporter" );

QUnit.test( "reporter methods", function( assert ) {
	assert.strictEqual( typeof reporter.log, "function" );
	assert.strictEqual( typeof reporter.error, "function" );
});

QUnit.module( "non-verbose reporter" );

QUnit.test( "check logged stuff", function( assert ) {
	assert.strictEqual( logs.join( "" ), ".." );
});

QUnit.module( "verbose reporter" );

QUnit.test( "check logged stuff", function( assert ) {
	assert.strictEqual( vLogs[ 0 ], "# console reporter - reporter methods " );
	assert.strictEqual( vLogs[ 1 ], "." );
	assert.strictEqual( vLogs[ 2 ], "." );
	assert.ok( /\n  2 from 2 assertions passed \(100%\) in \d+ms/.test( vLogs[ 3 ] ) );
});

})();
