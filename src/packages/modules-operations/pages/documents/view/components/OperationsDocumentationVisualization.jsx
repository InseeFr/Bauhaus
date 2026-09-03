import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { ExternalLink } from "@components/link";
import { Note } from "@components/note";

import { useTitle } from "@utils/hooks/useTitle";

import { getBaseURI } from "../../../../../sdk";
import { RelationsView } from "../../../../components/RelationsView";
import { LINK } from "../../../../constants/documentType";
import { isDocument } from "../../../../utils/isDocument";
import { isLink } from "../../../../utils/isLink";

function formatSims(sims) {
  const simsObject = sims.reduce((acc, s) => {
    if (acc[s.id]) {
      return {
        ...acc,
        [s.id]: {
          ...acc[s.id],
          rubrics: [...acc[s.id].rubrics, s.simsRubricId],
        },
      };
    } else {
      return {
        ...acc,
        [s.id]: {
          ...s,
          rubrics: [s.simsRubricId],
        },
      };
    }
  }, {});

  return Object.values(simsObject).map((s) => {
    return {
      ...s,
      labelLg1: s.labelLg1 + ` (${s.rubrics?.join(", ")})`,
      labelLg2: s.labelLg2 + ` (${s.rubrics?.join(", ")})`,
    };
  });
}

/**
 * @typedef OperationsDocumentationVisualizationProps
 * @property {any} attr
 * @property {boolean} secondLang
 * @property {{ lg1: string, lg2: string }} langs
 *
 * @param {OperationsDocumentationVisualizationProps} props
 */
export function OperationsDocumentationVisualization({ id, attr, secondLang, langOptions, type }) {
  const { t } = useTranslation();

  useTitle(type === LINK ? t("documents.titleLink") : t("documents.titleDocument"), attr.labelLg1);

  const sims = formatSims(attr.sims);

  const baseURI = getBaseURI();

  return (
    <>
      <Row>
        <Note
          text={attr.descriptionLg1}
          title={t("app.descriptionTitle", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={attr.descriptionLg2}
            title={t("app.descriptionTitle", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      {isDocument(attr) && (
        <Row>
          <Note
            text={attr.updatedDate && new Date(attr.updatedDate).toLocaleDateString()}
            title={t("documents.titleUpdatedDate")}
            alone={true}
            allowEmpty={true}
          />
        </Row>
      )}
      {isDocument(attr) && (
        <Row>
          <Note
            text={
              <ExternalLink href={`${baseURI}/documents/document/${id}/file`}>
                {attr.labelLg1}
              </ExternalLink>
            }
            title={t("documents.titleDocument")}
            alone={true}
            allowEmpty={true}
          />
        </Row>
      )}
      {isLink(attr) && (
        <Row>
          <Note
            text={<ExternalLink href={attr.url}>{attr.url}</ExternalLink>}
            title={t("documents.titleLink")}
            alone={true}
            allowEmpty={true}
          />
        </Row>
      )}
      <Row>
        <Note
          text={langOptions?.codes?.find((option) => option.code === attr.lang)?.labelLg1}
          title={t("app.langTitle", { lng: "fr" })}
          alone={true}
          allowEmpty={true}
        />
      </Row>
      <RelationsView
        children={sims}
        childrenTitle="linkedSims"
        childrenPath="sims"
        secondLang={secondLang}
      />
    </>
  );
}
