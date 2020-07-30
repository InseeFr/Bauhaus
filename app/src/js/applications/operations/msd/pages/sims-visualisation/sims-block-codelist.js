import React from 'react';

const SimsBlockCodeList = ({ codesLists, currentSection, multi = false }) => {
	const codes = codesLists[currentSection.codeList].codes;

	if (multi) {
		const value = Array.isArray(currentSection.value)
			? currentSection.value
			: [currentSection.value];
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
