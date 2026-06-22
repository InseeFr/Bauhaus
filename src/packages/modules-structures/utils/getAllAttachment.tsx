import { Component } from "../../model/structures/Component";
import { ATTACHMENTS } from "../constants";

export const getAllAttachment = (measures: Component[] = [], specification: any) => {
  // We find one measure linked to the attribute
  const measureWithThisAttribute = measures.find((measure: any) => {
    return !!Object.keys(measure)
      .filter((key) => key.startsWith("attribute_"))
      .find((key) => {
        return measure[key] === specification.component.iri;
      });
  });

  const measuresOptions = measures.map((c: Component) => ({
    value: c.id,
    label: c.labelLg1,
  }));

  // If this measure exists, this attribute can only have a measure as an attachment
  if (measureWithThisAttribute) {
    return measuresOptions;
  }

  return [...ATTACHMENTS, ...measuresOptions];
};
