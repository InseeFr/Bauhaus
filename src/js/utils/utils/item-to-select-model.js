import { sortArrayByLabel } from './array-utils';

/**
 * Return the representation needed by the react-select model
 * The type is used later when we need to merge indicators and series for the same
 * select input
 */
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

/**
 * Return the merge of two react-select models, after sorting by label
 * In order to see the type of the item, the label is prepend by the type
 */
export function mergedItemsToSelectModels(...items) {
	return sortArrayByLabel(
		items.reduce((acc, values) => [...acc, ...values], [])
	).map(elt => {
		return {
			...elt,
			label: `${elt.type} - ${elt.label}`,
		};
	});
}
