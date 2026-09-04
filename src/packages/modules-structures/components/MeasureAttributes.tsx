import { Codelists } from "@model/Codelist";
import { Component } from "@model/structures/Component";

import { EMPTY_ARRAY } from "@utils/array-utils";

import { MeasureAttribute } from "./MeasureAttribute";

interface MeasureAttributesTypes {
  measure: Record<string, any>;
  attributes?: Component[];
  codelists: Codelists;
}

export const MeasureAttributes = ({
  measure,
  attributes = EMPTY_ARRAY,
  codelists,
}: Readonly<MeasureAttributesTypes>) => {
  const measureAttributes = Object.keys(measure)
    .filter((key) => key.startsWith("attribute_"))
    .map((key) => {
      const index = key.substring(key.indexOf("_") + 1);
      return [measure["attribute_" + index], measure["attributeValue_" + index]];
    });

  return (
    <ul>
      {measureAttributes.map(([key, value]) => (
        <li key={key}>
          <MeasureAttribute
            attribute={key}
            value={value}
            attributes={attributes}
            codelists={codelists}
          />
        </li>
      ))}
    </ul>
  );
};
