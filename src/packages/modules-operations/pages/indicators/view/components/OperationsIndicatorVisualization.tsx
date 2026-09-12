import { useTranslation } from "react-i18next";

import { InseeOrganizationNotes } from "@components/business/creators-view";
import { CreationUpdateItems } from "@components/creation-update-items";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationStatusItem } from "@components/status/PublicationStatusItem";

import { Code } from "@model/Codelist";
import { Indicator } from "@model/operations/indicator";

import { useTitle } from "@utils/hooks/useTitle";
import { renderMarkdownElement } from "@utils/html-utils";

import { DisplayLinks } from "../../../../components/DisplayLinks";
import { SeeAlso } from "../../../../components/SeeAlso";
import { getSeeAlsoByType } from "../../../../utils/getSeeAlsoByType";

interface DisplayMultiLangNoteTypes {
  value1?: string;
  value2?: string;
  title1: string;
  title2: string;
  secondLang?: boolean;
  md?: boolean;
}

function DisplayMultiLangNote({
  value1,
  value2,
  title1,
  title2,
  secondLang,
  md = false,
}: Readonly<DisplayMultiLangNoteTypes>) {
  const body1 = md ? renderMarkdownElement(value1 as string) : value1;

  const body2 = md ? renderMarkdownElement(value2 as string) : value2;

  return (
    <Row>
      <Note text={body1} title={title1} alone={!secondLang} allowEmpty={true} />
      {secondLang && <Note text={body2} title={title2} alone={false} allowEmpty={true} />}
    </Row>
  );
}

interface OperationsIndicatorVisualizationTypes {
  attr: Indicator;
  secondLang?: boolean;
  frequency?: Partial<Code>;
}

export function OperationsIndicatorVisualization({
  attr,
  secondLang,
  frequency = {},
}: Readonly<OperationsIndicatorVisualizationTypes>) {
  const { t } = useTranslation();

  useTitle(t("common.indicatorsTitle"), attr?.prefLabelLg1);

  const seeAlso = getSeeAlsoByType(attr.seeAlso);

  return (
    <>
      <Row>
        <Note
          text={
            <ul>
              <CreationUpdateItems creation={attr.created} update={attr.modified} />
              <PublicationStatusItem
                label={t("common.indicatorStatus", { lng: "fr" })}
                object={attr}
              />
            </ul>
          }
          title={t("app.globalInformationsTitle", { lng: "fr" })}
          alone={true}
        />
      </Row>
      <DisplayMultiLangNote
        value1={attr.altLabelLg1}
        value2={attr.altLabelLg2}
        title1={t("app.altLabel", { lng: "fr" })}
        title2={t("app.altLabel", { lng: "en" })}
        secondLang={secondLang}
      />
      <DisplayMultiLangNote
        value1={attr.abstractLg1}
        value2={attr.abstractLg2}
        title1={t("common.summary", { lng: "fr" })}
        title2={t("common.summary", { lng: "en" })}
        secondLang={secondLang}
        md
      />
      <DisplayMultiLangNote
        value1={attr.historyNoteLg1}
        value2={attr.historyNoteLg2}
        title1={t("common.history", { lng: "fr" })}
        title2={t("common.history", { lng: "en" })}
        secondLang={secondLang}
      />
      <DisplayMultiLangNote
        value1={frequency.labelLg1}
        value2={frequency.labelLg2}
        title1={t("common.indicatorDataCollectFrequency", { lng: "fr" })}
        title2={t("common.indicatorDataCollectFrequency", { lng: "en" })}
        secondLang={secondLang}
      />
      <Row>
        <InseeOrganizationNotes
          organizations={attr.publishers}
          title={t("common.organization", { lng: "fr" })}
        />
      </Row>
      <Row>
        <InseeOrganizationNotes organizations={attr.creators} />
      </Row>
      <Row id="contributors">
        <InseeOrganizationNotes
          organizations={attr.contributors}
          title={t("common.stakeholders", { lng: "fr" })}
        />
      </Row>
      <DisplayLinks
        links={attr.replaces}
        path="/operations/indicator/"
        title="replaces"
        secondLang={secondLang}
      />
      <DisplayLinks
        links={attr.isReplacedBy}
        path="/operations/indicator/"
        title="replacedByMasc"
        secondLang={secondLang}
      />
      <DisplayLinks
        links={attr.wasGeneratedBy}
        path="/operations/series/"
        title="generatedBy"
        secondLang={secondLang}
      />
      <SeeAlso links={seeAlso} secondLang={secondLang} />
    </>
  );
}
