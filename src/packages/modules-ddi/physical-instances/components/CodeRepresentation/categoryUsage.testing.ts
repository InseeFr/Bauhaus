import type { CategoryUsage } from "../../types/api";

/**
 * Ligne d'usage d'une catégorie, telle que la renvoie le back : un enregistrement par
 * (catégorie × liste de codes × variable × PhysicalInstance).
 */
export const categoryUsage = (overrides: Partial<CategoryUsage> = {}): CategoryUsage => ({
  group: { agencyId: "fr.insee", id: "grp-1", label: "Groupe démographie" },
  studyUnit: { agencyId: "fr.insee", id: "su-1", label: "Recensement 2024" },
  physicalInstance: { agencyId: "fr.insee", id: "pi-1", label: "Fichier détail" },
  variable: { agencyId: "fr.insee", id: "var-1", label: "Sexe" },
  codeList: { agencyId: "fr.insee", id: "cl-1", label: "Pays" },
  ...overrides,
});
