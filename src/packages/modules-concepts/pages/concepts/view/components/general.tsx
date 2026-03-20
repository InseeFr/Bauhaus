import { DisseminationStatusVisualisation } from "@components/dissemination-status/disseminationStatus";
import { Row } from "@components/layout";
import { ExternalLink } from "@components/link";
import { Note } from "@components/note";

import { stringToDate } from "@utils/date-utils";
import { useLocales } from "@utils/hooks/useLocales";
import { isEmpty } from "@utils/value-utils";

import { useTranslation } from "react-i18next";
import { SingleOrNestedListItem } from "../../../../../components/ui/single-or-nested-list-item";
import { InseeOrganisation } from "@components/business/organisations/organisations";

interface ConceptAttribute {
  id?: string;
  altLabelLg1?: string[];
  altLabelLg2?: string[];
  created?: string;
  modified?: string;
  valid?: string;
  conceptVersion?: string;
  creator?: string | string[];
  contributor?: string | string[];
  disseminationStatus?: string;
  isValidated?: string;
  additionalMaterial?: string;
}

interface ConceptGeneralProps {
  attr: ConceptAttribute;
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
  | "isValidated"
  | "additionalMaterial";

// Helper functions for type-safe field rendering
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

const renderDisseminationField = (
  fieldName: "disseminationStatus",
  value: string,
): JSX.Element => {
  return (
    <li key={fieldName}>
      <DisseminationStatusVisualisation disseminationStatus={value} />
    </li>
  );
};

const renderValidationField = (
  fieldName: "isValidated",
  label: string,
  value: string,
  conceptStatusValid: string,
  conceptStatusProvisional: string,
): JSX.Element => {
  return (
    <li key={fieldName}>{`${label}: ${
      value === "true" ? conceptStatusValid : conceptStatusProvisional
    }`}</li>
  );
};

const renderSimpleField = (
  fieldName: FieldName,
  label: string,
  value: string,
): JSX.Element => {
  return <li key={fieldName}>{`${label}: ${value}`}</li>;
};

// Main helper function with type guards using switch
const renderFieldItem = (
  fieldName: FieldName,
  label: string,
  attr: ConceptAttribute,
  secondLang: boolean,
  conceptStatusValid: string,
  conceptStatusProvisional: string,
): JSX.Element | null => {
  const value = attr[fieldName];

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

    case "isValidated":
      return renderValidationField(
        fieldName,
        label,
        value as string,
        conceptStatusValid,
        conceptStatusProvisional,
      );

    case "id":
    case "conceptVersion":
      return renderSimpleField(fieldName, label, value as string);

    default:
      // This should never happen due to FieldName type
      return null;
  }
};

function ConceptGeneral({
  attr,
  secondLang = false,
}: Readonly<ConceptGeneralProps>) {
  const { lg1, lg2 } = useLocales();
  const { t } = useTranslation();

  const conceptStatusValid = t("concept.general.conceptStatusValid");
  const conceptStatusProvisional = t(
    "concept.general.conceptStatusProvisional",
  );

  // Build fields configuration dynamically based on available data
  const fields: { name: FieldName; label: string }[] = [
    { name: "id", label: t("concept.general.identifiantTitle") },
  ];

  if (attr.altLabelLg1 && attr.altLabelLg1.length !== 0) {
    fields.push({
      name: "altLabelLg1",
      label: `${t("concept.general.altLabelTitle")} (${lg1})`,
    });
  }

  if (attr.altLabelLg2 && attr.altLabelLg2.length !== 0) {
    fields.push({
      name: "altLabelLg2",
      label: `${t("concept.general.altLabelTitle")} (${lg2})`,
    });
  }

  fields.push(
    { name: "created", label: t("concept.general.createdDateTitle") },
    { name: "modified", label: t("concept.general.modifiedDateTitle") },
  );

  if (attr.valid) {
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
    { name: "isValidated", label: t("concept.general.isConceptValidTitle") },
  );

  if (attr.additionalMaterial) {
    fields.push({
      name: "additionalMaterial",
      label: t("concept.general.additionalMaterialTitle"),
    });
  }

  return (
    <Row>
      <Note
        text={
          <ul>
            {fields.map(({ name, label }) =>
              renderFieldItem(
                name,
                label,
                attr,
                secondLang,
                conceptStatusValid,
                conceptStatusProvisional,
              ),
            )}
          </ul>
        }
        title={t("concept.general.globalInformationsTitle")}
        alone={true}
      />
    </Row>
  );
}

export default ConceptGeneral;
