import { useTranslation } from "react-i18next";

import { ExplanatoryNote } from "@components/explanatory-note";
import { Row } from "@components/layout";

import { componentsI18n } from "../i18n";

interface NoteVizualizationTypes {
  params: any[];
  secondLang: boolean;
  md?: boolean;
}

export const NoteVisualization = ({ params, secondLang, md }: Readonly<NoteVizualizationTypes>) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  return params
    .filter((note) => !!note.lg1)
    .map((note: any, i) => (
      <Row key={`note-visualization-${i}`}>
        <ExplanatoryNote
          text={note.lg1}
          title={t(note.title, { lng: "fr" })}
          alone={!secondLang}
          md={md}
        />
        {secondLang && (
          <ExplanatoryNote
            text={note.lg2}
            title={t(note.title, { lng: "en" })}
            alone={false}
            md={md}
          />
        )}
      </Row>
    ));
};
