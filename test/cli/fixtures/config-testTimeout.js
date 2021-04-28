process.on( "unhandledRejection", ( reason ) => {
	console.log( "Unhandled Rejection:", reason );
} );

QUnit.config.testTimeout = 10;

QUnit.test( "slow", () => {
	return new Promise( resolve => setTimeout( resolve, 20 ) );
} );
