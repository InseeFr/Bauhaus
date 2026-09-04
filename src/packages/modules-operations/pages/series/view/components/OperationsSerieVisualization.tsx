import { useTranslation } from "react-i18next";

import { InseeOrganizationNotes } from "@components/business/creators-view";
import { CreationUpdateItems } from "@components/creation-update-items";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { ValidationState } from "@components/status";
import { PublicationStatusItem } from "@components/status/PublicationStatusItem";

import { OperationsLink } from "@model/operations/operations-link";
import { RelatedItem } from "@model/operations/related-item";

import { useTitle } from "@utils/hooks/useTitle";
import { renderMarkdownElement } from "@utils/html-utils";

import { DisplayLinks } from "../../../../components/DisplayLinks";
import { RelationsView } from "../../../../components/RelationsView";
import { SeeAlso } from "../../../../components/SeeAlso";
import { getSeeAlsoByType } from "../../../../utils/getSeeAlsoByType";

/**
 * Série telle que renvoyée par `GET /series/{id}` : les mêmes champs que
 * `Series` (`@model/operations/series`, utilisé par le menu de cette même
 * page) complétés par tous les champs `OPTIONAL` de la requête SPARQL, absents
 * du modèle car non consommés ailleurs. `operations` n'est pas repris
 * strictement du modèle : le back le sérialise tantôt comme un lien
 * (`RelatedItem`), tantôt avec plus de champs selon le contexte d'appel.
 */
export interface SerieDetail {
  id: string;
  creators?: string | string[];
  validationState?: ValidationState;
  idSims?: string;
  operations?: any[];
  prefLabelLg1?: string;
  prefLabelLg2?: string;
  altLabelLg1?: string;
  altLabelLg2?: string;
  abstractLg1?: string;
  abstractLg2?: string;
  historyNoteLg1?: string;
  historyNoteLg2?: string;
  typeCode?: string;
  accrualPeriodicityCode?: string;
  created?: string;
  modified?: string;
  publishers?: ({ id: string } | string)[];
  contributors?: ({ id: string } | string)[];
  dataCollectors?: ({ id: string } | string)[];
  replaces?: OperationsLink[];
  isReplacedBy?: OperationsLink[];
  generate?: OperationsLink[];
  seeAlso?: OperationsLink[];
  family?: RelatedItem;
}

interface OperationsSerieVisualizationTypes {
  attr: SerieDetail;
  secondLang: boolean;
  frequency?: { labelLg1?: string; labelLg2?: string };
  category?: { labelLg1?: string; labelLg2?: string };
}

export function OperationsSerieVisualization({
  attr,
  secondLang,
  frequency = {},
  category = {},
}: Readonly<OperationsSerieVisualizationTypes>) {
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
          text={renderMarkdownElement(attr.abstractLg1 ?? "")}
          title={t("common.summary", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={renderMarkdownElement(attr.abstractLg2 ?? "")}
            title={t("common.summary", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <Row>
        <Note
          text={renderMarkdownElement(attr.historyNoteLg1 ?? "")}
          title={t("common.history", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={renderMarkdownElement(attr.historyNoteLg2 ?? "")}
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
        <InseeOrganizationNotes
          organizations={attr.publishers?.map((p) => (typeof p === "string" ? p : p.id))}
          title={t("common.organization", { lng: "fr" })}
        />
      </Row>
      <Row id="contributors">
        <InseeOrganizationNotes
          organizations={attr.contributors?.map((c) => (typeof c === "string" ? c : c.id))}
          title={t("common.stakeholders", { lng: "fr" })}
        />
      </Row>
      <Row id="dataCollectors">
        <InseeOrganizationNotes
          organizations={attr.dataCollectors?.map((c) => (typeof c === "string" ? c : c.id))}
          title={t("common.dataCollector", { lng: "fr" })}
        />
      </Row>
      <Row id="creators">
        <InseeOrganizationNotes organizations={attr.creators} />
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
