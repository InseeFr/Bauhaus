import { useTranslation } from "react-i18next";

import { ExplanatoryNote } from "@components/explanatory-note";
import { Row } from "@components/layout";

interface ClassificationNotes {
  scopeNoteLg1?: string;
  scopeNoteLg2?: string;
  changeNoteLg1?: string;
  changeNoteLg2?: string;
  descriptionLg1?: string;
  descriptionLg2?: string;
}

type Props = Readonly<{
  notes: ClassificationNotes;
  secondLang: boolean;
}>;

export const Notes = ({
  notes: {
    scopeNoteLg1,
    scopeNoteLg2,
    changeNoteLg1,
    changeNoteLg2,
    descriptionLg1,
    descriptionLg2,
  },
  secondLang,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div>
      <span>
        {descriptionLg1 && (
          <Row>
            <ExplanatoryNote
              text={descriptionLg1}
              title={t("classification.description", { lng: "fr" })}
              alone={!secondLang}
              md
            />
            {secondLang && (
              <ExplanatoryNote
                text={descriptionLg2}
                title={t("classification.description", { lng: "en" })}
                alone={false}
                md
              />
            )}
          </Row>
        )}
      </span>
      <span>
        {scopeNoteLg1 && (
          <Row>
            <ExplanatoryNote
              text={scopeNoteLg1}
              title={t("classification.scopeNote", { lng: "fr" })}
              alone={!secondLang}
              md
            />
            {secondLang && (
              <ExplanatoryNote
                text={scopeNoteLg2}
                title={t("classification.scopeNote", { lng: "en" })}
                alone={false}
                md
              />
            )}
          </Row>
        )}
      </span>
      <span>
        {changeNoteLg1 && (
          <Row>
            <ExplanatoryNote
              text={changeNoteLg1}
              title={t("classification.changeNote", { lng: "fr" })}
              alone={!secondLang}
              md
            />
            {secondLang && (
              <ExplanatoryNote
                text={changeNoteLg2}
                title={t("classification.changeNote", { lng: "en" })}
                alone={false}
                md
              />
            )}
          </Row>
        )}
      </span>
    </div>
  );
};
