import React from 'react';
import defaultFlag from 'img/flags/default.png';
import D from 'js/i18n';

export const isFlag = lang => {
	try {
		require(`img/flags/${lang}.png`);
	} catch (e) {
		return false;
	}
	return true;
};

export default lang => {
	if (!lang) return null;
	return (
		<img
			src={isFlag(lang) ? require(`img/flags/${lang}.png`) : defaultFlag}
			alt={D.langs}
			className="img-flag"
		/>
	);
};
