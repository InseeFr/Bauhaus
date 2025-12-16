import { XSD_CODE_LIST } from "../../../utils/constants";
import { MeasureAttributeCodeValue } from "./measureAttributeCodeValue";

export const MeasureAttributeValue = ({ value, attribute, codesLists }) => {
  if (attribute.range === XSD_CODE_LIST) {
    return (
      <MeasureAttributeCodeValue value={value} attribute={attribute} codesLists={codesLists} />
    );
  }
  return <>{value}</>;
};
