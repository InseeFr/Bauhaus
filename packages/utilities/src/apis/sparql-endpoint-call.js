import { sortArray } from 'js/utils/array-utils';

const sortArrayByLabel = sortArray('label');

export const getRDFObject = endpoint => query =>
	fetch(`${endpoint}?query=${encodeURIComponent(query)}`, {
		headers: { Accept: 'application/json;charset=utf-8' },
	})
		.then(res => res.json())
		.then(res =>
			Object.entries(res.results.bindings[0]).reduce(
				(_, [key, value]) => ({ ..._, [key]: value.value }),
				{}
			)
		);

export const getRDFList = endpoint => query =>
	fetch(`${endpoint}?query=${encodeURIComponent(query)}`, {
		headers: { Accept: 'application/json;charset=utf-8' },
	})
		.then(res => res.json())
		.then(res =>
			sortArrayByLabel(
				res.results.bindings.map(r =>
					Object.entries(r).reduce(
						(_, [key, value]) => ({ ..._, [key]: value.value }),
						{}
					)
				)
			)
		);
