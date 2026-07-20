/* eslint  @typescript-eslint/no-unused-vars: 0 */
import objectFromKeys from "./object-from-keys";

type FieldSpec = [string, boolean, string?];

export const buildFields = (fieldsWithRequired: FieldSpec[]) =>
  fieldsWithRequired.map(([fieldName]) => fieldName);

export const buildEmpty = (fieldsWithRequired: FieldSpec[]) => {
  const general = objectFromKeys(buildFields(fieldsWithRequired), "");
  fieldsWithRequired.forEach(([field, _req, type]) => {
    if (type === "array") {
      general[field] = [];
    }
  });
  return general;
};

export const buildEmptyWithContributor = (
  fieldsWithRequired: FieldSpec[],
  defaultContributor: string,
) => {
  return {
    ...buildEmpty(fieldsWithRequired),
    contributor: defaultContributor,
  };
};
