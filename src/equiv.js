// Test for equality any JavaScript type.
// Author: Philippe Rathé <prathe@gmail.com>
QUnit.equiv = (function() {

	/**
	 * Gets the keys of an object which are both enumerable and own
	 *
	 * @param {Object} obj
	 * @return {Array} Array with the enumerable and own keys of the object given
	 */
	function ownObjectKeys( obj ) {
		var i,
			keys = [];

		for ( i in obj ) {
			if ( hasOwn.call( obj, i ) ) {
				keys.push( i );
			}
		}

		return keys;
	}

	// Call the o related callback with the given arguments.
	function bindCallbacks( o, callbacks, args ) {
		var prop = QUnit.objectType( o );
		if ( prop ) {
			if ( QUnit.objectType( callbacks[ prop ] ) === "function" ) {
				return callbacks[ prop ].apply( callbacks, args );
			} else {
				return callbacks[ prop ]; // or undefined
			}
		}
	}

	// the real equiv function
	var innerEquiv,

		// the function that performs deep equivalence checks
		deepEquiv,

		// the function that performs property equivalence checks
		propEquiv,

		// stack to decide between skip/abort functions
		callers = [],

		// stack to avoiding loops from circular referencing
		parents = [],
		parentsB = [],

		getProto = Object.getPrototypeOf || function( obj ) {
			/* jshint camelcase: false, proto: true */
			return obj.__proto__;
		},
		callbacks = (function() {

			// for string, boolean, number and null
			function useStrictEquality( b, a ) {

				/*jshint eqeqeq:false */
				if ( b instanceof a.constructor || a instanceof b.constructor ) {

					// to catch short annotation VS 'new' annotation of a
					// declaration
					// e.g. var i = 1;
					// var j = new Number(1);
					return a == b;
				} else {
					return a === b;
				}
			}

			return {
				"string": useStrictEquality,
				"boolean": useStrictEquality,
				"number": useStrictEquality,
				"null": useStrictEquality,
				"undefined": useStrictEquality,

				"nan": function( b ) {
					return isNaN( b );
				},

				"date": function( b, a ) {
					return QUnit.objectType( b ) === "date" && a.valueOf() === b.valueOf();
				},

				"regexp": function( b, a ) {
					return QUnit.objectType( b ) === "regexp" &&

						// the regex itself
						a.source === b.source &&

						// and its modifiers
						a.global === b.global &&

						// (gmi) ...
						a.ignoreCase === b.ignoreCase &&
						a.multiline === b.multiline &&
						a.sticky === b.sticky;
				},

				// - skip when the property is a method of an instance (OOP)
				// - abort otherwise,
				// initial === would have catch identical references anyway
				"function": function() {
					var caller = callers[ callers.length - 1 ];
					return caller !== Object && typeof caller !== "undefined";
				},

				"array": function( b, a ) {
					var i, j, len, loop, aCircular, bCircular;

					// b could be an object literal here
					if ( QUnit.objectType( b ) !== "array" ) {
						return false;
					}

					len = a.length;
					if ( len !== b.length ) {
						// safe and faster
						return false;
					}

					// track reference to avoid circular references
					parents.push( a );
					parentsB.push( b );
					for ( i = 0; i < len; i++ ) {
						loop = false;
						for ( j = 0; j < parents.length; j++ ) {
							aCircular = parents[ j ] === a[ i ];
							bCircular = parentsB[ j ] === b[ i ];
							if ( aCircular || bCircular ) {
								if ( a[ i ] === b[ i ] || aCircular && bCircular ) {
									loop = true;
								} else {
									parents.pop();
									parentsB.pop();
									return false;
								}
							}
						}
						if ( !loop && !deepEquiv( a[ i ], b[ i ] ) ) {
							parents.pop();
							parentsB.pop();
							return false;
						}
					}
					parents.pop();
					parentsB.pop();
					return true;
				},

				"object": function( b, a ) {

					/*jshint forin:false */
					var i, j, loop, aCircular, bCircular,
						// Default to true
						eq = true,
						aProperties = [],
						bProperties = [];

					// comparing constructors is more strict than using
					// instanceof
					if ( a.constructor !== b.constructor ) {

						// Allow objects with no prototype to be equivalent to
						// objects with Object as their constructor.
						if ( !( ( getProto( a ) === null && getProto( b ) === Object.prototype ) ||
							( getProto( b ) === null && getProto( a ) === Object.prototype ) ) ) {
							return false;
						}
					}

					// stack constructor before traversing properties
					callers.push( a.constructor );

					// track reference to avoid circular references
					parents.push( a );
					parentsB.push( b );

					// be strict: don't ensure hasOwnProperty and go deep
					for ( i in a ) {
						loop = false;
						for ( j = 0; j < parents.length; j++ ) {
							aCircular = parents[ j ] === a[ i ];
							bCircular = parentsB[ j ] === b[ i ];
							if ( aCircular || bCircular ) {
								if ( a[ i ] === b[ i ] || aCircular && bCircular ) {
									loop = true;
								} else {
									eq = false;
									break;
								}
							}
						}
						aProperties.push( i );
						if ( !loop && !deepEquiv( a[ i ], b[ i ] ) ) {
							eq = false;
							break;
						}
					}

					parents.pop();
					parentsB.pop();
					callers.pop(); // unstack, we are done

					for ( i in b ) {
						bProperties.push( i ); // collect b's properties
					}

					// Ensures identical properties name
					return eq && deepEquiv( aProperties.sort(), bProperties.sort() );
				}
			};
		}());
	deepEquiv = function ( ) { // can take multiple arguments
		var args = [].slice.apply( arguments );
		if ( args.length < 2 ) {
			return true; // end transition
		}

		return ( (function( a, b ) {
			if ( a === b ) {
				return true; // catch the most you can
			} else if ( a === null || b === null || typeof a === "undefined" ||
					typeof b === "undefined" ||
					QUnit.objectType( a ) !== QUnit.objectType( b ) ) {

				// don't lose time with error prone cases
				return false;
			} else {
				return bindCallbacks( a, callbacks, [ b, a ] );
			}

			// apply transition with (1..n) arguments
		}( args[ 0 ], args[ 1 ] ) ) &&
			deepEquiv.apply( this, args.splice( 1, args.length - 1 ) ) );
	},
	propEquiv = function ( ) {
		var args = [].slice.apply( arguments );
		if ( args.length < 2 ) {
			return true;
		}

		return ( (function ( a, b ) {
			if ( !QUnit.is( "object", a ) || !QUnit.is( "object", b ) ) {
				// if the test author submits parameters that are not objects, check for deepEquiv
				return deepEquiv( a, b );
			} else {
				/*jshint forin:false */
				var i, j, loop, aCircular, bCircular, currentProperty, subEquiv,
				// Default to true
				eq = true,
				aProperties = ownObjectKeys( a ),
				bProperties = ownObjectKeys( b );

				// stack constructor before traversing properties
				callers.push( a.constructor );

				// track reference to avoid circular references
				parents.push( a );
				parentsB.push( b );

				for ( i = 0; i < aProperties.length; i++ ){
					currentProperty = aProperties[i];
					loop = false;
					for ( j = 0; j < parents.length; j++ ) {

						aCircular = parents[j] === a[currentProperty];
						bCircular = parentsB[j] === b[currentProperty];

						if ( aCircular || bCircular ){
							if ( a[ currentProperty ] === b[ currentProperty ] ||
									aCircular && bCircular ){
								loop = true;
							} else {
								eq = false;
								break;
							}
						}

					}

					// we'll only use prop equivalence to compare objects
					subEquiv = QUnit.is( "object", a[ currentProperty ] ) ?
						propEquiv : deepEquiv;

					if ( !loop && !subEquiv( a[ currentProperty ], b[ currentProperty ] ) ) {
						eq = false;
						break;
					}
				}
				parents.pop();
				parentsB.pop();
				callers.pop(); // unstack, we are done

				// ensure both objects have the same properties
				return eq && deepEquiv(aProperties.sort(), bProperties.sort());
			}
		}( args[ 0 ], args[ 1 ] ) ) &&
			propEquiv.apply(this, args.splice( 1, args.length - 1 ) ) );

	},
	innerEquiv = deepEquiv; // default equivalence check
	innerEquiv.props = propEquiv;

	return innerEquiv;
}());
