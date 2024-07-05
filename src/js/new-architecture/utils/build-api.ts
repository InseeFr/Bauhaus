import {
	getToken,
	isTokenValid,
} from '../../utils/auth/open-id-connect-auth/token-utils';
import { getEnvVar } from '../../utils/env';

export const generateGenericApiEndpoints = (
	pluralPrefix = '',
	singularPrefix = ''
) => {
	const capitalizedPluralPrefix =
		pluralPrefix.charAt(0).toUpperCase() + pluralPrefix.slice(1);
	const capitalizedSingularPrefix =
		singularPrefix.charAt(0).toUpperCase() + singularPrefix.slice(1);

	return {
		[`getAll${capitalizedPluralPrefix}`]: () => [pluralPrefix],
		[`getAll${capitalizedPluralPrefix}ForAdvancedSearch`]: () => [
			`${pluralPrefix}/advanced-search`,
		],
		[`get${capitalizedSingularPrefix}ById`]: (id: string) => [
			`${singularPrefix}/${id}`,
		],
		[`create${capitalizedSingularPrefix}`]: (object: unknown) => [
			singularPrefix,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(object),
			},
			(res: Response) => res.text(),
		],
		[`update${capitalizedSingularPrefix}`]: (object: { id: string }) => [
			`${singularPrefix}/${object.id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(object),
			},
			() => Promise.resolve(object.id),
		],
		[`publish${capitalizedSingularPrefix}`]: (object: { id: string }) => [
			`${singularPrefix}/validate/${object.id}`,
			{ method: 'PUT' },
			(res: Response) => res.text(),
		],
	};
};

const apiURL = `${window.location.origin}/configuration.json`;

export const removeTrailingSlash = (url: string) => url.replace(/\/$/, '');

export const buildApi = (context: string, api: any): any => {
	return Object.keys(api).reduce((apiFns: any, resource) => {
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

export const defaultThenHandler = (res: Response) => res.json();

export const computeDscr = (fn: any, [...args]) => {
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
				return res.json().then((config) => {
					saveApiURL = config.bauhaus;
					return config.bauhaus;
				});
		  })
		: Promise.resolve(getEnvVar('API_BASE_HOST')).then((u) => {
				saveApiURL = u;
				return u;
		  });
};

export const buildCall = (context: string, resource: string, fn: any) => {
	return async (...args: any[]) => {
		let [path, options, thenHandler] = computeDscr(fn, args);
		if (!options.method) {
			options.method = guessMethod(resource);
		}

		const baseURI = await getBaseURI();
		const baseHost = removeTrailingSlash(
			`${baseURI}${context ? `/${context}` : ''}`
		);

		const url = path !== '' ? `${baseHost}/${path}` : baseHost;

		return fetch(url, options).then(
			(res) => {
				if (res.ok) return Promise.resolve(res).then(thenHandler);
				else return res.text().then((text) => Promise.reject(text));
			},
			(err) => {
				return Promise.reject(err.toString());
			}
		);
	};
};

const patterns = {
	GET: /^get/i,
	PUT: /^put/i,
	POST: /^post/i,
	DELETE: /^delete/i,
};

/**
 * Takes a string and returns an HTTP verb
 */
export const guessMethod = (name: string) => {
	const matchPattern = Object.entries(patterns).find(([_method, pattern]) =>
		pattern.test(name)
	);
	if (!matchPattern)
		throw new Error(`Could not guess http method from \`${name}\``);
	const [method] = matchPattern;
	return method;
};
