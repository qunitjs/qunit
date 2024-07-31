/* eslint-env node */

// This JS file exists to reset 'env' and 'globals',
// which ESLint doesn't have a built-in way to do otherwise.
// Because of this, we have to bypass semistandard.
const standard = require('eslint-config-standard');

const config = Object.assign(standard, {
  env: {},
  globals: {},
  rules: Object.assign(standard.rules, {
    // semistandard
    semi: ['error', 'always'],
    'no-extra-semi': 'error',
    // disablements
    'n/no-callback-literal': 'off',
    'no-lone-blocks': 'off',
    'object-shorthand': 'off',
    'prefer-const': 'off',
    'prefer-promise-reject-errors': 'off',
    // extra
    'operator-linebreak': ['error', 'before', { overrides: { '=': 'after', '+=': 'after' } }],
    eqeqeq: ['error'],
    'no-unused-vars': ['error', { args: 'all', argsIgnorePattern: '^_' }]
  })
});

module.exports = config;
