import { getOidc } from '../auth/create-oidc';

export const generateGenericApiEndpoints = (
	pluralPrefix = '',
	singularPrefix = '',
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
			`${singularPrefix}/${object.id}/validate`,
			{ method: 'PUT' },
			(res: Response) => res.text(),
		],
	};
};

const removeTrailingSlash = (url: string) => url.replace(/\/$/, '');

export const buildApi = <T extends Record<string, any>>(
	context: string,
	api: T,
): Record<keyof T, () => Promise<unknown>> => {
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

export const computeDscr = async (fn: any, [...args]) => {
	const dscr = fn(...args);
	if (!Array.isArray(dscr)) {
		throw new Error(
			'API descr function should return a `string` or an `array`, got ' +
				`\`${dscr}\`.`,
		);
	}
	const [url] = dscr as any;
	let options = dscr[1];
	let thenHandler = dscr[2];
	//We don't deep merge: all nested properties in default options (ie.
	//headers.Accept) are lost. Hence, if a prop option is overriden (ie.
	//headers), all relevant options should be present.
	options = { ...defaultOptions, ...options };
	const oidc = await getOidc();
	if (oidc && oidc.isUserLoggedIn) {
		const { accessToken } = oidc.getTokens();
		options = {
			...options,
			headers: { ...options.headers, Authorization: `Bearer ${accessToken}` },
		};
	}
	thenHandler = thenHandler || defaultThenHandler;
	return [url, options, thenHandler];
};

let saveApiURL = '';
export const getBaseURI = () => {
	if (saveApiURL) return Promise.resolve(saveApiURL);
	return Promise.resolve(import.meta.env.VITE_API_BASE_HOST).then((u) => {
		saveApiURL = u;
		return u;
	});
};

export const buildCall = (context: string, resource: string, fn: any) => {
	return async (...args: any[]) => {
		const [path, options, thenHandler] = await computeDscr(fn, args);
		if (!options.method) {
			options.method = guessMethod(resource);
		}

		const baseURI = await getBaseURI();
		const baseHost = removeTrailingSlash(
			`${baseURI}${context ? `/${context}` : ''}`,
		);

		const url = path !== '' ? `${baseHost}/${path}` : baseHost;

		return fetch(url, options).then(
			(res) => {
				if (res.ok) return Promise.resolve(res).then(thenHandler);
				else
					return res.text().then((text) => {
						try {
							const object = JSON.parse(text);
							return Promise.reject({
								...object,
								status: res.status,
							});
						} catch {
							return Promise.reject({
								message: text,
								status: res.status,
							});
						}
					});
			},
			(err) => {
				return Promise.reject(err.toString());
			},
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
	const matchPattern = Object.entries(patterns).find((config) => {
		const pattern = config[1];
		return pattern.test(name);
	});
	if (!matchPattern)
		throw new Error(`Could not guess http method from \`${name}\``);
	const [method] = matchPattern;
	return method;
};
