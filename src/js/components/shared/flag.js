import React from 'react';
import defaultFlag from 'img/flags/default.png';

const isFlag = lang => {
	try {
		require(`img/flags/${lang}.png`);
	} catch (e) {
		return false;
	}
	return true;
};

export default lang => {
	return (
		<img
			src={isFlag(lang) ? require(`img/flags/${lang}.png`) : defaultFlag}
			alt={lang}
			className="img-flag"
		/>
	);
};
