import { isDateIn } from './date-utils';

/**
 * This is function is used to manage old version of our data. The main case
 * is to manage the change to multi-contributors value for all Bauhaus components.
 * @param value
 */
export const convertToArrayIfDefined = (
	value: string | string[]
): string[] | undefined => {
	if (!value) return;
	return Array.isArray(value) ? value : [value];
};

export const filterKeyDate =
	(key: string) =>
	(start: Date | string, end: Date | string) =>
	(item: any) => {
		return !item[key] || isDateIn(item[key], start, end);
	};

export const creatSelectList = (max: number) => {
	const result = [];
	for (let i = 1; i <= max; i++) {
		result.push(
			<option value={i} key={i}>
				{i}
			</option>
		);
	}
	return result;
};

export const creatSelectListSelectedLast = (max: number) => {
	const result = [];
	for (let i = 1; i < max; i++) {
		result.push(
			<option value={i} key={i}>
				{i}
			</option>
		);
	}
	result.push(
		<option value={max} key={max}>
			{max}
		</option>
	);
	return max === 0 ? null : result;
};

//Get members of concept
export const getMembers = (linksArray: any[], typeOfLink: string) => {
	return linksArray
		.filter((link) => link.conceptLink === typeOfLink)
		.map(({ idLinked, prefLabelLg1 }) => ({ id: idLinked, prefLabelLg1 }));
};

export const sortArray =
	(key: string) =>
	/**
	 * Sort an array by a given key
	 *
	 * If `desc` is set to true, descending order will be used
	 *
	 * @param   {array}      arr  array of objects with the key given key
	 * @param   {boolean}    desc true if descending order required
	 * @returns {array}           the array sorted by the given key
	 */

	(arr: any[], desc = false) => {
		const order = desc ? 1 : -1;
		return arr.sort((a: any, b: any) => {
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

export const nbResults = (array: any[], many?: any, one?: any) =>
	`${array.length} ${array.length > 1 ? many : one}`;

export const filterKeyDeburr = (keys: any) => (rawStr: string) => {
	function getValue(item: any, key: string): any {
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
	return (item: any) => {
		let isIn = false;
		for (let i = 0; i < keys.length; i++) {
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

export const arrayToString = (array: any[]) =>
	array.reduce((_, a, i) => {
		if (i === 0) return a;
		return _ + ` - ${a}`;
	}, '');

export const arrayKeepUniqueField = (array: any[], field: string) =>
	array.map((item) =>
		(item[field] ?? '')
			.toLowerCase()
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
	);

export const range = (start: number, end: number) =>
	Array(end - start)
		.fill(0)
		.map((_, i) => i + start);
