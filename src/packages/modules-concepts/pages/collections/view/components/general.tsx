import { useTranslation } from "react-i18next";

import { CreationUpdateItems } from "@components/creation-update-items";
import { Row } from "@components/layout";
import { Note } from "@components/note";

import { isEmpty } from "@utils/value-utils";
import { InseeOrganisation } from "@components/business/organisations/organisations";

interface CollectionAttribute {
  created?: string;
  modified?: string;
  creator?: string | string[];
  contributor?: string | string[];
  isValidated?: boolean;
  descriptionLg1?: string;
  descriptionLg2?: string;
}

interface CollectionGeneralProps {
  attr: CollectionAttribute;
  secondLang?: boolean;
}

type FieldName = "creator" | "contributor" | "isValidated";

// Helper functions to render specific field types with type safety
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

const renderValidationField = (
  fieldName: "isValidated",
  label: string,
  value: boolean,
  statusLabel: string,
): JSX.Element => {
  return <li key={fieldName}>{`${label}: ${statusLabel}`}</li>;
};

// Main helper function with type guards
const renderFieldItem = (
  fieldName: FieldName,
  label: string,
  attr: CollectionAttribute,
  validatedStatusLabel: string,
): JSX.Element | null => {
  const value = attr[fieldName];

  if (isEmpty(value)) return null;

  switch (fieldName) {
    case "creator":
    case "contributor":
      return renderOrganisationField(fieldName, label, value as string);

    case "isValidated":
      return renderValidationField(fieldName, label, value as boolean, validatedStatusLabel);

    default:
      // This should never happen due to FieldName type, but TypeScript needs this
      return null;
  }
};

function CollectionGeneral({ attr, secondLang }: Readonly<CollectionGeneralProps>) {
  const { i18n } = useTranslation();
  const t1 = i18n.getFixedT("fr");
  const t2 = i18n.getFixedT("en");

  const validatedStatusLabel = attr.isValidated
    ? t1("collection.general.statusValid")
    : t1("collection.general.statusProvisional");

  const fields: readonly { name: FieldName; label: string }[] = [
    { name: "creator", label: t1("common.creatorTitle") },
    { name: "contributor", label: t1("collection.general.contributorTitle") },
    { name: "isValidated", label: t1("collection.general.isCollectionValidTitle") },
  ] as const;

  return (
    <>
      <Row>
        <Note
          title={t1("common.globalInformationsTitle")}
          alone={true}
          text={
            <ul>
              <CreationUpdateItems creation={attr.created} update={attr.modified} />
              {fields.map(({ name, label }) =>
                renderFieldItem(name, label, attr, validatedStatusLabel),
              )}
            </ul>
          }
        />
      </Row>
      {attr.descriptionLg1 && (
        <Row>
          <Note
            text={attr.descriptionLg1}
            title={t1("common.descriptionTitle")}
            alone={!secondLang}
          />
          {secondLang && (
            <Note text={attr.descriptionLg2} title={t2("common.descriptionTitle")} alone={false} />
          )}
        </Row>
      )}
    </>
  );
}

export default CollectionGeneral;
