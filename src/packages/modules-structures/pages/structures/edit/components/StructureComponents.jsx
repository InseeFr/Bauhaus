import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ConceptsApi, StructureApi } from "@sdk/index";

import { ComponentSelector } from "../../../../components/ComponentSelector";
import {
  ATTRIBUTE_PROPERTY_TYPE,
  DIMENSION_PROPERTY_TYPE,
  MEASURE_PROPERTY_TYPE,
} from "../../../../constants";
import { useFormattedCodelist } from "../../../../hooks/useFormattedCodelist";

export const StructureComponents = ({ componentDefinitions, onChange, structure = {} }) => {
  const { t } = useTranslation();

  const [concepts, setConcepts] = useState([]);

  const { data: codelists = [] } = useFormattedCodelist();

  const [mutualizedComponents, setMutualizedComponents] = useState([]);

  useEffect(() => {
    ConceptsApi.getConceptList().then((res) => setConcepts(res));
  }, []);

  useEffect(() => {
    StructureApi.getMutualizedComponents().then((res) => setMutualizedComponents(res));
  }, []);

  return (
    <>
      <h2>{t("component.type.dimension.pluralTitle")}</h2>
      <div className="row text-left">
        <ComponentSelector
          componentDefinitions={componentDefinitions}
          concepts={concepts}
          codelists={codelists}
          mutualizedComponents={mutualizedComponents}
          type={DIMENSION_PROPERTY_TYPE}
          handleUpdate={onChange}
          structure={structure}
        />
      </div>
      <h2>{t("component.type.measure.pluralTitle")}</h2>
      <div className="row text-left">
        <ComponentSelector
          componentDefinitions={componentDefinitions}
          concepts={concepts}
          codelists={codelists}
          mutualizedComponents={mutualizedComponents}
          type={MEASURE_PROPERTY_TYPE}
          handleUpdate={onChange}
          structure={structure}
        />
      </div>
      <h2>{t("component.type.attribute.pluralTitle")}</h2>
      <div className="row text-left">
        <ComponentSelector
          componentDefinitions={componentDefinitions}
          concepts={concepts}
          codelists={codelists}
          mutualizedComponents={mutualizedComponents}
          type={ATTRIBUTE_PROPERTY_TYPE}
          handleUpdate={onChange}
          structure={structure}
        />
      </div>
    </>
  );
};
