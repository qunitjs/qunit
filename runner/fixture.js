import QUnit from "../src/core";
import { window, document } from "../src/globals";

( function() {

	if ( typeof window === "undefined" || typeof document === "undefined" ) {
		return;
	}

	var config = QUnit.config,
		hasOwn = Object.prototype.hasOwnProperty;

// Stores fixture HTML for resetting later
	function storeFixture() {

	// Avoid overwriting user-defined values
		if ( hasOwn.call( config, "fixture" ) ) {
			return;
		}

		var fixture = document.getElementById( "qunit-fixture" );
		if ( fixture ) {
			config.fixture = fixture.innerHTML;
		}
	}

	QUnit.begin( storeFixture );

// Resets the fixture DOM element if available.
	function resetFixture() {
		if ( config.fixture == null ) {
			return;
		}

		var fixture = document.getElementById( "qunit-fixture" );
		if ( fixture ) {
			fixture.innerHTML = config.fixture;
		}
	}

	QUnit.testStart( resetFixture );

} )();
