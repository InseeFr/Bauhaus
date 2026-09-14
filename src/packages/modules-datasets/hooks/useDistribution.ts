import { useQuery } from "@tanstack/react-query";

import { DistributionApi } from "@sdk/distributions-api";

export const useDistribution = (id: string | undefined) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["distributions", id],
    queryFn: () => DistributionApi.getById(id),
  });
};
