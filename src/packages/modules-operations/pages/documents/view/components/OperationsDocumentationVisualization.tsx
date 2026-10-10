import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { ExternalLink } from "@components/link";
import { Note } from "@components/note";

import { Codelist } from "@model/Codelist";
import { Document } from "@model/operations/document";

import { getBaseURI } from "@sdk/index";

import { getLang } from "@utils/dictionary";
import { formatFileSize } from "@utils/file-size";
import { useTitle } from "@utils/hooks/useTitle";

import { LINK } from "../../../../../constants/documentType";
import { RelationsView } from "../../../../components/RelationsView";
import { isDocument } from "../../../../utils/isDocument";
import { isLink } from "../../../../utils/isLink";

/**
 * Chaque entrée `sims` telle que renvoyée par le back pour un document/lien :
 * une ligne par rubrique liée, à regrouper par sims (`id`) pour l'affichage.
 * Ne correspond pas au modèle `Sims` (métadonnées complètes) : forme propre à
 * cette relation document ↔ sims.
 */
function formatSims(sims: any[]) {
  const simsObject = sims.reduce(
    (acc, s) => {
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
    },
    {} as Record<string, any>,
  );

  return Object.values(simsObject).map((s: any) => {
    return {
      ...s,
      labelLg1: s.labelLg1 + ` (${s.rubrics?.join(", ")})`,
      labelLg2: s.labelLg2 + ` (${s.rubrics?.join(", ")})`,
    };
  });
}

/**
 * Taille affichée à droite du lien de téléchargement. Les lecteurs d'écran prononcent mal « ko » :
 * ils lisent la forme longue (« 130 kilooctets »), la forme courte leur est masquée.
 */
function FileSize({ bytes }: Readonly<{ bytes: number }>) {
  const { short, long } = formatFileSize(bytes, getLang());
  return (
    <span>
      {" "}
      <span aria-hidden="true">({short})</span>
      <span className="sr-only">{long}</span>
    </span>
  );
}

interface OperationsDocumentationVisualizationTypes {
  id?: string;
  attr: Document;
  secondLang: boolean;
  langOptions?: Codelist;
  type?: string;
}

export function OperationsDocumentationVisualization({
  id,
  attr,
  secondLang,
  langOptions,
  type,
}: Readonly<OperationsDocumentationVisualizationTypes>) {
  const { t } = useTranslation();

  useTitle(type === LINK ? t("documents.titleLink") : t("documents.titleDocument"), attr.labelLg1);

  const sims = formatSims(attr.sims!);

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
              <>
                <ExternalLink href={`${baseURI}/documents/document/${id}/file`}>
                  {attr.labelLg1}
                </ExternalLink>
                {attr.size !== undefined && <FileSize bytes={attr.size} />}
              </>
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
        childrenItems={sims}
        childrenTitle="linkedSims"
        childrenPath="sims"
        secondLang={secondLang}
      />
    </>
  );
}
