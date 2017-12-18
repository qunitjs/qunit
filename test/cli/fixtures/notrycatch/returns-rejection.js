"use strict";

process.on( "unhandledRejection", ( reason ) => {
	console.log( "Unhandled Rejection:", reason );
} );

QUnit.module( "notrycatch", function( hooks ) {
	hooks.beforeEach( function() {
		this.originalNotrycatch = QUnit.config.notrycatch;
		QUnit.config.notrycatch = true;
	} );

	hooks.afterEach( function() {
		QUnit.config.notrycatch = this.originalNotrycatch;
	} );

	QUnit.test( "returns a rejected promise", function() {
		return Promise.reject( "bad things happen sometimes" );
	} );
} );
