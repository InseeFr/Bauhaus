import {
  buildEmpty,
  buildEmptyWithContributor,
  buildFields,
  type FieldSpec,
} from "../../utils/build-general-proptypes";

export const fieldsWithRequired: FieldSpec[] = [
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

export const fields = buildFields(fieldsWithRequired);

export const empty = () => buildEmpty(fieldsWithRequired);

export const emptyWithContributor = (defaultContributor: string) =>
  buildEmptyWithContributor(fieldsWithRequired, defaultContributor);
