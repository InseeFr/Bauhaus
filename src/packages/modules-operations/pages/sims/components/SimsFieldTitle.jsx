import D from "../../../../deprecated-locales/build-dictionary";
import { isEssentialRubricKo } from "../hooks/useEssentialRubricContext";

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
  const isEmpty = isEssentialRubricKo(msd, currentSection, secondLang);
  return <SimsFieldTitleIndicator msd={msd} isEmpty={isEmpty} />;
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
