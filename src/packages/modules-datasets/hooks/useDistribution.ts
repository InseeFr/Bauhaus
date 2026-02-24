import { DistributionApi } from "@sdk/distributions-api";
import { useQuery } from "@tanstack/react-query";

export const useDistribution = (id: string) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["distributions", id],
    queryFn: () => DistributionApi.getById(id),
  });
};
