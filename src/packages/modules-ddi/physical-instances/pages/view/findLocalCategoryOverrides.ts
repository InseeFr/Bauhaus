import type { Category } from "../../types/api";
import type { VariableData } from "./viewReducer";

/**
 * Applique aux catégories fraîchement chargées du back-office les surcharges locales
 * (non encore enregistrées) portées par d'autres variables.
 *
 * Pendant de {@link findLocalCodeListOverride}, mais au niveau de la catégorie : une même
 * catégorie peut être partagée par des listes de codes DIFFÉRENTES. Sans cela, ouvrir une
 * variable dont la liste réutilise une catégorie éditée ailleurs afficherait la version périmée
 * — et surtout, valider cette variable réinjecterait cette version périmée dans le payload de
 * sauvegarde, annulant silencieusement la modification.
 *
 * La dernière variable locale portant la catégorie l'emporte (ordre de validation).
 */
export const findLocalCategoryOverrides = (
  localVariables: VariableData[],
  categories: Category[] | undefined,
): Category[] | undefined => {
  if (!categories) return undefined;

  const overrides = new Map<string, Category>();
  for (const variable of localVariables) {
    for (const category of variable.categories ?? []) {
      if (category.ID) {
        overrides.set(category.ID, category);
      }
    }
  }
  if (overrides.size === 0) return categories;

  return categories.map((category) =>
    category.ID ? (overrides.get(category.ID) ?? category) : category,
  );
};
