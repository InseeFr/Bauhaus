import {
	getToken,
	isTokenValid,
} from '../auth/open-id-connect-auth/token-utils';
import { getEnvVar } from '../utils/env';

const apiURL = `${window.location.origin}/configuration.json`;

export const removeTrailingSlash = url => url.replace(/\/$/, '');

export const buildApi = (context, api) => {
	return Object.keys(api).reduce((apiFns, resource) => {
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

let saveApiURL = '';
export const getBaseURI = () => {
	if (saveApiURL) return Promise.resolve(saveApiURL);
	return getEnvVar('INSEE')
		? fetch(apiURL).then((res) => {
				saveApiURL = res.json().then((config) => config.bauhaus);
				return saveApiURL;
		  })
		: Promise.resolve(getEnvVar('API_BASE_HOST')).then((u) => {
				saveApiURL = u;
				return u;
		  });
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
	const matchPattern = patterns.find(([_method, pattern]) => pattern.test(name));
	if (!matchPattern)
		throw new Error(`Could not guess http method from \`${name}\``);
	const [method] = matchPattern;
	return method;
};
