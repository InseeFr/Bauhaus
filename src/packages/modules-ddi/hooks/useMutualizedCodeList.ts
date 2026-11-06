import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import type { PhysicalInstanceResponse } from "../physical-instances/types/api";

export const useMutualizedCodeList = (agencyId: string, id: string) => {
  return useQuery<PhysicalInstanceResponse>({
    queryKey: ["mutualizedCodeList", agencyId, id],
    // Lecture lourde de Colectica : en cache jusqu'à son éviction après une sauvegarde.
    staleTime: Infinity,
    queryFn: () => DDIApi.getMutualizedCodeList(agencyId, id),
    enabled: !!agencyId && !!id,
  });
};
