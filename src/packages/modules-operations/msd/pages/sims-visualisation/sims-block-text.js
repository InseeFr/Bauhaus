const SimsBlockText = ({ currentSection, isSecondLang }) => {
	const content = currentSection[isSecondLang ? 'labelLg2' : 'labelLg1'];
	return content || '';
};

export default SimsBlockText;
