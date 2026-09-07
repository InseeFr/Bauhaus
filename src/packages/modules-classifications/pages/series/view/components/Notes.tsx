import { useTranslation } from "react-i18next";

import { ExplanatoryNote } from "@components/explanatory-note";
import { Row } from "@components/layout";

interface SeriesNotes {
  scopeNoteLg1?: string;
  scopeNoteLg2?: string;
}

type Props = Readonly<{
  notes: SeriesNotes;
  secondLang: boolean;
}>;

export const Notes = ({ notes: { scopeNoteLg1, scopeNoteLg2 }, secondLang }: Props) => {
  const { t } = useTranslation();

  return (
    <div>
      {scopeNoteLg1 && (
        <Row>
          <ExplanatoryNote
            text={scopeNoteLg1}
            title={t("serie.scopeNote", { lng: "fr" })}
            alone={!secondLang}
          />
          {secondLang && (
            <ExplanatoryNote
              text={scopeNoteLg2}
              title={t("serie.scopeNote", { lng: "en" })}
              alone={false}
            />
          )}
        </Row>
      )}
    </div>
  );
};
