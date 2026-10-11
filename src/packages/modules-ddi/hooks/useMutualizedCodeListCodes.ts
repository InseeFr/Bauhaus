import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import type { MutualizedCodeListCodes } from "../physical-instances/types/api";

/**
 * Vue allégée (valeur + libellé par code) d'une liste de codes mutualisée, pour l'affichage en
 * lecture seule : bien plus légère que le DDI4 complet de {@link useMutualizedCodeList}.
 */
export const useMutualizedCodeListCodes = (agencyId: string, id: string) => {
  return useQuery<MutualizedCodeListCodes>({
    queryKey: ["mutualizedCodeListCodes", agencyId, id],
    queryFn: () => DDIApi.getMutualizedCodeListCodes(agencyId, id),
    enabled: !!agencyId && !!id,
  });
};
