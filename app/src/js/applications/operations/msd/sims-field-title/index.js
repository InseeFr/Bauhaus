import D from '../../../../i18n/build-dictionary';
import React from 'react';
import { rangeType } from 'js/utils/msd/';
const { RICH_TEXT, TEXT, CODE_LIST, ORGANIZATION, GEOGRAPHY } = rangeType;

export const SimsFieldTitle = ({ msd, secondLang, currentSection }) => {
	return (
		<>
			<SimsFieldTitleIndicatorBridge msd={msd} currentSection={currentSection} secondLang={secondLang} /> {msd.idMas} - {msd[secondLang ? 'masLabelLg2' : 'masLabelLg1']}
		</>
	)
}


export const SimsFieldTitleIndicatorBridge = ({ msd, currentSection, secondLang }) => {
	let isEmpty;
	if(!currentSection){
		isEmpty = true;
	} else {
		switch (msd.rangeType){
			case TEXT:
				isEmpty = !currentSection[secondLang ? 'labelLg2' : 'labelLg1'];
				break;
			case ORGANIZATION:
				isEmpty = !currentSection.value
				break;
			case Date:
				isEmpty = !currentSection.value
				break;
			case RICH_TEXT:
				const richTextValue = currentSection[secondLang ? 'labelLg2' : 'labelLg1']
				isEmpty = !richTextValue?.getCurrentContent || !richTextValue.getCurrentContent().hasText();
				break;
			case GEOGRAPHY:
				isEmpty = !currentSection.uri
				break;
			case CODE_LIST:
				const value = currentSection.value;
				isEmpty = !value || value.length === 0
				break;
			default:
				isEmpty = !currentSection.value
		}
	}


	return <SimsFieldTitleIndicator msd={msd} isEmpty={isEmpty} />
}

export const isEssentialRubricOk = (msd, currentSection) => {
	let isEmpty;
	if(!currentSection){
		isEmpty = true;
	} else {
		switch (msd.rangeType){
			case TEXT:
				isEmpty = !currentSection?.labelLg2 || !currentSection?.labelLg1;
				break;
			case ORGANIZATION:
				isEmpty = !currentSection.value
				break;
			case Date:
				isEmpty = !currentSection.value
				break;
			case RICH_TEXT:
				const richTextValueLg1 = currentSection.labelLg1;
				const richTextValueLg2 = currentSection.labelLg2;
				isEmpty = !richTextValueLg1?.getCurrentContent || !richTextValueLg1.getCurrentContent().hasText()  || !richTextValueLg2?.getCurrentContent || !richTextValueLg2.getCurrentContent().hasText();
				break;
			case GEOGRAPHY:
				isEmpty = !currentSection.uri
				break;
			case CODE_LIST:
				const value = currentSection.value;
				isEmpty = !value || value.length === 0
				break;
			default:
				isEmpty = !currentSection.value
		}
	}
	return isEmpty;
}

export const SimsFieldTitleIndicator = ({ msd, isEmpty }) => {
	if(msd.minOccurs !== "1"){
		return <></>
	}

	if(isEmpty){
		return (<span ariaLabel={D.essentialRubricKo} title={D.essentialRubricKo}>⚠️</span>)
	}

	return (<span ariaLabel={D.essentialRubricOk} title={D.essentialRubricOk}>✅</span>)

}
