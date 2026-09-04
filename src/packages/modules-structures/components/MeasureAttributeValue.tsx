import { Codelists } from "@model/Codelist";
import { Component } from "@model/structures/Component";

import { XSD_CODE_LIST } from "../constants";
import { MeasureAttributeCodeValue } from "./MeasureAttributeCodeValue";

interface MeasureAttributeValueTypes {
  value: string;
  attribute: Component;
  codelists: Codelists;
}

export const MeasureAttributeValue = ({
  value,
  attribute,
  codelists,
}: Readonly<MeasureAttributeValueTypes>) => {
  if (attribute.range === XSD_CODE_LIST) {
    return <MeasureAttributeCodeValue value={value} attribute={attribute} codelists={codelists} />;
  }

  return value;
};
