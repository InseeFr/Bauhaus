import { useEffect, useState } from "react";

import { StructureApi } from "../../../../sdk";
import { MeasureAttributeValue } from "./measureAttributeValue";

export const MeasureAttribute = ({ attribute, value, attributes, codesLists }) => {
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
      <MeasureAttributeValue value={value} attribute={fullAttribute} codesLists={codesLists} />
    </>
  );
};
