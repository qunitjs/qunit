/*
 * QUnit - jQuery unit testrunner
 * 
 * http://docs.jquery.com/QUnit
 *
 * Copyright (c) 2008 John Resig, Jörn Zaefferer
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Id$
 */

(function($) {
	
var config = {
	Test: [],
	stats: {
		all: 0,
		bad: 0
	},
	queue: [],
	// block until document ready
	blocking: true
};

//restrict modules/tests by get parameters
config.filters = location.search.length > 1 && $.map( location.search.slice(1).split('&'), decodeURIComponent );

var isLocal = !!(window.location.protocol == 'file:');

$(window).load(function() {
	$('#userAgent').html(navigator.userAgent);
	var head = $('<div class="testrunner-toolbar"><label for="filter">Hide passed tests</label></div>').insertAfter("#userAgent");
	$('<input type="checkbox" id="filter" />').attr("disabled", true).prependTo(head).click(function() {
		$('li.pass')[this.checked ? 'hide' : 'show']();
	});
	runTest();	
});

function synchronize(callback) {
	config.queue.push(callback);
	if(!config.blocking) {
		process();
	}
}

function process() {
	while(config.queue.length && !config.blocking) {
		config.queue.shift()();
	}
}

function stop(timeout) {
	config.blocking = true;
	if (timeout)
		config.timeout = setTimeout(function() {
			ok( false, "Test timed out" );
			start();
		}, timeout);
}
function start() {
	// A slight delay, to avoid any current callbacks
	setTimeout(function() {
		if(config.timeout)
			clearTimeout(config.timeout);
		config.blocking = false;
		process();
	}, 13);
}

function validTest( name ) {
	var filters = config.filters;
	if( !filters )
		return true;

	var i = filters.length,
		run = false;
	while( i-- ){
		var filter = filters[i],
			not = filter.charAt(0) == '!';
		if( not ) 
			filter = filter.slice(1);
		if( name.indexOf(filter) != -1 )
			return !not;
		if( not )
			run = true;
	}
	return run;
}

function runTest() {
	config.blocking = false;
	var started = +new Date;
	config.fixture = document.getElementById('main').innerHTML;
	config.ajaxSettings = $.ajaxSettings;
	synchronize(function() {
		$('<p id="testresult" class="result">').html(['Tests completed in ',
			+new Date - started, ' milliseconds.<br/>',
			'<span class="bad">', config.stats.bad, '</span> tests of <span class="all">', config.stats.all, '</span> failed.</p>']
			.join(''))
			.appendTo("body");
		$("#banner").addClass(config.stats.bad ? "fail" : "pass");
	});
}

function test(name, callback, nowait) {
	if(config.currentModule)
		name = config.currentModule + " module: " + name;
	var lifecycle = $.extend({
		setup: function() {},
		teardown: function() {}
	}, config.moduleLifecycle);
	
	if ( !validTest(name) )
		return;
		
	synchronize(function() {
		config.Test = [];
		try {
			lifecycle.setup();
			callback();
			lifecycle.teardown();
		} catch(e) {
			if( typeof console != "undefined" && console.error && console.warn ) {
				console.error("Test " + name + " died, exception and test follows");
				console.error(e);
				console.warn(callback.toString());
			}
			config.Test.push( [ false, "Died on test #" + (config.Test.length+1) + ": " + e.message ] );
		}
	});
	synchronize(function() {
		try {
			reset();
		} catch(e) {
			if( typeof console != "undefined" && console.error && console.warn ) {
				console.error("reset() failed, following Test " + name + ", exception and reset fn follows");
				console.error(e);
				console.warn(reset.toString());
			}
		}
		
		// don't output pause tests
		if(nowait) return;
		
		if(config.expected && config.expected != config.Test.length) {
			config.Test.push( [ false, "Expected " + config.expected + " assertions, but " + config.Test.length + " were run" ] );
		}
		config.expected = null;
		
		var good = 0, bad = 0;
		var ol = document.createElement("ol");
		ol.style.display = "none";
		var li = "", state = "pass";
		for ( var i = 0; i < config.Test.length; i++ ) {
			var li = document.createElement("li");
			li.className = config.Test[i][0] ? "pass" : "fail";
			li.appendChild( document.createTextNode(config.Test[i][1]) );
			ol.appendChild( li );
			
			config.stats.all++;
			if ( !config.Test[i][0] ) {
				state = "fail";
				bad++;
				config.stats.bad++;
			} else good++;
		}
	
		var li = document.createElement("li");
		li.className = state;
	
		var b = document.createElement("strong");
		b.innerHTML = name + " <b style='color:black;'>(<b class='fail'>" + bad + "</b>, <b class='pass'>" + good + "</b>, " + config.Test.length + ")</b>";
		b.onclick = function(){
			var n = this.nextSibling;
			if ( $.css( n, "display" ) == "none" )
				n.style.display = "block";
			else
				n.style.display = "none";
		};
		$(b).dblclick(function(event) {
			var target = $(event.target).filter("strong").clone();
			if ( target.length ) {
				target.children().remove();
				location.href = location.href.match(/^(.+?)(\?.*)?$/)[1] + "?" + encodeURIComponent($.trim(target.text()));
			}
		});
		li.appendChild( b );
		li.appendChild( ol );
	
		document.getElementById("tests").appendChild( li );
		
		if(bad) {
			$("#filter").attr("disabled", null);
		}
	});
}

// call on start of module test to prepend name to all tests
function module(name, lifecycle) {
	config.currentModule = name;
	config.moduleLifecycle = lifecycle;
}

/**
 * Specify the number of expected assertions to gurantee that failed test (no assertions are run at all) don't slip through.
 */
function expect(asserts) {
	config.expected = asserts;
}

/**
 * Resets the test setup. Useful for tests that modify the DOM.
 */
function reset() {
	$("#main").html( config.fixture );
	$.event.global = {};
	$.ajaxSettings = $.extend({}, config.ajaxSettings);
}

/**
 * Asserts true.
 * @example ok( $("a").size() > 5, "There must be at least 5 anchors" );
 */
function ok(a, msg) {
	config.Test.push( [ !!a, msg ] );
}

/**
 * Asserts that two arrays are the same
 */
function isSet(a, b, msg) {
	function serialArray( a ) {
		var r = [];
		
		if ( a && a.length )
	        for ( var i = 0; i < a.length; i++ ) {
	            var str = a[i].nodeName;
	            if ( str ) {
	                str = str.toLowerCase();
	                if ( a[i].id )
	                    str += "#" + a[i].id;
	            } else
	                str = a[i];
	            r.push( str );
	        }
	
		return "[ " + r.join(", ") + " ]";
	}
	var ret = true;
	if ( a && b && a.length != undefined && a.length == b.length ) {
		for ( var i = 0; i < a.length; i++ )
			if ( a[i] != b[i] )
				ret = false;
	} else
		ret = false;
	if ( !ret )
		config.Test.push( [ ret, msg + " expected: " + serialArray(b) + " result: " + serialArray(a) ] );
	else 
		config.Test.push( [ ret, msg ] );
}

/**
 * Asserts that two objects are equivalent
 */
function isObj(a, b, msg) {
	var ret = true;
	
	if ( a && b ) {
		for ( var i in a )
			if ( a[i] != b[i] )
				ret = false;

		for ( i in b )
			if ( a[i] != b[i] )
				ret = false;
	} else
		ret = false;

    config.Test.push( [ ret, msg ] );
}

/**
 * Returns an array of elements with the given IDs, eg.
 * @example q("main", "foo", "bar")
 * @result [<div id="main">, <span id="foo">, <input id="bar">]
 */
function q() {
	var r = [];
	for ( var i = 0; i < arguments.length; i++ )
		r.push( document.getElementById( arguments[i] ) );
	return r;
}

/**
 * Asserts that a select matches the given IDs
 * @example t("Check for something", "//[a]", ["foo", "baar"]);
 * @result returns true if "//[a]" return two elements with the IDs 'foo' and 'baar'
 */
function t(a,b,c) {
	var f = $(b);
	var s = "";
	for ( var i = 0; i < f.length; i++ )
		s += (s && ",") + '"' + f[i].id + '"';
	isSet(f, q.apply(q,c), a + " (" + b + ")");
}

/**
 * Add random number to url to stop IE from caching
 *
 * @example url("data/test.html")
 * @result "data/test.html?10538358428943"
 *
 * @example url("data/test.php?foo=bar")
 * @result "data/test.php?foo=bar&10538358345554"
 */
function url(value) {
	return value + (/\?/.test(value) ? "&" : "?") + new Date().getTime() + "" + parseInt(Math.random()*100000);
}

/**
 * Checks that the first two arguments are equal, with an optional message.
 * Prints out both actual and expected values.
 *
 * Prefered to ok( actual == expected, message )
 *
 * @example equals( $.format("Received {0} bytes.", 2), "Received 2 bytes." );
 *
 * @param Object actual
 * @param Object expected
 * @param String message (optional)
 */
function equals(actual, expected, message) {
	push(expected == actual, actual, expected, message);
}

function push(result, actual, expected, message) {
	message = message || (result ? "okay" : "failed");
	config.Test.push( [ result, result ? message + ": " + expected : message + ", expected: " + jsDump.parse(expected) + " result: " + jsDump.parse(actual) ] );
}

/**
 * Trigger an event on an element.
 *
 * @example triggerEvent( document.body, "click" );
 *
 * @param DOMElement elem
 * @param String type
 */
function triggerEvent( elem, type, event ) {
	if ( $.browser.mozilla || $.browser.opera ) {
		event = document.createEvent("MouseEvents");
		event.initMouseEvent(type, true, true, elem.ownerDocument.defaultView,
			0, 0, 0, 0, 0, false, false, false, false, 0, null);
		elem.dispatchEvent( event );
	} else if ( $.browser.msie ) {
		elem.fireEvent("on"+type);
	}
}

// Test for multiple JavaScript variables or literals recursive equivalence.
// All variables or literals passed as arguments are verified 2 by 2, e.g.
// a1 with a2, a2 with a3, a3 with a4 and so on up to the last argument.
// By transition we can confirm that all arguments are equivalent.
//
//      NOTE:
//          Ensures a deep and recursive equivalence.
//          Identical references will always be equivalent, whatever it is.
//          When comparing JavaScript native type: ensures also a type checking.
//          Be blind about functions equivalence.
//          Do not chain through JavaScript's prototype's chain inheritance.
//          It is only possible to compare "public" object properties.
//          Two objects are considered equivalent if they got the same
//              properties and their properties' values are equivalent.
//              EVEN IF their constructor are different!!!
//        
//              Though having:
//
//                  function Car(year) {
//                      this.year = year;
//                      this.isOld = function() {
//                          return year > 10;
//                      }
//                  }
//          
//                  function Human(year) {
//                      this.year = year;
//                      this.isOld = function() {
//                          return year > 80;
//                      }
//                  }
//          
//                  var o1 = new Car(30);
//                  var o2 = new Human(30);
//
//              o1 and o2 are equivalent because their properties and their
//                  respective values are equals.
//              Their functions are ignored and cannot be compared.
//
//      ALGO:
//          Uses the && (guard) to stop execution as soon as possible
//          between each single comparisons (within loop and recursive calls).
//
// author: Philippe Rathé <prathe@gmail.com>
//
function equiv() {
    var args = Array.prototype.slice.apply(arguments);
    var equals = true; // equals until we can explicitely say it's not!
    var a, b; // compares 2 by 2 by transition up to the last argument.

    if (args.length < 2) {
        return true; // nothing to compare with
    }

    a = args[0];
    b = args[1];

    return (function (a, b) {
        if (typeof a !== typeof b) {
            return false;
        }

        // Try to optimize the algo speed if ever both a and b are references
        // pointing to the same object (function, array, object)
        if (a === b) {
            return true;
        }
            
        // NOTE:
        //      Must test if it's an array before testing if it is an object,
        //      because an array is also an object in JavaScript!
        if (a instanceof Array) {
            if (a.length !== b.length) {
                return false;
            }

            for (var i = 0; i < a.length; i++) {
                equals = equals && equiv(a[i], b[i]);
            }

            return equals;
        }
        
        // null  is also an  object  in JavaScript.
        // We must verify here that it equals to null explicitely.
        // Otherwise when iterating over the properties of the null object,
        // which does not exists, it can mistakely equals the {} object also.
        if (a === null) {
            return b === null;
        }

        if (typeof a === "object") {
            // Verify properties equivalence in both ways:

            // Everything in a should be in b and equivalent and ...
            for (i in a) {
                if (a.hasOwnProperty(i)) {
                    equals = equals && equiv(a[i], b[i]);
                }
            }

            // ... everything in b should be in a and equivalent
            for (i in b) {
                if (b.hasOwnProperty(i)) {
                    equals = equals && equiv(b[i], a[i]);
                }
            }

            return equals;
        }

        if (typeof a === "function") {
            // Skip functions
            return true;
        }

        // Compares Number, String, Boolean or undefined
        // with type checking ('===' instead of '==')
        return a === b;

    }(a, b)) && equiv.apply(this, args.splice(1)); // next (1..n)
}


// public API as global methods
$.extend(window, {
	test: test,
	module: module,
	expect: expect,
	ok: ok,
	equals: equals,
	start: start,
	stop: stop,
	reset: reset,
	isLocal: isLocal,
	same: function(a, b, message) {
		push(equiv(a, b), a, b, message);
	},
	QUnit: {
		equiv: equiv
	},
	// legacy methods below
	isSet: isSet,
	isObj: isObj,
	compare: function() {
		throw "compare is deprecated - use same() instead";
	},
	compare2: function() {
		throw "compare2 is deprecated - use same() instead";
	},
	serialArray: function() {
		throw "serialArray is deprecated - use jsDump.parse() instead";
	},
	q: q,
	t: t,
	url: url,
	triggerEvent: triggerEvent
});

})(jQuery);

