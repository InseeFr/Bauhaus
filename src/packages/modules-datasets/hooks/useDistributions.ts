import { useQuery } from "@tanstack/react-query";

import { PartialDistribution } from "@model/Dataset";

import { DistributionApi } from "@sdk/distributions-api";

export const useDistributions = () => {
  return useQuery<PartialDistribution[]>({
    queryFn: () => DistributionApi.getAll(),
    queryKey: ["distributions"],
  });
};
