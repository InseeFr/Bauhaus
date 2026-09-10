import { useEffect, useState } from "react";

import { Codelists } from "@model/Codelist";
import { Component } from "@model/structures/Component";

import { StructureApi } from "@sdk/index";

import { MeasureAttributeValue } from "./MeasureAttributeValue";

interface MeasureAttributeTypes {
  attribute: string;
  value: string;
  attributes: Component[];
  codelists: Codelists;
}

export const MeasureAttribute = ({
  attribute,
  value,
  attributes,
  codelists,
}: Readonly<MeasureAttributeTypes>) => {
  const attributeId = attributes.find((a) => a.iri === attribute)?.id;

  const [fullAttribute, setFullAttribute] = useState<Component>();

  useEffect(() => {
    StructureApi.getMutualizedComponent(attributeId).then((body: Component) =>
      setFullAttribute(body),
    );
  }, [attributeId]);

  if (!fullAttribute) {
    return null;
  }

  return (
    <>
      {fullAttribute?.labelLg1}:{" "}
      <MeasureAttributeValue value={value} attribute={fullAttribute} codelists={codelists} />
    </>
  );
};
