var toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty;

// Returns a new Array with the elements that are in a but not in b
function diff( a, b ) {
	var i, j,
		result = a.slice();

	for ( i = 0; i < result.length; i++ ) {
		for ( j = 0; j < b.length; j++ ) {
			if ( result[ i ] === b[ j ] ) {
				result.splice( i, 1 );
				i--;
				break;
			}
		}
	}
	return result;
}

// From jquery.js
function inArray( elem, array ) {
	if ( array.indexOf ) {
		return array.indexOf( elem );
	}

	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[ i ] === elem ) {
			return i;
		}
	}

	return -1;
}

/**
 * Makes a clone of an object using only Array or Object as base,
 * and copies over the own enumerable properties.
 *
 * @param {Object} obj
 * @return {Object} New object with only the own properties (recursively).
 */
function objectValues ( obj ) {
	var key, val,
		vals = QUnit.is( "array", obj ) ? [] : {};
	for ( key in obj ) {
		if ( hasOwn.call( obj, key ) ) {
			val = obj[ key ];
			vals[ key ] = val === Object( val ) ? objectValues( val ) : val;
		}
	}
	return vals;
}

function extend( a, b, undefOnly ) {
	for ( var prop in b ) {
		if ( hasOwn.call( b, prop ) ) {

			// Avoid "Member not found" error in IE8 caused by messing with window.constructor
			// This block runs on every environment, so `global` is being used instead of `window`
			// to avoid errors on node.
			if ( prop !== "constructor" || a !== global ) {
				if ( b[ prop ] === undefined ) {
					delete a[ prop ];
				} else if ( !( undefOnly && typeof a[ prop ] !== "undefined" ) ) {
					a[ prop ] = b[ prop ];
				}
			}
		}
	}

	return a;
}

function objectType( obj ) {
	if ( typeof obj === "undefined" ) {
		return "undefined";
	}

	// Consider: typeof null === object
	if ( obj === null ) {
		return "null";
	}

	var match = toString.call( obj ).match( /^\[object\s(.*)\]$/ ),
		type = match && match[ 1 ];

	switch ( type ) {
		case "Number":
			if ( isNaN( obj ) ) {
				return "nan";
			}
			return "number";
		case "String":
		case "Boolean":
		case "Array":
		case "Set":
		case "Map":
		case "Date":
		case "RegExp":
		case "Function":
		case "Symbol":
			return type.toLowerCase();
	}
	if ( typeof obj === "object" ) {
		return "object";
	}
}

// Safe object type checking
function is( type, obj ) {
	return QUnit.objectType( obj ) === type;
}
