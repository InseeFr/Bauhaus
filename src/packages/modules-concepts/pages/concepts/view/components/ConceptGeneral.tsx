import { DisseminationStatusVisualisation } from "@components/dissemination-status/disseminationStatus";
import { Row } from "@components/layout";
import { ExternalLink } from "@components/link";
import { Note } from "@components/note";
import { PublicationStatusItem } from "@components/status";
import type { ValidationState } from "@components/status";

import { stringToDate } from "@utils/date-utils";
import { useLocales } from "@utils/hooks/useLocales";
import { isEmpty } from "@utils/value-utils";

import { useTranslation } from "react-i18next";
import { SingleOrNestedListItem } from "../../../../../components/ui/single-or-nested-list-item";
import { InseeOrganisation } from "@components/business/organisations/organisations";
import type { ConceptGeneral } from "@model/concepts/concept";
import { CollectionsBlock } from "./CollectionsBlock";

interface ConceptGeneralProps {
  concept: ConceptGeneral;
  secondLang?: boolean;
}

type FieldName =
  | "id"
  | "altLabelLg1"
  | "altLabelLg2"
  | "created"
  | "modified"
  | "valid"
  | "conceptVersion"
  | "creator"
  | "contributor"
  | "disseminationStatus"
  | "validationState"
  | "additionalMaterial";

const renderOrganisationField = (
  fieldName: "creator" | "contributor",
  label: string,
  value: string,
): JSX.Element => {
  return (
    <li key={fieldName}>
      {label}: <InseeOrganisation creator={value} />
    </li>
  );
};

const renderArrayField = (
  fieldName: "altLabelLg1" | "altLabelLg2",
  label: string,
  value: string[],
): JSX.Element => {
  return <SingleOrNestedListItem key={fieldName} label={label} items={value} />;
};

const renderDateField = (
  fieldName: "created" | "modified" | "valid",
  label: string,
  value: string,
): JSX.Element => {
  return <li key={fieldName}>{`${label}: ${stringToDate(value)}`}</li>;
};

const renderLinkField = (
  fieldName: "additionalMaterial",
  label: string,
  value: string,
): JSX.Element => {
  return (
    <li key={fieldName}>
      {`${label}: `}
      <ExternalLink href={value}>{value}</ExternalLink>
    </li>
  );
};

const renderDisseminationField = (fieldName: "disseminationStatus", value: string): JSX.Element => {
  return (
    <li key={fieldName}>
      <DisseminationStatusVisualisation disseminationStatus={value} />
    </li>
  );
};

const renderValidationField = (
  fieldName: "validationState",
  label: string,
  value: string,
): JSX.Element => {
  return (
    <PublicationStatusItem
      key={fieldName}
      label={label}
      object={{ validationState: value as ValidationState }}
      gender="female"
    />
  );
};

const renderSimpleField = (fieldName: FieldName, label: string, value: string): JSX.Element => {
  return <li key={fieldName}>{`${label}: ${value}`}</li>;
};

const renderFieldItem = (
  fieldName: FieldName,
  label: string,
  concept: ConceptGeneral,
  secondLang: boolean,
): JSX.Element | null => {
  const value = concept[fieldName];

  if (isEmpty(value)) return null;

  // Skip altLabelLg2 if secondLang is false
  if (fieldName === "altLabelLg2" && !secondLang) {
    return null;
  }

  switch (fieldName) {
    case "creator":
    case "contributor":
      return renderOrganisationField(fieldName, label, value as string);

    case "altLabelLg1":
    case "altLabelLg2":
      return renderArrayField(fieldName, label, value as string[]);

    case "created":
    case "modified":
    case "valid":
      return renderDateField(fieldName, label, value as string);

    case "additionalMaterial":
      return renderLinkField(fieldName, label, value as string);

    case "disseminationStatus":
      return renderDisseminationField(fieldName, value as string);

    case "validationState":
      return renderValidationField(fieldName, label, value as string);

    case "id":
    case "conceptVersion":
      return renderSimpleField(fieldName, label, value as string);

    default:
      return null;
  }
};

export function ConceptGeneral({ concept, secondLang = false }: Readonly<ConceptGeneralProps>) {
  const { lg1, lg2 } = useLocales();
  const { t } = useTranslation();

  const fields: { name: FieldName; label: string }[] = [
    { name: "id", label: t("concept.general.identifiantTitle") },
  ];

  if (concept.altLabelLg1 && concept.altLabelLg1.length !== 0) {
    fields.push({
      name: "altLabelLg1",
      label: `${t("concept.general.altLabelTitle")} (${lg1})`,
    });
  }

  if (concept.altLabelLg2 && concept.altLabelLg2.length !== 0) {
    fields.push({
      name: "altLabelLg2",
      label: `${t("concept.general.altLabelTitle")} (${lg2})`,
    });
  }

  fields.push(
    { name: "created", label: t("concept.general.createdDateTitle") },
    { name: "modified", label: t("concept.general.modifiedDateTitle") },
  );

  if (concept.valid) {
    fields.push({ name: "valid", label: t("concept.general.validDateTitle") });
  }

  fields.push(
    { name: "conceptVersion", label: t("concept.general.conceptVersionTitle") },
    { name: "creator", label: t("concept.general.creatorTitle") },
    { name: "contributor", label: t("concept.general.contributorTitle") },
    {
      name: "disseminationStatus",
      label: t("concept.general.disseminationStatusTitle"),
    },
    { name: "validationState", label: t("concept.general.isConceptValidTitle") },
  );

  if (concept.additionalMaterial) {
    fields.push({
      name: "additionalMaterial",
      label: t("concept.general.additionalMaterialTitle"),
    });
  }

  return (
    <>
      <Row>
        <Note
          text={
            <ul>
              {fields.map(({ name, label }) => renderFieldItem(name, label, concept, secondLang))}
            </ul>
          }
          title={t("concept.general.globalInformationsTitle")}
          alone={true}
        />
      </Row>
      <CollectionsBlock collectionsIds={concept.collections} />
    </>
  );
}
