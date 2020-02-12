import _ from 'lodash';

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

export const nbResults = (array, dictionnary) => {
	const { result, results } = dictionnary;
	return `${array.length} ${array.length > 1 ? results : result}`;
};

export const arrayDifferenceByID = (array1, array2) => {
	const diff = _.difference(_.map(array1, 'id'), _.map(array2, 'id'));
	const result = _.filter(array1, function(obj) {
		return diff.indexOf(obj.id) >= 0;
	});
	return result;
};

export const filterDeburr = rawStr => {
	const str = _.deburr(rawStr).toLocaleLowerCase();
	return item =>
		_.deburr(item)
			.toLocaleLowerCase()
			.includes(str);
};
