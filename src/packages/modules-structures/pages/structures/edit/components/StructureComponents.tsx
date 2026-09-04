import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Component } from "@model/structures/Component";

import { ConceptsApi, StructureApi } from "@sdk/index";

import { ComponentSelector } from "../../../../components/ComponentSelector";
import {
  ATTRIBUTE_PROPERTY_TYPE,
  DIMENSION_PROPERTY_TYPE,
  MEASURE_PROPERTY_TYPE,
} from "../../../../constants";
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

  const [concepts, setConcepts] = useState<any[]>([]);

  const { data: codelists = [] } = useFormattedCodelist();

  const [mutualizedComponents, setMutualizedComponents] = useState<Component[]>([]);

  useEffect(() => {
    ConceptsApi.getConceptList().then((res: any[]) => setConcepts(res));
  }, []);

  useEffect(() => {
    StructureApi.getMutualizedComponents().then((res: Component[]) => setMutualizedComponents(res));
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
