import defaultFlag from './default.png';

export const isFlag = lang => {
	try {
		require(`./${lang}.png`);
	} catch (e) {
		return false;
	}
	return true;
};

export const getFlag = lang =>
	isFlag(lang) ? require(`./${lang}.png`) : defaultFlag;
