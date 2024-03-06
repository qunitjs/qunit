/**
 * npm-search.js is based on npm-keyword v6.1.0 by @sindresorhus,
 * but simplified to not have 32 needless dependencies.
 *
 * - <https://github.com/sindresorhus/npm-keyword/tree/v6.1.0>
 * - <https://snyk.io/test/npm/npm-keyword/6.1.0?tab=dependencies>
 */
'use strict';
const https = require('https');
const registryUrl = 'https://registry.npmjs.org/';

function fetch(url) {
	return new Promise((resolve, reject) => {
		const req = https.get(url, (resp) => {
			let data = '';
			resp.on('data', (chunk) => {
				data += chunk;
			});
			resp.on('end', () => {
				resolve(data);
			});
		});
		req.on('error', reject);
	});
}

async function search(phrase, options) {
	if (options.size < 1 || options.size > 250) {
		// This limitation is enforced by the npm registry API.
		// <https://github.com/npm/registry/blob/1e2d9529e1/docs/REGISTRY-API.md#get-v1search>
		throw new TypeError('Size must be between 1 and 250');
	}

	phrase = encodeURIComponent(phrase).replace('%2C', '+');
	const url = `${registryUrl}-/v1/search?text=${phrase}&size=${options.size}`;
	return JSON.parse(await fetch(url));
}

/**
 * @param {string} keyword
 * @return {Object[]} List of package objects
 */
async function keyword(keyword) {
	const { objects } = await search('keywords:' + keyword, { size: 250 });
	return objects.map(element => element.package);
}

module.exports = { search, keyword };

// Copyright 2020 Timo Tijhof <https://timotijhof.net>
// Copyright 2017 Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
