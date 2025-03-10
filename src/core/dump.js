// QUnit.dump is based on jsDump 1.0.0 by Ariel Flesler
// From <https://flesler.blogspot.com/2008/05/jsdump-pretty-dump-of-any-javascript.html>
// Licensed under BSD <https://opensource.org/licenses/BSD-2-Clause>
//
// -------
// Copyright 2008 Ariel Flesler - aflesler(at)gmail(dot)com
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
// -------

import config from './config.js';
import { inArray, is } from './utilities.js';

export default (function () {
  function quote (str) {
    return '"' + str.toString().replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  }
  function literal (o) {
    return o + '';
  }
  function join (pre, arr, post) {
    const s = dump.separator();
    const inner = dump.indent(1);
    if (arr.join) {
      arr = arr.join(',' + s + inner);
    }
    if (!arr) {
      return pre + post;
    }
    const base = dump.indent();
    return [pre, inner + arr, base + post].join(s);
  }
  function array (arr, stack) {
    if (config.maxDepth && dump.depth > config.maxDepth) {
      return '[object Array]';
    }

    this.up();

    let i = arr.length;
    const ret = new Array(i);
    while (i--) {
      ret[i] = this.parse(arr[i], undefined, stack);
    }
    this.down();
    return join('[', ret, ']');
  }

  function isArray (obj) {
    return (
      // Native Arrays
      Array.isArray(obj)

      // NodeList objects
      || (typeof obj.length === 'number' && obj.item !== undefined
        && (obj.length
          ? obj.item(0) === obj[0]
          : (obj.item(0) === null && obj[0] === undefined)
        )
      )
    );
  }

  const reName = /^function (\w+)/;
  const dump = {

    // The objType is used mostly internally, you can fix a (custom) type in advance
    parse: function (obj, objType, stack) {
      stack = stack || [];
      const objIndex = stack.indexOf(obj);

      if (objIndex !== -1) {
        return `recursion(${objIndex - stack.length})`;
      }

      objType = objType || this.typeOf(obj);
      const parser = this.parsers[objType];
      const parserType = typeof parser;

      if (parserType === 'function') {
        stack.push(obj);
        const res = parser.call(this, obj, stack);
        stack.pop();
        return res;
      }
      if (parserType === 'string') {
        return parser;
      }
      return '[ERROR: Missing QUnit.dump formatter for type ' + objType + ']';
    },
    typeOf: function (obj) {
      if (obj === null) {
        return 'null';
      }
      if (typeof obj === 'undefined') {
        return 'undefined';
      } else if (is('regexp', obj)) {
        return 'regexp';
      } else if (is('date', obj)) {
        return 'date';
      } else if (is('function', obj)) {
        return 'function';
      } else if (obj.setInterval !== undefined
          && obj.document !== undefined
          && obj.nodeType === undefined) {
        return 'window';
      } else if (obj.nodeType === 9) {
        return 'document';
      } else if (obj.nodeType) {
        return 'node';
      } else if (isArray(obj)) {
        return 'array';
      } else if (obj.constructor === Error.prototype.constructor) {
        return 'error';
      }
      return typeof obj;
    },

    separator: function () {
      return '\n';
    },

    // Extra can be a number, shortcut for increasing-calling-decreasing
    indent: function (extra) {
      let chr = this.indentChar;
      return new Array(this.depth + (extra || 0)).join(chr);
    },
    up: function (a) {
      this.depth += a || 1;
    },
    down: function (a) {
      this.depth -= a || 1;
    },
    setParser: function (name, parser) {
      this.parsers[name] = parser;
    },

    // The next 3 are exposed so you can use them
    quote: quote,
    literal: literal,
    join: join,
    depth: 1,

    get maxDepth () {
      return config.maxDepth;
    },
    set maxDepth (value) {
      config.maxDepth = value;
    },

    // This is the list of parsers, to modify them, use dump.setParser
    parsers: {
      window: '[Window]',
      document: '[Document]',
      error: function (error) {
        return 'Error("' + error.message + '")';
      },

      // This has been unused since QUnit 1.0.0.
      // @todo Deprecate and remove.
      unknown: '[Unknown]',
      null: 'null',
      undefined: 'undefined',
      function: function (fn) {
        let ret = 'function';

        // Functions never have name in IE
        const name = 'name' in fn ? fn.name : (reName.exec(fn) || [])[1];

        if (name) {
          ret += ' ' + name;
        }
        ret += '(';

        ret = [ret, dump.parse(fn, 'functionArgs'), '){'].join('');
        return join(ret, dump.parse(fn, 'functionCode'), '}');
      },
      array: array,
      nodelist: array,
      arguments: array,
      object: function (map, stack) {
        const ret = [];

        if (config.maxDepth && dump.depth > config.maxDepth) {
          return '[object Object]';
        }

        dump.up();
        const keys = [];
        for (const key in map) {
          keys.push(key);
        }

        // Some properties are not always enumerable on Error objects.
        const nonEnumerableProperties = ['message', 'name'];
        for (const i in nonEnumerableProperties) {
          const key = nonEnumerableProperties[i];
          if (key in map && !inArray(key, keys)) {
            keys.push(key);
          }
        }
        keys.sort();
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const val = map[key];
          ret.push(dump.parse(key, 'key') + ': '
            + dump.parse(val, undefined, stack));
        }
        dump.down();
        return join('{', ret, '}');
      },
      node: function (node) {
        const open = '<';
        const close = '>';
        const tag = node.nodeName.toLowerCase();
        let ret = open + tag;
        const attrs = node.attributes;

        if (attrs) {
          for (let i = 0; i < attrs.length; i++) {
            const val = attrs[i].nodeValue;

            // IE6 includes all attributes in .attributes, even ones not explicitly
            // set. Those have values like undefined, null, 0, false, "" or
            // "inherit".
            if (val && val !== 'inherit') {
              ret += ' ' + attrs[i].nodeName + '='
                + dump.parse(val, 'attribute');
            }
          }
        }
        ret += close;

        // Show content of TextNode or CDATASection
        if (node.nodeType === 3 || node.nodeType === 4) {
          ret += node.nodeValue;
        }

        return ret + open + '/' + tag + close;
      },

      // Function calls it internally, it's the arguments part of the function
      functionArgs: function (fn) {
        let l = fn.length;

        if (!l) {
          return '';
        }

        const args = new Array(l);
        while (l--) {
          // 97 is 'a'
          args[l] = String.fromCharCode(97 + l);
        }
        return ' ' + args.join(', ') + ' ';
      },

      // Object calls it internally, the key part of an item in a map
      key: quote,

      // Function calls it internally, it's the content of the function
      functionCode: '[code]',

      // Node calls it internally, it's a html attribute value
      attribute: quote,
      string: quote,
      date: quote,
      regexp: literal,
      number: literal,
      boolean: literal,
      symbol: function (sym) {
        return sym.toString();
      }
    },

    // Indentation unit
    indentChar: '  '
  };

  return dump;
})();
