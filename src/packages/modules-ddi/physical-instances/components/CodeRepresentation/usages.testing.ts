import type { CategoryUsage, CodeListUsage } from "../../types/api";

/** Ligne d'usage d'une catégorie : Recensement > Recensement 2024 > Fichier détail > Sexe. */
export const categoryUsage = (overrides: Partial<CategoryUsage> = {}): CategoryUsage => ({
  group: { agencyId: "fr.insee", id: "grp-1", label: "Recensement" },
  studyUnit: { agencyId: "fr.insee", id: "su-1", label: "Recensement 2024" },
  physicalInstance: { agencyId: "fr.insee", id: "pi-1", label: "Fichier détail" },
  variable: { agencyId: "fr.insee", id: "var-1", label: "Sexe" },
  codeList: { agencyId: "fr.insee", id: "cl-1", label: "Liste des sexes" },
  ...overrides,
});

/** Usage d'une catégorie par une AUTRE variable (« Autre variable ») et une autre liste. */
export const otherVariableCategoryUsage = (overrides: Partial<CategoryUsage> = {}): CategoryUsage =>
  categoryUsage({
    group: { agencyId: "fr.insee", id: "grp-1", label: "Groupe démographie" },
    studyUnit: { agencyId: "fr.insee", id: "su-1", label: "Recensement" },
    variable: { agencyId: "fr.insee", id: "other-variable", label: "Autre variable" },
    codeList: { agencyId: "fr.insee", id: "cl-2", label: "Autre liste" },
    ...overrides,
  });

/** Ligne d'usage d'une liste de codes : Recensement 2024 > Fichier détail > Sexe. */
export const codeListUsage = (overrides: Partial<CodeListUsage> = {}): CodeListUsage => ({
  studyUnitAgencyId: "fr.insee",
  studyUnitId: "su-1",
  studyUnitLabel: "Recensement 2024",
  physicalInstanceAgencyId: "fr.insee",
  physicalInstanceId: "pi-1",
  physicalInstanceLabel: "Fichier détail",
  variableAgencyId: "fr.insee",
  variableId: "var-1",
  variableLabel: "Sexe",
  ...overrides,
});

/** Usage d'une liste de codes par une variable de l'unité d'enquête « Recensement ». */
export const recensementCodeListUsage = (variableId: string, variableLabel: string) =>
  codeListUsage({ studyUnitLabel: "Recensement", variableId, variableLabel });
