import { useQuery } from "@tanstack/react-query";
import { DDIApi } from "../../sdk";

export interface PhysicalInstanceParents {
  /** `label` = libellé de l'étude parente, affiché en tag sous le titre de la PI. */
  studyUnit: { agency: string; id: string; label?: string };
  /** `label` = libellé du groupe parent, exposé pour l'en-tête de la section « groupe » du sélecteur de listes de codes. */
  group: { agency: string; id: string; label?: string };
  /** Stamps créateurs du groupe parent — base du gating STAMP côté affichage. */
  stamps: string[];
}

export function usePhysicalInstanceParents(agencyId: string, id: string) {
  return useQuery<PhysicalInstanceParents>({
    queryKey: ["physicalInstanceParents", agencyId, id],
    queryFn: () => DDIApi.getPhysicalInstanceParents(agencyId, id),
  });
}
