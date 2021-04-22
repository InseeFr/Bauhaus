import React from 'react';

const SimsBlockCodeList = ({ codesLists, currentSection, multi = false }) => {
	const codes = codesLists[currentSection.codeList].codes;

	if (multi) {
		const value = Array.isArray(currentSection.value)
			? currentSection.value
			: [currentSection.value];

		// If the list of codes only contain one item, we do not display a list
		if(value.length === 1){
			return <>{codes.find(({code}) => code === value[0])?.labelLg1}</>
		}
		return (
			<ul>
				{codes
					.filter(({ code }) => value.includes(code))
					.map((code, index) => (
						<li key={index}>{code.labelLg1}</li>
					))}
			</ul>
		);
	}
	return <>{codes.find(code => code.code === currentSection.value).labelLg1}</>;
};

export default SimsBlockCodeList;
