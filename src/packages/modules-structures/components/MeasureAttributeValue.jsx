import { XSD_CODE_LIST } from "../constants";
import { MeasureAttributeCodeValue } from "./MeasureAttributeCodeValue";

export const MeasureAttributeValue = ({ value, attribute, codelists }) => {
  if (attribute.range === XSD_CODE_LIST) {
    return <MeasureAttributeCodeValue value={value} attribute={attribute} codelists={codelists} />;
  }

  return value;
};
