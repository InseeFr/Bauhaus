import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";

import { EMPTY_ARRAY } from "@utils/array-utils";
import { conceptListQuery } from "@utils/hooks/concepts";

import { ComponentSelector } from "../../../../components/ComponentSelector";
import {
  ATTRIBUTE_PROPERTY_TYPE,
  DIMENSION_PROPERTY_TYPE,
  MEASURE_PROPERTY_TYPE,
} from "../../../../constants/dsd-components";
import { mutualizedComponentsQuery } from "../../../../hooks/queries";
import { useFormattedCodelist } from "../../../../hooks/useFormattedCodelist";

interface StructureComponentsTypes {
  creation?: boolean;
  componentDefinitions: any[];
  onChange: (components: any[]) => void;
  structure?: any;
}

export const StructureComponents = ({
  componentDefinitions,
  onChange,
  structure = {},
}: Readonly<StructureComponentsTypes>) => {
  const { t } = useTranslation();

  const { data: concepts = EMPTY_ARRAY } = useQuery(conceptListQuery());

  const { data: codelists = EMPTY_ARRAY } = useFormattedCodelist();

  // Référentiels des sélecteurs : leur chargement ne fait pas suspendre le formulaire.
  const { data: mutualizedComponents = EMPTY_ARRAY, error: mutualizedComponentsError } = useQuery(
    mutualizedComponentsQuery(),
  );

  return (
    <>
      <h2>{t("component.type.dimension.pluralTitle")}</h2>
      <Row className="text-left">
        <ComponentSelector
          componentDefinitions={componentDefinitions}
          concepts={concepts}
          codelists={codelists}
          mutualizedComponents={mutualizedComponents}
          mutualizedComponentsError={mutualizedComponentsError}
          type={DIMENSION_PROPERTY_TYPE}
          handleUpdate={onChange}
          structure={structure}
        />
      </Row>
      <h2>{t("component.type.measure.pluralTitle")}</h2>
      <Row className="text-left">
        <ComponentSelector
          componentDefinitions={componentDefinitions}
          concepts={concepts}
          codelists={codelists}
          mutualizedComponents={mutualizedComponents}
          mutualizedComponentsError={mutualizedComponentsError}
          type={MEASURE_PROPERTY_TYPE}
          handleUpdate={onChange}
          structure={structure}
        />
      </Row>
      <h2>{t("component.type.attribute.pluralTitle")}</h2>
      <Row className="text-left">
        <ComponentSelector
          componentDefinitions={componentDefinitions}
          concepts={concepts}
          codelists={codelists}
          mutualizedComponents={mutualizedComponents}
          mutualizedComponentsError={mutualizedComponentsError}
          type={ATTRIBUTE_PROPERTY_TYPE}
          handleUpdate={onChange}
          structure={structure}
        />
      </Row>
    </>
  );
};
