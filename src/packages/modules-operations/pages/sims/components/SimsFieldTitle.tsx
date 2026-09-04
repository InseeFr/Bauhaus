import { useTranslation } from "react-i18next";

import { isEssentialRubricKo } from "../hooks/useEssentialRubricContext";

interface SimsFieldTitleTypes {
  msd: any;
  secondLang?: boolean;
  currentSection: any;
}

export const SimsFieldTitle = ({
  msd,
  secondLang = false,
  currentSection,
}: Readonly<SimsFieldTitleTypes>) => {
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

interface SimsFieldTitleIndicatorBridgeTypes {
  msd: any;
  currentSection: any;
  secondLang?: boolean;
}

export const SimsFieldTitleIndicatorBridge = ({
  msd,
  currentSection,
  secondLang = false,
}: Readonly<SimsFieldTitleIndicatorBridgeTypes>) => {
  const isEmpty = isEssentialRubricKo(msd, currentSection, secondLang);

  return <SimsFieldTitleIndicator msd={msd} isEmpty={isEmpty} />;
};

interface SimsFieldTitleIndicatorTypes {
  msd: any;
  isEmpty: boolean;
}

export const SimsFieldTitleIndicator = ({
  msd,
  isEmpty,
}: Readonly<SimsFieldTitleIndicatorTypes>) => {
  const { t } = useTranslation();

  if (msd.minOccurs !== "1") {
    return null;
  }

  if (isEmpty) {
    return (
      <span aria-label={t("sims.essentialRubricKo")} title={t("sims.essentialRubricKo")}>
        ⚠️
      </span>
    );
  }

  return (
    <span aria-label={t("sims.essentialRubricOk")} title={t("sims.essentialRubricOk")}>
      ✅
    </span>
  );
};
