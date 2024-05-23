import React from 'react';

const SimsBlockGeography = ({ currentSection, isSecondLang }) => {
	return (
		<>{isSecondLang ? currentSection.labelLg2 : currentSection.labelLg1}</>
	);
};
export default SimsBlockGeography;
