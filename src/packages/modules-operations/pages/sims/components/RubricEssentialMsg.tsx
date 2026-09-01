import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { Note } from "@components/note";

import { useEssentialRubricContext } from "../hooks/useEssentialRubricContext";

export const RubricEssentialMsg = ({ secondLang }: Readonly<{ secondLang: boolean }>) => {
  const { t } = useTranslation();

  const essentialRubricContext = useEssentialRubricContext();

  const numberOfEssantialRubricsKOLg1 = Object.values(essentialRubricContext).filter(
    (rubric: any) => rubric.essentialRubricKoLg1,
  ).length;

  const numberOfEssantialRubricsKOLg2 = Object.values(essentialRubricContext).filter(
    (rubric: any) => rubric.essentialRubricKoLg2,
  ).length;

  const numberOfEssantialRubrics = Object.values(essentialRubricContext).filter(
    (rubric: any) => rubric.minOccurs === "1",
  ).length;

  const numberOfEssantialRubricsOKLg1 = numberOfEssantialRubrics - numberOfEssantialRubricsKOLg1;
  const numberOfEssantialRubricsOKLg2 = numberOfEssantialRubrics - numberOfEssantialRubricsKOLg2;

  const essentialRubricKeyLg1 =
    numberOfEssantialRubricsOKLg1 === 1
      ? "sims.essentialRubricMsg"
      : "sims.essentialRubricMsgPlural";
  const essentialRubricKeyLg2 =
    numberOfEssantialRubricsOKLg2 === 1
      ? "sims.essentialRubricMsg"
      : "sims.essentialRubricMsgPlural";

  return (
    <Row>
      <Note
        text={t(essentialRubricKeyLg1, {
          nb: numberOfEssantialRubricsOKLg1,
          total: numberOfEssantialRubrics,
        })}
        title={t("sims.essentialRubric")}
        alone={!secondLang}
      />
      {secondLang && (
        <Note
          text={t(essentialRubricKeyLg2, {
            nb: numberOfEssantialRubricsOKLg2,
            total: numberOfEssantialRubrics,
            lng: "en",
          })}
          title={t("sims.essentialRubric", { lng: "en" })}
          alone={!secondLang}
        />
      )}
    </Row>
  );
};
