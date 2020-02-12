import React from 'react';
import _ from 'lodash';
import D from 'js/i18n';
import { isDateIn } from 'js/utils/moment';

export const arrayToString = array =>
	array.reduce((_, a, i) => {
		if (i === 0) return a;
		return _ + ` - ${a}`;
	}, '');

export const arrayKeepUniqueField = (array, field) =>
	array.map(function(item) {
		return _.deburr(item[field].toLowerCase());
	});

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
			const aUp = _.deburr(a[key]).toLowerCase();
			const bUp = _.deburr(b[key]).toLowerCase();
			return bUp > aUp ? order : bUp === aUp ? 0 : -order;
		});
	};

export const filterKeyDeburr = keys => rawStr => {
	const str = _.deburr(rawStr).toLocaleLowerCase();
	return item => {
		let isIn = false;
		for (var i = 0; i < keys.length; i++) {
			if (_.deburr((item[keys[i]] || '').toLocaleLowerCase()).includes(str)) {
				isIn = true;
				break;
			}
		}
		return isIn;
	};
};

export const filterKeyDate = key => (start, end) => item => {
	return !item[key] || isDateIn(item[key], start, end);
};

export const creatSelectList = max => {
	const result = [];
	for (var i = 1; i <= max; i++) {
		result.push(
			<option value={i} key={i}>
				{i}
			</option>
		);
	}
	return result;
};

export const creatSelectListSelectedLast = max => {
	const result = [];
	for (var i = 1; i < max; i++) {
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
export const getMembers = (linksArray, typeOfLink) => {
	return linksArray
		.filter(link => link.conceptLink === typeOfLink)
		.map(({ idLinked, prefLabelLg1 }) => ({ id: idLinked, prefLabelLg1 }));
};

export const range = (start, end) =>
	Array(end - start)
		.fill()
		.map((_, i) => i + start);

export const nbResults = array =>
	`${array.length} ${array.length > 1 ? D.results : D.result}`;
