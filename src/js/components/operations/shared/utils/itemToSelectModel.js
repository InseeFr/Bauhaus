import { sortArray } from 'js/utils/array-utils';

const sortByLabel = sortArray('label');

export function toSelectModel(items, type) {
	return items.map(item => {
		return {
			...item,
			value: item.id,
			label: item.label,
			type,
		};
	});
}

export function mergedItemsToSelectModels(...items) {
	return sortByLabel(
		items.reduce((acc, values) => [...acc, ...values], [])
	).map(elt => {
		return {
			...elt,
			label: `${elt.type} - ${elt.label}`,
		};
	});
}
