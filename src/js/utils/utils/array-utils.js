export const sortArray =
	(key) =>
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
			const aUp = (a[key] ?? '')
				.toLowerCase()
				.normalize('NFD')
				.replace(/\p{Diacritic}/gu, '');
			const bUp = (b[key] ?? '')
				.toLowerCase()
				.normalize('NFD')
				.replace(/\p{Diacritic}/gu, '');
			return bUp > aUp ? order : bUp === aUp ? 0 : -order;
		});
	};

export const sortArrayByLabel = sortArray('label');

export const nbResults = (array, many, one) =>
	`${array.length} ${array.length > 1 ? many : one}`;

export const filterKeyDeburr = (keys) => (rawStr) => {
	function getValue(item, key) {
		if (!key.includes('.')) {
			if (Array.isArray(item)) {
				return item.map((i) => i[key]);
			}
			return item[key];
		}
		const [first, ...rest] = key.split('.');
		return getValue(item[first], rest.join('.'));
	}

	const str = (rawStr ?? '')
		.toLocaleLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '');
	return (item) => {
		let isIn = false;
		for (var i = 0; i < keys.length; i++) {
			const key = keys[i];
			const value = getValue(item, key);
			const formattedValue = Array.isArray(value) ? value.join(',') : value;
			if (
				(formattedValue || '')
					.toLocaleLowerCase()
					.normalize('NFD')
					.replace(/\p{Diacritic}/gu, '')
					.includes(str)
			) {
				isIn = true;
				break;
			}
		}
		return isIn;
	};
};

export const arrayToString = (array) =>
	array.reduce((_, a, i) => {
		if (i === 0) return a;
		return _ + ` - ${a}`;
	}, '');

export const arrayKeepUniqueField = (array, field) =>
	array.map((item) =>
		(item[field] ?? '')
			.toLowerCase()
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
	);

export const range = (start, end) =>
	Array(end - start)
		.fill()
		.map((_, i) => i + start);