/**
 * jsDump
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Licensed under BSD (http://www.opensource.org/licenses/bsd-license.php)
 * Date: 5/15/2008
 * @projectDescription Advanced and extensible data dumping for Javascript.
 * @version 1.0.0
 * @author Ariel Flesler
 * @link {http://flesler.blogspot.com/2008/05/jsdump-pretty-dump-of-any-javascript.html}
 */
(function(){
	function quote( str ){
		return '"' + str.toString().replace(/"/g, '\\"') + '"';
	};
	function literal( o ){
		return o + '';	
	};
	function join( pre, arr, post ){
		var s = jsDump.separator(),
			base = jsDump.indent();
			inner = jsDump.indent(1);
		if( arr.join )
			arr = arr.join( ',' + s + inner );
		if( !arr )
			return pre + post;
		return [ pre, inner + arr, base + post ].join(s);
	};
	function array( arr ){
		var i = arr.length,	ret = Array(i);					
		this.up();
		while( i-- )
			ret[i] = this.parse( arr[i] );				
		this.down();
		return join( '[', ret, ']' );
	};
	
	var reName = /^function (\w+)/;
	
	var jsDump = window.jsDump = {
		parse:function( obj, type ){//type is used mostly internally, you can fix a (custom)type in advance
			var	parser = this.parsers[ type || this.typeOf(obj) ];
			type = typeof parser;			
			
			return type == 'function' ? parser.call( this, obj ) :
				   type == 'string' ? parser :
				   this.parsers.error;
		},
		typeOf:function( obj ){
			var type = typeof obj,
				f = 'function';//we'll use it 3 times, save it
			return type != 'object' && type != f ? type :
				!obj ? 'null' :
				obj.exec ? 'regexp' :// some browsers (FF) consider regexps functions
				obj.getHours ? 'date' :
				obj.scrollBy ?  'window' :
				obj.nodeName == '#document' ? 'document' :
				obj.nodeName ? 'node' :
				obj.item ? 'nodelist' : // Safari reports nodelists as functions
				obj.callee ? 'arguments' :
				obj.call || obj.constructor != Array && //an array would also fall on this hack
					(obj+'').indexOf(f) != -1 ? f : //IE reports functions like alert, as objects
				'length' in obj ? 'array' :
				type;
		},
		separator:function(){
			return this.multiline ?	this.HTML ? '<br />' : '\n' : this.HTML ? '&nbsp;' : ' ';
		},
		indent:function( extra ){// extra can be a number, shortcut for increasing-calling-decreasing
			if( !this.multiline )
				return '';
			var chr = this.indentChar;
			if( this.HTML )
				chr = chr.replace(/\t/g,'   ').replace(/ /g,'&nbsp;');
			return Array( this._depth_ + (extra||0) ).join(chr);
		},
		up:function( a ){
			this._depth_ += a || 1;
		},
		down:function( a ){
			this._depth_ -= a || 1;
		},
		setParser:function( name, parser ){
			this.parsers[name] = parser;
		},
		// The next 3 are exposed so you can use them
		quote:quote, 
		literal:literal,
		join:join,
		//
		_depth_: 1,
		// This is the list of parsers, to modify them, use jsDump.setParser
		parsers:{
			window: '[Window]',
			document: '[Document]',
			error:'[ERROR]', //when no parser is found, shouldn't happen
			unknown: '[Unknown]',
			'null':'null',
			undefined:'undefined',
			'function':function( fn ){
				var ret = 'function',
					name = 'name' in fn ? fn.name : (reName.exec(fn)||[])[1];//functions never have name in IE
				if( name )
					ret += ' ' + name;
				ret += '(';
				
				ret = [ ret, this.parse( fn, 'functionArgs' ), '){'].join('');
				return join( ret, this.parse(fn,'functionCode'), '}' );
			},
			array: array,
			nodelist: array,
			arguments: array,
			object:function( map ){
				var ret = [ ];
				this.up();
				for( var key in map )
					ret.push( this.parse(key,'key') + ': ' + this.parse(map[key]) );
				this.down();
				return join( '{', ret, '}' );
			},
			node:function( node ){
				var open = this.HTML ? '&lt;' : '<',
					close = this.HTML ? '&gt;' : '>';
					
				var tag = node.nodeName.toLowerCase(),
					ret = open + tag;
					
				for( var a in this.DOMAttrs ){
					var val = node[this.DOMAttrs[a]];
					if( val )
						ret += ' ' + a + '=' + this.parse( val, 'attribute' );
				}
				return ret + close + open + '/' + tag + close;
			},
			functionArgs:function( fn ){//function calls it internally, it's the arguments part of the function
				var l = fn.length;
				if( !l ) return '';				
				
				var args = Array(l);
				while( l-- )
					args[l] = String.fromCharCode(97+l);//97 is 'a'
				return ' ' + args.join(', ') + ' ';
			},
			key:quote, //object calls it internally, the key part of an item in a map
			functionCode:'[code]', //function calls it internally, it's the content of the function
			attribute:quote, //node calls it internally, it's an html attribute value
			string:quote,
			date:quote,
			regexp:literal, //regex
			number:literal,
			'boolean':literal
		},
		DOMAttrs:{//attributes to dump from nodes, name=>realName
			id:'id',
			name:'name',
			'class':'className'
		},
		HTML:false,//if true, entities are escaped ( <, >, \t, space and \n )
		indentChar:'   ',//indentation unit
		multiline:true //if true, items in a collection, are separated by a \n, else just a space.
	};

})();
