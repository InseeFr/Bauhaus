import React from 'react';
import { DateUtils } from 'bauhaus-utilities';

export const filterKeyDate = key => (start, end) => item => {
	return !item[key] || DateUtils.isDateIn(item[key], start, end);
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
