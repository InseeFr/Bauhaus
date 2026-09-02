import { useEffect, useState } from "react";

import { StructureApi } from "@sdk/index";

import { MeasureAttributeValue } from "./MeasureAttributeValue";

export const MeasureAttribute = ({ attribute, value, attributes, codelists }) => {
  const attributeId = attributes.find((a) => a.iri === attribute)?.id;

  const [fullAttribute, setFullAttribute] = useState();

  useEffect(() => {
    StructureApi.getMutualizedComponent(attributeId).then((body) => setFullAttribute(body));
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
