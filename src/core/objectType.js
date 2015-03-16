function objectType( obj ) {
	if ( typeof obj === "undefined" ) {
		return "undefined";
	}

	// Consider: typeof null === object
	if ( obj === null ) {
		return "null";
	}

	var match = toString.call( obj ).match( /^\[object\s(.*)\]$/ ),
		type = match && match[ 1 ] || "";

	switch ( type ) {
		case "Number":
			if ( isNaN( obj ) ) {
				return "nan";
			}
			return "number";
		case "String":
		case "Boolean":
		case "Array":
		case "Date":
		case "RegExp":
		case "Function":
			return type.toLowerCase();
	}
	if ( typeof obj === "object" ) {
		return "object";
	}
	return undefined;
}

function is( type, obj ) {
	return QUnit.objectType( obj ) === type;
}