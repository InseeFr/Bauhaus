const SimsBlockText = ({ currentSection, isSecondLang }) => {
	return currentSection[isSecondLang ? 'labelLg2' : 'labelLg1'];
};

export default SimsBlockText;
