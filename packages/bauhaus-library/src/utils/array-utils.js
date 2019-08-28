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
