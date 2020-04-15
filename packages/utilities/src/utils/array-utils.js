import deburr from 'lodash.deburr';

export const sortArray = key =>
	/**
	 * Sort an array by a given key
	 *
	 * If `desc` is set to true, descending order will be used
	 *
	 * @param   {array}      arr  array of objects with the key given key
	 * @param   {boolean}    desc true if descending order required
	 * @returns {array}           the array sorted by the given key
	 */

	(arr, desc = false) => {
		const order = desc ? 1 : -1;
		return arr.sort((a, b) => {
			const aUp = deburr(a[key]).toLowerCase();
			const bUp = deburr(b[key]).toLowerCase();
			return bUp > aUp ? order : bUp === aUp ? 0 : -order;
		});
	};

export const sortArrayByLabel = sortArray('label');

export const nbResults = (array, many, one) =>
	`${array.length} ${array.length > 1 ? many : one}`;

export const filterKeyDeburr = keys => rawStr => {
	const str = deburr(rawStr).toLocaleLowerCase();
	return item => {
		let isIn = false;
		for (var i = 0; i < keys.length; i++) {
			const value = Array.isArray(item[keys[i]])
				? item[keys[i]].join(',')
				: item[keys[i]];
			if (deburr((value || '').toLocaleLowerCase()).includes(str)) {
				isIn = true;
				break;
			}
		}
		return isIn;
	};
};
