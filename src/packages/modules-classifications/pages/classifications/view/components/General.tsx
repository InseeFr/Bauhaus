import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { InseeOrganization } from "@components/business/organizations/organizations";
import { getDisseminationStatus } from "@components/dissemination-status/disseminationStatus";
import { Row } from "@components/layout";
import { ExternalLink } from "@components/link";
import { Note } from "@components/note";
import { ValidationState } from "@components/status";
import { PublicationStatusItem } from "@components/status/PublicationStatusItem";

import { stringToDate } from "@utils/date-utils";
import { renderMarkdownElement } from "@utils/html-utils";

import { Classification } from "../../../../types";

/**
 * Champs dont la valeur est un libellé cliquable vers une autre fiche : le lien
 * cible l'identifiant porté par `idKey`, et la seconde langue s'affiche entre
 * parenthèses.
 */
const LINKED_FIELDS: Record<string, { idKey: string; basePath: string; lg2Key: string }> = {
  seriesLg1: {
    idKey: "idSeries",
    basePath: "/classifications/series",
    lg2Key: "seriesLg2",
  },
  afterLg1: {
    idKey: "idAfter",
    basePath: "/classifications/classification",
    lg2Key: "afterLg2",
  },
  beforeLg1: {
    idKey: "idBefore",
    basePath: "/classifications/classification",
    lg2Key: "beforeLg2",
  },
  variantLg1: {
    idKey: "idVariant",
    basePath: "/classifications/classification",
    lg2Key: "variantLg2",
  },
};

const MATERIAL_FIELDS = new Set(["additionalMaterial", "legalMaterial"]);
const DATE_FIELDS = new Set(["issued", "valid", "lastRefreshedOn"]);
const ORGANISATION_FIELDS = new Set(["creator", "contributor"]);

const LinkedField = ({
  label,
  to,
  labelLg1,
  labelLg2,
}: Readonly<{
  label: string;
  to: string;
  labelLg1: string;
  labelLg2?: string;
}>) => (
  <li>
    {label} : <Link to={to}>{labelLg1}</Link>
    {labelLg2 && (
      <span>
        {" ("}
        <Link to={to}>{labelLg2}</Link>
        {")"}
      </span>
    )}
  </li>
);

const GeneralField = ({
  fieldName,
  label,
  general,
  secondLang,
}: Readonly<{
  fieldName: string;
  label: string;
  general: Classification;
  secondLang: boolean;
}>) => {
  const value = (general as any)[fieldName];
  if (!Object.hasOwn(general, fieldName) || !value) {
    return null;
  }

  const linked = LINKED_FIELDS[fieldName];
  if (linked) {
    return (
      <LinkedField
        label={label}
        to={`${linked.basePath}/${(general as any)[linked.idKey]}`}
        labelLg1={value}
        labelLg2={secondLang ? (general as any)[linked.lg2Key] : undefined}
      />
    );
  }
  if (MATERIAL_FIELDS.has(fieldName)) {
    return (
      <li>
        {`${label} : `}
        <ExternalLink href={value}>{`${value}`}</ExternalLink>
      </li>
    );
  }
  if (fieldName === "disseminationStatus") {
    return <li>{`${label} : ${getDisseminationStatus(value)}`}</li>;
  }
  if (fieldName === "validationState") {
    return (
      <PublicationStatusItem
        label={label}
        object={{ validationState: value as ValidationState }}
        gender="female"
      />
    );
  }
  if (fieldName === "altLabelLg2" && !secondLang) {
    return null;
  }
  if (fieldName.includes("altLabel")) {
    return <li>{`${label} : ${value.replaceAll(" || ", " - ")}`}</li>;
  }
  if (DATE_FIELDS.has(fieldName)) {
    return <li>{`${label} : ${stringToDate(value)}`}</li>;
  }
  if (ORGANISATION_FIELDS.has(fieldName)) {
    return (
      <li>
        {`${label} : `} <InseeOrganization creator={value} />
      </li>
    );
  }
  return <li>{`${label} : ${value}`}</li>;
};

type Props = Readonly<{
  general: Classification;
  secondLang: boolean;
}>;

export const General = ({ general, secondLang }: Props) => {
  const { t } = useTranslation();

  let mapping: Record<string, any> = {};

  mapping = {
    ...mapping,
    seriesLg1: t("classification.motherSeries"),
    afterLg1: t("classification.previousClassification"),
    beforeLg1: t("classification.followingClassification"),
    variantLg1: t("classification.variant"),
  };

  if (general.altLabelLg1) {
    mapping = {
      ...mapping,
      altLabelLg1: `${t("classification.altLabelTitle")}`,
    };
  }

  if (general.altLabelLg2) {
    mapping = {
      ...mapping,
      altLabelLg2: `${t("classification.altLabelTitle")}`,
    };
  }

  mapping = {
    ...mapping,
    issued: t("classification.issuedDate"),
    valid: t("classification.validDate"),
    lastRefreshedOn: t("classification.lastRefreshedOnDate"),
    creator: t("classification.creator"),
    contributor: t("classification.contributor"),
    disseminationStatus: t("classification.disseminationStatus"),
    validationState: t("classification.validationStatus"),
    rights: t("classification.rights"),
    additionalMaterial: t("classification.additionalMaterial"),
    legalMaterial: t("classification.legalMaterial"),
    homepage: t("classification.homepage"),
  };

  return (
    <>
      <Row>
        <Note
          title={t("classification.globalInformation")}
          alone={true}
          text={
            <ul>
              {Object.keys(mapping).map((fieldName) => (
                <GeneralField
                  key={fieldName}
                  fieldName={fieldName}
                  label={mapping[fieldName]}
                  general={general}
                  secondLang={secondLang}
                />
              ))}
            </ul>
          }
        ></Note>
      </Row>
      <Row>
        <Note
          title={t("classification.descriptionTitle", { lng: "fr" })}
          text={renderMarkdownElement(general.descriptionLg1)}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            title={t("classification.descriptionTitle", { lng: "en" })}
            text={renderMarkdownElement(general.descriptionLg2)}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
    </>
  );
};
