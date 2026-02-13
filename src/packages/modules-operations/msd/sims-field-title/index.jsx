import { memo } from "react";
import D from "../../../deprecated-locales/build-dictionary";
import { rangeType } from "../../utils/msd";

const { RICH_TEXT, TEXT, CODE_LIST, ORGANIZATION, GEOGRAPHY, DATE } = rangeType;

const getLabelKey = (secondLang) => (secondLang ? "labelLg2" : "labelLg1");

const checkRichText = (richText) => {
  if (richText?.getCurrentContent) {
    return !richText.getCurrentContent().hasText();
  }
  return !richText;
};

const checkIsEmpty = (msd, currentSection, secondLang) => {
  if (!currentSection) {
    return true;
  }

  const labelKey = getLabelKey(secondLang);

  switch (msd.rangeType) {
    case TEXT:
      return !currentSection[labelKey];
    case RICH_TEXT:
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

const SimsFieldTitleComponent = ({ msd, secondLang, currentSection }) => {
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

export const SimsFieldTitle = memo(SimsFieldTitleComponent);

export const SimsFieldTitleIndicatorBridge = ({ msd, currentSection, secondLang }) => {
  const isEmpty = checkIsEmpty(msd, currentSection, secondLang);
  return <SimsFieldTitleIndicator msd={msd} isEmpty={isEmpty} />;
};

export const isEssentialRubricKo = (msd, currentSection, secondLang) => {
  if (!currentSection) {
    return true;
  }

  if (secondLang) {
    switch (msd.rangeType) {
      case TEXT:
        return !currentSection.labelLg2;
      case RICH_TEXT:
        return checkRichText(currentSection.labelLg2);
      default:
        return false;
    }
  }

  return checkIsEmpty(msd, currentSection, false);
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
