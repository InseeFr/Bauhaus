import { removeTrailingSlash } from 'bauhaus-library/src/utils/string-utils';

import {
	getToken,
	isTokenValid,
} from 'js/utils/auth/open-id-connect-auth/token-utils';

const apiURL = `${window.location.origin}/configuration.json`;

export default (context, api) => {
	return Object.keys(api).reduce((apiFns, resource) => {
		// try {
		// 	const mockPath = context === '' ? 'index' : context;
		// 	const mocks = require('./mocks/' + mockPath);
		// 	if (mocks[resource]) {
		// 		apiFns[resource] = mocks[resource];
		// 	}
		// } catch (e) {
		// 	console.log(`The API ${context} do not have any mock file`);
		// }
		if (!apiFns[resource]) {
			apiFns[resource] = buildCall(context, resource, api[resource]);
		}

		return apiFns;
	}, {});
};

export const defaultOptions = {
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
};

export const defaultThenHandler = res => res.json();

export const computeDscr = (fn, [...args]) => {
	const dscr = fn(...args);
	if (!Array.isArray(dscr)) {
		throw new Error(
			'API descr function should return a `string` or an `array`, got ' +
				`\`${dscr}\`.`
		);
	}
	let [url, options, thenHandler] = dscr;
	//We don't deep merge: all nested properties in default options (ie.
	//headers.Accept) are lost. Hence, if a prop option is overriden (ie.
	//headers), all relevant options should be present.
	options = Object.assign({}, defaultOptions, options);
	const token = getToken();
	if (token && isTokenValid(token)) {
		options = {
			...options,
			headers: { ...options.headers, Authorization: `Bearer ${token}` },
		};
	}
	thenHandler = thenHandler || defaultThenHandler;
	return [url, options, thenHandler];
};

let saveApiURL;
export const getBaseURI = context => {
	return process.env.REACT_APP_INSEE
		? saveApiURL ||
				fetch(apiURL).then(res => {
					saveApiURL = res.json().then(config => config.bauhaus);
					return saveApiURL;
				})
		: Promise.resolve(process.env.REACT_APP_API_BASE_HOST);
};

export const buildCall = (context, resource, fn) => {
	return async (...args) => {
		let [path, options, thenHandler] = computeDscr(fn, args);
		if (!options.method) {
			options.method = guessMethod(resource);
		}

		const baseURI = await getBaseURI();
		const baseHost = removeTrailingSlash(
			`${baseURI}${context ? `/${context}` : ''}`
		);

		const url = `${baseHost}/${path}`;

		return fetch(url, options).then(
			res => {
				if (res.ok) return Promise.resolve(res).then(thenHandler);
				else return res.text().then(text => Promise.reject(text));
			},
			err => {
				return Promise.reject(err.toString());
			}
		);
	};
};

const patterns = [
	['GET', /^get/i],
	['PUT', /^put/i],
	['POST', /post/i],
	['DELETE', /delete/i],
];
/**
 * Takes a string and returns an HTTP verb
 */
export const guessMethod = name => {
	const matchPattern = patterns.find(([method, pattern]) => pattern.test(name));
	if (!matchPattern)
		throw new Error(`Could not guess http method from \`${name}\``);
	const [method] = matchPattern;
	return method;
};
