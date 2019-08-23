import React from 'react';
import defaultFlag from './flags/default.png';
import D from 'js/i18n';

export const isFlag = lang => {
	try {
		require(`./flags/${lang}.png`);
	} catch (e) {
		return false;
	}
	return true;
};

export default lang => {
	if (!lang) return null;
	return (
		<img
			src={isFlag(lang) ? require(`./flags/${lang}.png`) : defaultFlag}
			alt={D.langs}
			className="img-flag"
		/>
	);
};
