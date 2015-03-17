var defined = {
	document: window.document !== undefined,
	setTimeout: window.setTimeout !== undefined,
	sessionStorage: (function() {
		var x = "qunit-test-string";
		try {
			sessionStorage.setItem( x, x );
			sessionStorage.removeItem( x );
			return true;
		} catch ( e ) {
			return false;
		}
	}())
};