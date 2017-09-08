import React from 'react';
import _ from 'lodash';
import { isDateIn } from 'js/utils/moment';

export const arrayKeepUniqueField = (array, field) =>
	array.map(function(item) {
		return _.deburr(item[field].toLowerCase());
	});

export const arrayDifferenceByID = (array1, array2) => {
	const diff = _.difference(_.map(array1, 'id'), _.map(array2, 'id'));
	const result = _.filter(array1, function(obj) {
		return diff.indexOf(obj.id) >= 0;
	});
	return result;
};

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

export const filterDeburr = rawStr => {
	const str = _.deburr(rawStr).toLocaleLowerCase();
	return item => _.deburr(item).toLocaleLowerCase().includes(str);
};

//TODO remove other filters that should be built inline when needed with
//`filterKeyDeburr`
export const filterKeyDeburr = key => rawStr => {
	const str = _.deburr(rawStr).toLocaleLowerCase();
	return item => _.deburr(item[key].toLocaleLowerCase()).includes(str);
};

export const filterKeyDate = key => (start, end) => item =>
	isDateIn(item[key], start, end);

export function filterByLabel(filter) {
	return item =>
		_.deburr(item.label).toLowerCase().includes(filter.toLowerCase());
}

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
	return result;
};

//Get members of concept
export const getMembers = (linksArray, typeOfLink) => {
	return linksArray
		.filter(link => link.conceptLink === typeOfLink)
		.map(({ idLinked, prefLabelLg1 }) => ({ id: idLinked, prefLabelLg1 }));
};

export const range = (start, end) =>
	Array(end - start).fill().map((_, i) => i + start);
