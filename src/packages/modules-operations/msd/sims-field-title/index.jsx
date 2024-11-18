import D from '../../../deprecated-locales/build-dictionary';
import { rangeType } from '../../../modules-operations/utils/msd';

const { RICH_TEXT, TEXT, CODE_LIST, ORGANIZATION, GEOGRAPHY } = rangeType;

export const SimsFieldTitle = ({ msd, secondLang, currentSection }) => {
	return (
		<>
			<SimsFieldTitleIndicatorBridge
				msd={msd}
				currentSection={currentSection}
				secondLang={secondLang}
			/>{' '}
			{msd.idMas} - {msd[secondLang ? 'masLabelLg2' : 'masLabelLg1']}
		</>
	);
};

const checkRichText = (richText) => {
	if (richText?.getCurrentContent) {
		return (
			!richText?.getCurrentContent || !richText.getCurrentContent().hasText()
		);
	} else {
		return richText === '' || !richText;
	}
};
export const SimsFieldTitleIndicatorBridge = ({
	msd,
	currentSection,
	secondLang,
}) => {
	let isEmpty;
	if (!currentSection) {
		isEmpty = true;
	} else {
		switch (msd.rangeType) {
			case TEXT:
				isEmpty = !currentSection[secondLang ? 'labelLg2' : 'labelLg1'];
				break;
			case ORGANIZATION:
				isEmpty = !currentSection.value;
				break;
			case Date:
				isEmpty = !currentSection.value;
				break;
			case RICH_TEXT: {
				const richTextValue =
					currentSection[secondLang ? 'labelLg2' : 'labelLg1'];
				isEmpty = checkRichText(richTextValue);
				break;
			}
			case GEOGRAPHY:
				isEmpty = !currentSection.uri;
				break;
			case CODE_LIST: {
				const value = currentSection.value;
				isEmpty = !value || value.length === 0;
				break;
			}
			default:
				isEmpty = !currentSection.value;
		}
	}

	return <SimsFieldTitleIndicator msd={msd} isEmpty={isEmpty} />;
};

export const isEssentialRubricKo = (msd, currentSection, secondLang) => {
	if (!currentSection) {
		return true;
	} else {
		if (secondLang) {
			switch (msd.rangeType) {
				case TEXT:
					return !currentSection?.labelLg2 || currentSection?.labelLg2 === '';
				case RICH_TEXT: {
					const richTextValueLg2 = currentSection.labelLg2;
					return checkRichText(richTextValueLg2);
				}
				default:
					return false;
			}
		}

		switch (msd.rangeType) {
			case TEXT:
				return !currentSection?.labelLg1;
			case ORGANIZATION:
				return !currentSection.value;
			case Date:
				return !currentSection.value;
			case RICH_TEXT: {
				const richTextValueLg1 = currentSection.labelLg1;
				return checkRichText(richTextValueLg1);
			}
			case GEOGRAPHY:
				return !currentSection.uri;
			case CODE_LIST: {
				const value = currentSection.value;
				return !value || value.length === 0;
			}
			default:
				return !currentSection.value;
		}
	}
};

export const SimsFieldTitleIndicator = ({ msd, isEmpty }) => {
	if (msd.minOccurs !== '1') {
		return <></>;
	}

	if (isEmpty) {
		return (
			<span aria-label={D.essentialRubricKo} title={D.essentialRubricKo}>
				⚠️
			</span>
		);
	}

	return (
		<span aria-label={D.essentialRubricOk} title={D.essentialRubricOk}>
			✅
		</span>
	);
};
