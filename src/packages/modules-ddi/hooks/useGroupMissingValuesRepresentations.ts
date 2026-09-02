import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import type { PartialMissingValuesRepresentation } from "../physical-instances/types/api";

/**
 * MMVR réutilisables d'un group (valeurs sentinelles, #1566) : identité + libellé + aperçu des
 * valeurs de codes de la CodeList de sentinelles référencée. Alimente le sélecteur de
 * réutilisation de la section « Valeurs sentinelles ».
 */
export const useGroupMissingValuesRepresentations = (agencyId: string, groupId: string) => {
  return useQuery<PartialMissingValuesRepresentation[]>({
    queryKey: ["groupMissingValuesRepresentations", agencyId, groupId],
    queryFn: () => DDIApi.getGroupMissingValuesRepresentations(agencyId, groupId),
    enabled: !!agencyId && !!groupId,
  });
};
