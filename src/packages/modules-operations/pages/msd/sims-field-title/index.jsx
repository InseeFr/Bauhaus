import D from "../../../../deprecated-locales/build-dictionary";
import { rangeType } from "../../../utils/rangeType";

const { RICH_TEXT, TEXT, CODE_LIST, ORGANIZATION, GEOGRAPHY, DATE } = rangeType;

const getLabelKey = (secondLang) => (secondLang ? "labelLg2" : "labelLg1");
const getDocumentsKey = (secondLang) => (secondLang ? "documentsLg2" : "documentsLg1");

const checkRichText = (richText) => {
  if (richText?.getCurrentContent) {
    return !richText.getCurrentContent().hasText();
  }
  return !richText;
};

const hasDocuments = (currentSection, secondLang) =>
  currentSection?.[getDocumentsKey(secondLang)]?.length > 0;

const checkIsEmpty = (msd, currentSection, secondLang) => {
  if (!currentSection) {
    return true;
  }

  const labelKey = getLabelKey(secondLang);

  switch (msd.rangeType) {
    case TEXT:
      return !currentSection[labelKey];
    case RICH_TEXT:
      if (hasDocuments(currentSection, secondLang)) {
        return false;
      }
      return checkRichText(currentSection[labelKey]);
    case ORGANIZATION:
    case DATE:
      return !currentSection.value;
    case GEOGRAPHY:
      return !currentSection.uri;
    case CODE_LIST:
      return !currentSection.value || currentSection.value.length === 0;
    default:
      return !currentSection.value;
  }
};

export const SimsFieldTitle = ({ msd, secondLang, currentSection }) => {
  const labelKey = secondLang ? "masLabelLg2" : "masLabelLg1";

  return (
    <>
      <SimsFieldTitleIndicatorBridge
        msd={msd}
        currentSection={currentSection}
        secondLang={secondLang}
      />{" "}
      {msd.idMas} - {msd[labelKey]}
    </>
  );
};

export const SimsFieldTitleIndicatorBridge = ({ msd, currentSection, secondLang }) => {
  const isEmpty = checkIsEmpty(msd, currentSection, secondLang);
  return <SimsFieldTitleIndicator msd={msd} isEmpty={isEmpty} />;
};

export const isEssentialRubricKo = (msd, currentSection, secondLang) => {
  if (!currentSection) {
    return true;
  }

  return checkIsEmpty(msd, currentSection, secondLang);
};

export const SimsFieldTitleIndicator = ({ msd, isEmpty }) => {
  if (msd.minOccurs !== "1") {
    return null;
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
