/* eslint  @typescript-eslint/no-unused-vars: 0 */
import objectFromKeys from "./object-from-keys";

/**
 * Description d'un champ : son nom, un indicateur `required` conservé pour la
 * documentation des modules (aucun appelant ne le lit), et son type optionnel.
 */
export type FieldSpec = [name: string, required: boolean, type?: string];

export const buildFields = (fieldsWithRequired: FieldSpec[]) =>
  fieldsWithRequired.map(([fieldName]) => fieldName);

export const buildEmpty = (fieldsWithRequired: FieldSpec[]) => {
  const general = objectFromKeys<string | string[]>(buildFields(fieldsWithRequired), "");
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
