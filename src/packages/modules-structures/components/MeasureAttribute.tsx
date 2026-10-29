import { useQuery } from "@tanstack/react-query";

import { Codelists } from "@model/Codelist";
import { Component } from "@model/structures/Component";

import { mutualizedComponentQuery } from "../hooks/queries";
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

  const { data: fullAttribute } = useQuery(mutualizedComponentQuery(attributeId!));

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
