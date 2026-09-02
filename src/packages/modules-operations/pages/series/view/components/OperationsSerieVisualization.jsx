import { useTranslation } from "react-i18next";

import { InseeOrganisationNotes } from "@components/business/creators-view";
import { CreationUpdateItems } from "@components/creation-update-items";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationStatusItem } from "@components/status/PublicationStatusItem";

import { useTitle } from "@utils/hooks/useTitle";
import { renderMarkdownElement } from "@utils/html-utils";

import { DisplayLinks } from "../../../../components/DisplayLinks";
import { RelationsView } from "../../../../components/RelationsView";
import { SeeAlso } from "../../../../components/SeeAlso";
import { getSeeAlsoByType } from "../../../../utils/getSeeAlsoByType";

export function OperationsSerieVisualization({ attr, secondLang, frequency = {}, category = {} }) {
  const { t } = useTranslation();

  useTitle(t("common.seriesTitle") + " - " + t("common.operationsTitle"), attr?.prefLabelLg1);

  const seeAlso = getSeeAlsoByType(attr.seeAlso);

  return (
    <>
      <Row>
        <Note
          text={
            <ul>
              <CreationUpdateItems creation={attr.created} update={attr.modified} />
              <PublicationStatusItem
                label={t("common.seriesStatus", { lng: "fr" })}
                object={attr}
                gender="female"
              />
            </ul>
          }
          title={t("app.globalInformationsTitle", { lng: "fr" })}
          alone={true}
        />
      </Row>
      <Row>
        <Note
          text={attr.altLabelLg1}
          title={t("app.altLabel", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={attr.altLabelLg2}
            title={t("app.altLabel", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <Row>
        <Note
          text={renderMarkdownElement(attr.abstractLg1)}
          title={t("common.summary", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={renderMarkdownElement(attr.abstractLg2)}
            title={t("common.summary", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <Row>
        <Note
          text={renderMarkdownElement(attr.historyNoteLg1)}
          title={t("common.history", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={renderMarkdownElement(attr.historyNoteLg2)}
            title={t("common.history", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <Row>
        <Note
          text={category.labelLg1}
          title={t("common.operationType", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={category.labelLg2}
            title={t("common.operationType", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <Row>
        <Note
          text={frequency.labelLg1}
          title={t("common.dataCollectFrequency", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={frequency.labelLg2}
            title={t("common.dataCollectFrequency", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <Row id="publishers">
        <InseeOrganisationNotes
          organisations={attr.publishers?.map((p) => p?.id ?? p)}
          title={t("common.organisation", { lng: "fr" })}
        />
      </Row>
      <Row id="contributors">
        <InseeOrganisationNotes
          organisations={attr.contributors?.map((c) => c?.id ?? c)}
          title={t("common.stakeholders", { lng: "fr" })}
        />
      </Row>
      <Row id="dataCollectors">
        <InseeOrganisationNotes
          organisations={attr.dataCollectors?.map((c) => c?.id ?? c)}
          title={t("common.dataCollector", { lng: "fr" })}
        />
      </Row>
      <Row id="creators">
        <InseeOrganisationNotes organisations={attr.creators} />
      </Row>
      <DisplayLinks
        links={attr.replaces}
        path="/operations/series/"
        title="replaces"
        secondLang={secondLang}
      />
      <DisplayLinks
        links={attr.isReplacedBy}
        path="/operations/series/"
        title="replacedBy"
        secondLang={secondLang}
      />
      <DisplayLinks
        links={attr.generate}
        path="/operations/indicator/"
        title="indicators"
        secondLang={secondLang}
      />
      <SeeAlso links={seeAlso} secondLang={secondLang} />
      <RelationsView
        children={attr.operations}
        childrenTitle="childrenOperations"
        childrenPath="operation"
        parent={attr.family}
        parentTitle="parentFamily"
        parentPath="family"
        secondLang={secondLang}
      />
    </>
  );
}
