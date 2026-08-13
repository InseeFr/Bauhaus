import { CreationUpdateItems } from "@components/creation-update-items";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationStatusItem } from "@components/status";

import { useTitle } from "@utils/hooks/useTitle";
import { renderMarkdownElement } from "@utils/html-utils";

import { useTranslation } from "react-i18next";

import { DisplayLinks } from "../../../../components/DisplayLinks";
import { getSeeAlsoByType } from "../../../../utils/getSeeAlsoByType";
import { SeeAlso } from "../../../../components/SeeAlso";
import { InseeOrganisationNotes } from "@components/business/creators-view";

function DisplayMultiLangNote({ value1, value2, title1, title2, secondLang, md = false }) {
  const body1 = md ? renderMarkdownElement(value1) : value1;

  const body2 = md ? renderMarkdownElement(value2) : value2;

  return (
    <Row>
      <Note text={body1} title={title1} alone={!secondLang} allowEmpty={true} />
      {secondLang && <Note text={body2} title={title2} alone={false} allowEmpty={true} />}
    </Row>
  );
}

export function OperationsIndicatorVisualization({ attr, secondLang, frequency = {} }) {
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
              <PublicationStatusItem label={t("common.indicatorStatus", { lng: "fr" })} object={attr} />
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
        <InseeOrganisationNotes organisations={attr.publishers} title={t("common.organisation", { lng: "fr" })} />
      </Row>
      <Row>
        <InseeOrganisationNotes organisations={attr.creators} />
      </Row>
      <Row id="contributors">
        <InseeOrganisationNotes organisations={attr.contributors} title={t("common.stakeholders", { lng: "fr" })} />
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
