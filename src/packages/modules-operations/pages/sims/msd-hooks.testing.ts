/**
 * Référentiels servis aux écrans MSD (aide, visualisation) : une liste de codes et une
 * organisation. Module de remplacement pour `vi.mock(..., () => import("./msd-hooks.testing"))`.
 */
export const useCodelists = () => ({ codelists: { CL_1: [] } });

export const useOrganizations = () => ({ data: [{ id: "org-1" }] });
