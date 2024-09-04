/* eslint-env node */
'use strict';

const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');

const { replacements } = require('./build/dist-replace.js');
const isCoverage = process.env.BUILD_TARGET === 'coverage';

const banner = `/*!
 * QUnit @VERSION
 * https://qunitjs.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 */`;

const replacementOptions = {
  preventAssignment: true,
  delimiters: ['', ''],
  ...replacements
};

module.exports = [
  {
    input: 'src/core/qunit-commonjs.js',
    output: {
      file: 'qunit/qunit.js',
      sourcemap: isCoverage,
      format: 'iife',
      exports: 'none',
      banner: banner
    },
    plugins: [
      replace(replacementOptions),
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
  },
  {
    input: 'src/core/qunit.js',
    output: {
      file: 'qunit/esm/qunit.module.js',
      format: 'es',
      exports: 'named',
      banner: banner
    },
    plugins: [
      replace(replacementOptions),
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        babelrc: false,
        presets: [
          ['@babel/preset-env', {
            // No need to support IE11 in the ESM version,
            // which means this will leave ES6 features mostly unchanged.
            targets: {
              safari: 10,
              node: 18
            }
          }]
        ]
      })
    ]
  }
];
