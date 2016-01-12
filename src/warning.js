QUnit.warning = ( function() {
    var messages = [];

    var once = [],
        disableLogs = false;

    function find( array, warning ) {
        for ( var i = 0; i < array.length; i++ ) {
            if ( array[ i ].type === warning ) {
                return array[ i ];
            }
        }
        return null;
    }

    function warning( message ) {
        if ( find( once, message ) ) {
            return;
        }

        var warningObj = find( messages, message );
        if ( !warningObj ) {
            return;
        }

        once.push( warningObj );
        if ( !disableLogs ) {
            if ( global.console && global.console.warn ) {
                global.console.warn( warningObj.message );
            }
        }
    }

    function off() {
        disableLogs = true;
    }

    warning.log = once;
    warning.off = off;

    return warning;
}() );
