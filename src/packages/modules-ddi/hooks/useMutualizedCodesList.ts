import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import type { PhysicalInstanceResponse } from "../physical-instances/types/api";

export const useMutualizedCodesList = (agencyId: string, id: string) => {
  return useQuery<PhysicalInstanceResponse>({
    queryKey: ["mutualizedCodesList", agencyId, id],
    queryFn: () => DDIApi.getMutualizedCodesList(agencyId, id),
    enabled: !!agencyId && !!id,
  });
};
