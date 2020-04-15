import React from 'react';
import deburr from 'lodash/deburr';
import { isDateIn } from 'js/utils/moment';

export const arrayToString = array =>
	array.reduce((_, a, i) => {
		if (i === 0) return a;
		return _ + ` - ${a}`;
	}, '');

export const arrayKeepUniqueField = (array, field) =>
	array.map(function(item) {
		return deburr(item[field].toLowerCase());
	});

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
