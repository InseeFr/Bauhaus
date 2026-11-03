import { queryOptions, useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/ddi-api";

export interface PhysicalInstanceParents {
  /**
   * `label` = libellé de l'étude parente, affiché en tag sous le titre de la PI.
   * `operationsIri` = IRI de l'opération dont l'étude est le miroir, `null` si elle n'en reflète aucune.
   */
  studyUnit: { agency: string; id: string; label?: string; operationsIri?: string | null };
  /**
   * `label` = libellé du groupe parent, exposé pour l'en-tête de la section « groupe » du sélecteur de listes de codes.
   * `operationsIri` = IRI de la série dont le groupe est le miroir, `null` s'il n'en reflète aucune.
   */
  group: { agency: string; id: string; label?: string; operationsIri?: string | null };
  /** Stamps créateurs du groupe parent — base du gating STAMP côté affichage. */
  stamps: string[];
}

/** Parents d'une PhysicalInstance, partagés par le hook et les préchargements (même cache). */
export const physicalInstanceParentsQuery = (agencyId: string, id: string) =>
  queryOptions({
    queryKey: ["physicalInstanceParents", agencyId, id],
    queryFn: (): Promise<PhysicalInstanceParents> =>
      DDIApi.getPhysicalInstanceParents(agencyId, id),
  });

export function usePhysicalInstanceParents(
  agencyId: string,
  id: string,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    ...physicalInstanceParentsQuery(agencyId, id),
    // Convention du module : les hooks composés se désactivent en passant des chaînes vides.
    enabled: enabled && !!agencyId && !!id,
  });
}
