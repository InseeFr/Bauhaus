import { MeasureAttribute } from "./MeasureAttribute";

export const MeasureAttributes = ({ measure, attributes, codelists }) => {
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
