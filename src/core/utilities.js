import { window, setTimeout } from "../globals";

export const toString = Object.prototype.toString;
export const hasOwn = Object.prototype.hasOwnProperty;
export const now = Date.now || function() {
	return new Date().getTime();
};

export const defined = {
	document: window && window.document !== undefined,
	setTimeout: setTimeout !== undefined
};

// Returns a new Array with the elements that are in a but not in b
export function diff( a, b ) {
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

/**
 * Determines whether an element exists in a given array or not.
 *
 * @method inArray
 * @param {Any} elem
 * @param {Array} array
 * @return {Boolean}
 */
export function inArray( elem, array ) {
	return array.indexOf( elem ) !== -1;
}

/**
 * Makes a clone of an object using only Array or Object as base,
 * and copies over the own enumerable properties.
 *
 * @param {Object} obj
 * @return {Object} New object with only the own properties (recursively).
 */
export function objectValues( obj ) {
	var key, val,
		vals = is( "array", obj ) ? [] : {};
	for ( key in obj ) {
		if ( hasOwn.call( obj, key ) ) {
			val = obj[ key ];
			vals[ key ] = val === Object( val ) ? objectValues( val ) : val;
		}
	}
	return vals;
}

export function extend( a, b, undefOnly ) {
	for ( var prop in b ) {
		if ( hasOwn.call( b, prop ) ) {
			if ( b[ prop ] === undefined ) {
				delete a[ prop ];
			} else if ( !( undefOnly && typeof a[ prop ] !== "undefined" ) ) {
				a[ prop ] = b[ prop ];
			}
		}
	}

	return a;
}

export function objectType( obj ) {
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
	default:
		return typeof obj;
	}
}

// Safe object type checking
export function is( type, obj ) {
	return objectType( obj ) === type;
}

// Based on Java's String.hashCode, a simple but not
// rigorously collision resistant hashing function
export function generateHash( module, testName ) {
	const str = module + "\x1C" + testName;
	let hash = 0;

	for ( let i = 0; i < str.length; i++ ) {
		hash  = ( ( hash << 5 ) - hash ) + str.charCodeAt( i );
		hash |= 0;
	}

	// Convert the possibly negative integer hash code into an 8 character hex string, which isn't
	// strictly necessary but increases user understanding that the id is a SHA-like hash
	let hex = ( 0x100000000 + hash ).toString( 16 );
	if ( hex.length < 8 ) {
		hex = "0000000" + hex;
	}

	return hex.slice( -8 );
}
