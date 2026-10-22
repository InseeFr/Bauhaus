import { flattenTree } from "../../../../utils/flattenTree";

interface Context {
  /** Rubriques telles qu'envoyées au back, dans le même ordre. */
  rubrics: readonly { idAttribute?: string }[];
  metadataStructure: any;
  /** Nom affiché de chaque langue. */
  languages: Record<"Lg1" | "Lg2", string>;
}

// `rubrics[12].labelLg2`, `rubrics[0].documentsLg1[0].url` : indice, puis langue éventuelle.
const RUBRIC_FIELD = /^rubrics\[(\d+)\]\.\w*?(Lg[12])?(?:\W|$)/;

/**
 * Le back nomme une erreur de rubrique par son chemin dans le corps (`rubrics[12].value`),
 * illisible pour l'utilisateur. Le rapport n'a pas d'emplacement d'erreur par saisie : le
 * rejet reste au bandeau, ses champs de rubrique y sont renommés en `<idMas> - <libellé>`,
 * suivi de la langue quand le champ en porte une. Tout autre champ est laissé tel quel.
 */
export const nameRubricErrors = (
  error: unknown,
  { rubrics, metadataStructure, languages }: Context,
): unknown => {
  const errors = (error as { errors?: unknown })?.errors;

  if (!Array.isArray(errors)) return error;

  const structure = flattenTree(metadataStructure) ?? {};

  const nameOf = (field: unknown) => {
    const match = typeof field === "string" ? RUBRIC_FIELD.exec(field) : null;
    const idMas = match ? rubrics[Number(match[1])]?.idAttribute : undefined;

    if (!match || !idMas) return field;

    const label = structure[idMas]?.masLabelBasedOnCurrentLang;
    const language = match[2] as "Lg1" | "Lg2" | undefined;

    return [label ? `${idMas} - ${label}` : idMas, language && `(${languages[language]})`]
      .filter(Boolean)
      .join(" ");
  };

  return {
    ...(error as object),
    errors: errors.map((e) =>
      typeof e === "object" && e !== null && "field" in e ? { ...e, field: nameOf(e.field) } : e,
    ),
  };
};
