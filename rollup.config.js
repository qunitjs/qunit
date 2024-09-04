/* eslint-env node */
'use strict';

const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');

const { replacements } = require('./build/dist-replace.js');
const isCoverage = process.env.BUILD_TARGET === 'coverage';

module.exports = {
  input: 'src/core/qunit.js',
  output: {
    file: 'qunit/qunit.js',
    sourcemap: isCoverage,
    format: 'iife',
    exports: 'none',

    // eslint-disable-next-line no-multi-str
    banner: '/*!\n\
 * QUnit @VERSION\n\
 * https://qunitjs.com/\n\
 *\n\
 * Copyright OpenJS Foundation and other contributors\n\
 * Released under the MIT license\n\
 * https://jquery.org/license\n\
 */'
  },
  plugins: [
    replace({
      preventAssignment: true,
      delimiters: ['', ''],
      ...replacements
    }),
    nodeResolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      babelrc: false,
      presets: [
        ['@babel/preset-env', {
          targets: {
            ie: 11,
            safari: 7,
            node: 18
          }
        }]
      ]
    })
  ]
};
