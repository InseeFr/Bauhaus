import { useTranslation } from "react-i18next";

import { CreationUpdateItems } from "@components/creation-update-items";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationStatusItem } from "@components/status/PublicationStatusItem";
import type { ValidationState } from "@components/status";

import { isEmpty } from "@utils/value-utils";
import { InseeOrganisation } from "@components/business/organisations/organisations";

export interface CollectionAttribute {
  created?: string;
  modified?: string | null;
  creator?: string | string[];
  contributor?: string | string[] | null;
  validationState?: ValidationState;
  descriptionLg1?: string;
  descriptionLg2?: string;
}

interface CollectionGeneralProps {
  attr: CollectionAttribute;
  secondLang?: boolean;
}

type FieldName = "creator" | "contributor" | "validationState";

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
  fieldName: "validationState",
  label: string,
  value: ValidationState,
): JSX.Element => {
  return (
    <PublicationStatusItem
      key={fieldName}
      label={label}
      object={{ validationState: value }}
      gender="female"
    />
  );
};

// Main helper function with type guards
const renderFieldItem = (
  fieldName: FieldName,
  label: string,
  attr: CollectionAttribute,
): JSX.Element | null => {
  const value = attr[fieldName];

  if (isEmpty(value)) return null;

  switch (fieldName) {
    case "creator":
    case "contributor":
      return renderOrganisationField(fieldName, label, value as string);
    case "validationState":
      return renderValidationField(fieldName, label, value as ValidationState);
    default:
      // This should never happen due to FieldName type, but TypeScript needs this
      return null;
  }
};

export function CollectionGeneral({ attr, secondLang }: Readonly<CollectionGeneralProps>) {
  const { i18n } = useTranslation();
  const t1 = i18n.getFixedT("fr");
  const t2 = i18n.getFixedT("en");

  const fields: readonly { name: FieldName; label: string }[] = [
    { name: "creator", label: t1("common.creatorTitle") },
    { name: "contributor", label: t1("collection.general.contributorTitle") },
    {
      name: "validationState",
      label: t1("collection.general.isCollectionValidTitle"),
    },
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
              {fields.map(({ name, label }) => renderFieldItem(name, label, attr))}
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
