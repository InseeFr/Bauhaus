import { PartialDistribution } from "@model/Dataset";
import { DistributionApi } from "@sdk/distributions-api";
import { useQuery } from "@tanstack/react-query";

export const useDistributions = () => {
  return useQuery<PartialDistribution[]>({
    queryFn: () => DistributionApi.getAll(),
    queryKey: ["distributions"],
  });
};
