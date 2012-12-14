/*global QUnit:false */
(function( QUnit ) {
	"use strict";

	var trim = function( s ) {
		if ( !s ) {
			return "";
		}
		return window.jQuery ? window.jQuery.trim( s ) : ( s.trim ? s.trim() : s.replace( /^\s+|\s+$/g, "" ) );
	};
	
	var cleanHtml = function( html ) {
		var translator = document.createElement( "div" );
		translator.innerHTML = html;
		return trim( translator.innerHTML );
	};
	
	var outerHtml = function( node ) {
		var outerHTML = node.outerHTML,
			translator;
		if ( !outerHTML ) {
			translator = document.createElement( "div" );
			translator.appendChild( node.cloneNode( true ) );
			outerHTML = translator.innerHTML;
		}
		return outerHTML;
	};

	var getCleanHtmlWithOrderedAttributesForNode = function( node ) {
		var cleanedOrderedHtml = [],
			attrKeys = [],
			fullTagName, attrs, i, len;

		// Element
		if ( node.nodeType === 1 ) {
			fullTagName = node.nodeName.toLowerCase();
			cleanedOrderedHtml.push( "<" + fullTagName );

			attrs = node.attributes;
			for ( i = 0, len = attrs.length; i < len; i++ ) {
				attrKeys.push( attrs[i].name.toLowerCase() );
			}
			attrKeys.sort();

			for ( i = 0, len = attrKeys.length; i < len; i++ ) {
				cleanedOrderedHtml.push( " " + attrKeys[i] );
				if ( attrs[attrKeys[i]].value ) {
					cleanedOrderedHtml.push( '="' + attrs[attrKeys[i]].value + '"' );
				}
			}

			if (node.childNodes.length) {
				cleanedOrderedHtml.push( ">" );

				// Recursively process childNodes
				for ( i = 0, len = node.childNodes.length; i < len; i++ ) {
					cleanedOrderedHtml.push(
						getCleanHtmlWithOrderedAttributesForNode( node.childNodes[i] )
					);
				}

				cleanedOrderedHtml.push( "</" + fullTagName + ">" );
			}
			else {
				cleanedOrderedHtml.push( " />" );
			}
		}
		else {
			cleanedOrderedHtml.push( outerHtml( node ) );
		}

		return cleanedOrderedHtml.join( "" );
	};

	var getCleanHtmlWithOrderedAttributes = function( html ) {
		var translator = document.createElement( "div" ),
			cleanedOrderedHtml = [],
			kids, i, len;
		translator.innerHTML = html;

		kids = translator.childNodes;
		for ( i = 0, len = kids.length; i < len; i++ ) {
			cleanedOrderedHtml.push( getCleanHtmlWithOrderedAttributesForNode( kids[i] ) );
		}

		return trim( cleanedOrderedHtml.join( '' ) );
	};


	QUnit.extend( QUnit, {

		/**
		 * Compare two snippets of HTML for equality after normalization.
		 *
		 * @example QUnit.htmlEqual("<B>Hello, QUnit!</B>  ", "<b>Hello, QUnit!</b>", "HTML should be equal");
		 * @param String actual The actual HTML before normalization.
		 * @param String expected The excepted HTML before normalization.
		 * @param String message (optional)
		 */
		htmlEqual: function( actual, expected, message ) {
			var cleanedActual, cleanedExpected, cleanedOrderedActual, cleanedOrderedExpected;

			if ( !message ) {
				message = "HTML should be equal";
			}

			// Follow an escalation process for performance reasons
			if ( actual === expected ) {
				QUnit.push( true, actual, expected, message );
			}
			else {
				cleanedActual = cleanHtml( actual );
				cleanedExpected = cleanHtml( expected );

				if ( cleanedActual === cleanedExpected ) {
					QUnit.push( true, actual, expected, message );
				}
				else {
					cleanedOrderedActual = getCleanHtmlWithOrderedAttributes( actual );
					cleanedOrderedExpected = getCleanHtmlWithOrderedAttributes( expected );

					QUnit.push( QUnit.equiv( cleanedOrderedActual, cleanedOrderedExpected ), actual, expected, message );
				}
			}
		},

		/**
		 * Compare two snippets of HTML for inequality after normalization.
		 *
		 * @example QUnit.notHtmlEqual("<b>Hello, <i>QUnit!</i></b>", "<b>Hello, QUnit!</b>", "HTML should not be equal");
		 * @param String actual The actual HTML before normalization.
		 * @param String expected The excepted HTML before normalization.
		 * @param String message (optional)
		 */
		notHtmlEqual: function( actual, expected, message ) {
			var cleanedOrderedActual, cleanedOrderedExpected;

			if ( !message ) {
				message = "HTML should not be equal";
			}

			cleanedOrderedActual = getCleanHtmlWithOrderedAttributes( actual );
			cleanedOrderedExpected = getCleanHtmlWithOrderedAttributes( expected );

			QUnit.push( !QUnit.equiv( cleanedOrderedActual, cleanedOrderedExpected ), actual, expected, message );
		}

	});

})( QUnit );