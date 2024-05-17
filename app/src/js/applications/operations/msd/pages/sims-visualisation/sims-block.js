import React from 'react';
import { rangeType } from 'js/utils/msd/';

import SimsBlockText from './sims-block-text';
import SimsBlockDate from './sims-block-date';
import SimsBlockRichText from './sims-block-richtext';
import SimsBlockCodeList from './sims-block-codelist';
import SimsBlockOrganisation from './sims-block-organisation';
import SimsBlockGeography from './sims-block-geography';

const { RICH_TEXT, TEXT, DATE, CODE_LIST, ORGANIZATION, GEOGRAPHY } = rangeType;

const SimsBlock = ({
	msd,
	isSecondLang = false,
	currentSection = {},
	unbounded = false,
	codesLists,
	organisations,
}) => {
	if (!msd.masLabelLg1) {
		return null;
	}
	return (
		!msd.isPresentational && (
			<>
				{currentSection.rangeType === TEXT && (
					<SimsBlockText
						currentSection={currentSection}
						isSecondLang={isSecondLang}
					/>
				)}
				{currentSection.value && currentSection.rangeType === DATE && (
					<SimsBlockDate currentSection={currentSection} />
				)}
				{currentSection.rangeType === RICH_TEXT && (
					<SimsBlockRichText
						currentSection={currentSection}
						isSecondLang={isSecondLang}
					/>
				)}
				{currentSection.rangeType === CODE_LIST &&
					codesLists[currentSection.codeList] && (
						<SimsBlockCodeList
							codesLists={codesLists}
							currentSection={currentSection}
							multi={unbounded}
							isSecondLang={isSecondLang}
						/>
					)}
				{currentSection.rangeType === ORGANIZATION && (
					<SimsBlockOrganisation
						organisations={organisations}
						currentSection={currentSection}
						isSecondLang={isSecondLang}
					/>
				)}
				{currentSection.rangeType === GEOGRAPHY && (
					<SimsBlockGeography
						currentSection={currentSection}
						isSecondLang={isSecondLang}
					/>
				)}
			</>
		)
	);
};

export default SimsBlock;
