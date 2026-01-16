/* eslint  @typescript-eslint/no-unused-vars: 0 */
import objectFromKeys from "./object-from-keys";

export const buildFields = (fieldsWithRequired: string[][]) =>
  fieldsWithRequired.map(([fieldName]) => fieldName);

export const buildEmpty = (fieldsWithRequired: string[][]) => {
  const general = objectFromKeys(buildFields(fieldsWithRequired), "");
  fieldsWithRequired.forEach(([field, _req, type]) => {
    if (type === "array") {
      general[field] = [];
    }
  });
  return general;
};

export const buildEmptyWithContributor = (
  fieldsWithRequired: string[][],
  defaultContributor: string,
) => {
  return {
    ...buildEmpty(fieldsWithRequired),
    contributor: defaultContributor,
  };
};
