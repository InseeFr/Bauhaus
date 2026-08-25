import type { FieldSpec } from "@utils/build-general-proptypes";

export const conceptGeneralFieldsConfig: FieldSpec[] = [
  ["collections", false, "array"],
  ["prefLabelLg1", false],
  ["prefLabelLg2", false],
  ["altLabelLg1", false, "array"],
  ["altLabelLg2", false, "array"],
  ["disseminationStatus", false],
  ["additionalMaterial", false],
  ["valid", false],
  ["creator", false],
  ["contributor", false],
  ["validationState", false],
  ["conceptVersion", true],
  ["created", false],
];
